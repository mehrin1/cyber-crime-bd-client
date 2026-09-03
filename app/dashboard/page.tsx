"use client";

import {
  BarChart3,
  ClipboardList,
  MessageCircle,
  FileText,
  LoaderCircle,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type UserDashboard = {
  profile: {
    name: string;
    email: string;
    image: string | null;
    role: "USER" | "PROFESSIONAL" | "ADMIN";
    createdAt: string;
  };
  activity: {
    surveys: { id: string; submittedAt: string; survey: { title: string } }[];
    helpRequests: {
      id: string;
      title: string;
      category: string;
      status: string;
      updatedAt: string;
    }[];
    sentMessageCount: number;
    communityPosts: {
      id: string;
      title: string;
      createdAt: string;
      _count: { likes: number; comments: number };
    }[];
  };
};

type AdminDashboard = {
  userCount: number;
  surveyResponseCount: number;
  helpRequestCount: number;
  pendingHelpRequestCount: number;
  recentUsers: { id: string; name: string; role: string; createdAt: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboard | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user)
      router.replace("/login?callbackURL=/dashboard");
  }, [isPending, router, session?.user]);

  useEffect(() => {
    if (!session?.user) return;
    let active = true;
    fetch("/api/dashboard/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load your dashboard.");
        return response.json() as Promise<{ data: UserDashboard }>;
      })
      .then((payload) => {
        if (!active) return;
        setDashboard(payload.data);
        if (payload.data.profile.role === "ADMIN") {
          return fetch("/api/dashboard/admin", { credentials: "include" })
            .then(async (response) => {
              if (!response.ok)
                throw new Error("Unable to load the admin dashboard.");
              return response.json() as Promise<{ data: AdminDashboard }>;
            })
            .then((adminPayload) => {
              if (active) setAdminDashboard(adminPayload.data);
            });
        }
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load your dashboard.",
          );
      });
    return () => {
      active = false;
    };
  }, [session?.user]);

  if (isPending || (session?.user && !dashboard && !error)) return <Loading />;
  if (!session?.user) return <Loading />;
  if (error)
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </p>
      </main>
    );
  if (!dashboard) return null;

  const { profile, activity } = dashboard;
  return (
    <main className="min-h-screen bg-[#f7f8f7] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl bg-[#092d2a] px-6 py-8 text-white sm:px-9">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-teal-200 uppercase">
                <ShieldCheck className="size-4" />{" "}
                {profile.role === "ADMIN"
                  ? "Administrator dashboard"
                  : "Your private dashboard"}
              </p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                Welcome, {profile.name}.
              </h1>
              <p className="mt-3 text-sm leading-6 text-teal-50/80">
                Your saved surveys, support requests, and future secure activity
                will appear here.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm">
              <p className="font-bold">{profile.email}</p>
              <p className="mt-1 text-teal-100/70">
                {profile.role.toLowerCase()} account
              </p>
            </div>
          </div>
        </section>
        {profile.role === "ADMIN" ? <AdminPanel data={adminDashboard} /> : null}
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={<FileText className="size-5" />}
            label="Survey responses"
            value={activity.surveys.length}
            note="Recent linked responses"
          />
          <Metric
            icon={<ClipboardList className="size-5" />}
            label="Support requests"
            value={activity.helpRequests.length}
            note="Requests connected to your account"
          />
          <Metric
            icon={<MessageSquareText className="size-5" />}
            label="Messages sent"
            value={activity.sentMessageCount}
            note="Future secure support chat activity"
          />
          <Metric
            icon={<MessageCircle className="size-5" />}
            label="Community posts"
            value={activity.communityPosts.length}
            note="Your recent shared experiences"
          />
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <ActivityPanel
            title="Your survey contributions"
            empty="No account-linked survey responses yet."
            actionHref="/research"
            actionText="Take the survey"
          >
            {activity.surveys.map((survey) => (
              <Row
                key={survey.id}
                title={survey.survey.title}
                detail={`Submitted ${formatDate(survey.submittedAt)}`}
              />
            ))}
          </ActivityPanel>
          <ActivityPanel
            title="Your support requests"
            empty="No account-linked support requests yet."
            actionHref="/help"
            actionText="Seek help"
          >
            {activity.helpRequests.map((request) => (
              <Row
                key={request.id}
                title={request.title}
                detail={`${request.category.toLowerCase()} · ${request.status.toLowerCase().replaceAll("_", " ")} · Updated ${formatDate(request.updatedAt)}`}
              />
            ))}
          </ActivityPanel>
          <ActivityPanel
            title="Your community posts"
            empty="You have not shared an experience yet."
            actionHref="/community?mine=true"
            actionText="View posts"
          >
            {activity.communityPosts.map((post) => (
              <Row
                key={post.id}
                title={post.title}
                detail={`${post._count.likes} likes · ${post._count.comments} comments · Posted ${formatDate(post.createdAt)}`}
              />
            ))}
          </ActivityPanel>
        </section>
      </div>
    </main>
  );
}

function AdminPanel({ data }: { data: AdminDashboard | null }) {
  if (!data)
    return (
      <div className="mt-8 rounded-2xl border bg-white p-5 text-sm text-slate-500">
        Loading administrative data...
      </div>
    );
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="size-5 text-teal-800" />
        <h2 className="text-xl font-extrabold">Platform overview</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<Users className="size-5" />}
          label="Registered users"
          value={data.userCount}
          note="All account types"
        />
        <Metric
          icon={<FileText className="size-5" />}
          label="Survey responses"
          value={data.surveyResponseCount}
          note="Completed submissions"
        />
        <Metric
          icon={<ClipboardList className="size-5" />}
          label="Support requests"
          value={data.helpRequestCount}
          note="All recorded requests"
        />
        <Metric
          icon={<MessageSquareText className="size-5" />}
          label="Pending requests"
          value={data.pendingHelpRequestCount}
          note="Requires review"
        />
      </div>
      <div className="mt-6 rounded-2xl border bg-white p-5">
        <h3 className="font-extrabold">Recently registered accounts</h3>
        <div className="mt-4 divide-y">
          {data.recentUsers.map((user) => (
            <Row
              key={user.id}
              title={user.name}
              detail={`${user.role.toLowerCase()} · Joined ${formatDate(user.createdAt)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
function Metric({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  note: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex size-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
        {icon}
      </div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-1 font-bold">{label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>
    </article>
  );
}
function ActivityPanel({
  title,
  empty,
  actionHref,
  actionText,
  children,
}: {
  title: string;
  empty: string;
  actionHref: string;
  actionText: string;
  children: ReactNode;
}) {
  const hasItems = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);
  return (
    <section className="rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-extrabold">{title}</h2>
        <Button variant="outline" size="sm" render={<Link href={actionHref} />}>
          {actionText}
        </Button>
      </div>
      <div className="mt-4 divide-y">
        {hasItems ? (
          children
        ) : (
          <p className="py-6 text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </section>
  );
}
function Row({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
      <LoaderCircle className="size-5 animate-spin" /> Loading dashboard
    </main>
  );
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
