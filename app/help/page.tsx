"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileWarning,
  LockKeyhole,
  MessageCircleMore,
  Send,
  ShieldAlert,
  Siren,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

type HelpCategory =
  | "LEGAL"
  | "MENTAL"
  | "EMERGENCY"
  | "ACCOUNT_SECURITY"
  | "ONLINE_HARASSMENT"
  | "FINANCIAL_FRAUD"
  | "IMAGE_ABUSE"
  | "CHILD_SAFETY";
type HelpRequest = {
  id: string;
  title: string;
  category: HelpCategory;
  isAnonymous: boolean;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
};
type HelpMessage = {
  id: string;
  senderType: "USER" | "PROFESSIONAL";
  text: string;
  createdAt: string;
};
const categories: {
  value: HelpCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "ACCOUNT_SECURITY",
    label: "Account or device security",
    description: "Hacked account, impersonation, malware, or data exposure",
  },
  {
    value: "ONLINE_HARASSMENT",
    label: "Online harassment",
    description: "Threats, stalking, bullying, or abusive messages",
  },
  {
    value: "FINANCIAL_FRAUD",
    label: "Financial fraud",
    description: "Scam, unauthorized transaction, or mobile-finance issue",
  },
  {
    value: "IMAGE_ABUSE",
    label: "Image-based abuse",
    description: "Non-consensual images, blackmail, or intimate-content threat",
  },
  {
    value: "CHILD_SAFETY",
    label: "Child safety",
    description: "Grooming, exploitation, or cyberbullying involving a child",
  },
  {
    value: "LEGAL",
    label: "Legal information",
    description: "Evidence, reporting route, or rights-related guidance",
  },
  {
    value: "MENTAL",
    label: "Wellbeing support",
    description: "Distress, anxiety, or emotional impact after online harm",
  },
  {
    value: "EMERGENCY",
    label: "Immediate risk",
    description: "An urgent threat to safety that needs emergency help",
  },
];
const statusStyle = {
  PENDING: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-100 text-slate-700",
};

export default function HelpPage() {
  const { data: session, isPending } = authClient.useSession();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [selected, setSelected] = useState<HelpRequest | null>(null);
  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sending, setSending] = useState(false);
  async function loadRequests(selectId?: string) {
    if (!session?.user) return;
    setLoadingRequests(true);
    const response = await fetch("/api/help-requests", {
      credentials: "include",
    });
    setLoadingRequests(false);
    if (!response.ok) return;
    const payload = (await response.json()) as { data: HelpRequest[] };
    setRequests(payload.data);
    setSelected(
      selectId
        ? (payload.data.find((request) => request.id === selectId) ?? null)
        : null,
    );
  }
  useEffect(() => {
    let cancelled = false;
    async function fetchRequests() {
      if (!session?.user) return;
      setLoadingRequests(true);
      const response = await fetch("/api/help-requests", {
        credentials: "include",
      });
      if (cancelled) return;
      setLoadingRequests(false);
      if (!response.ok) return;
      const payload = (await response.json()) as { data: HelpRequest[] };
      setRequests(payload.data);
      setSelected(null);
    }
    void fetchRequests();
    return () => {
      cancelled = true;
    };
  }, [session?.user]);
  useEffect(() => {
    if (!selected || !session?.user) {
      return;
    }
    fetch(`/api/help-requests/${selected.id}/messages`, {
      credentials: "include",
    })
      .then(async (response) =>
        response.ok
          ? (response.json() as Promise<{ data: HelpMessage[] }>)
          : Promise.reject(),
      )
      .then((payload) => setMessages(payload.data))
      .catch(() => setMessages([]));
  }, [selected, session?.user]);
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !messageText.trim()) return;
    setSending(true);
    setMessageError("");
    const response = await fetch(`/api/help-requests/${selected.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text: messageText.trim() }),
    });
    const payload = await response.json();
    setSending(false);
    if (!response.ok) {
      setMessageError(payload.message || "Unable to send the message.");
      return;
    }
    setMessages((current) => [...current, payload.data]);
    setMessageText("");
    void loadRequests(selected.id);
  }
  return (
    <main className="min-h-screen bg-[#f7f8f7] pb-16 text-slate-950">
      <section className="bg-[#092d2a] px-5 py-12 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-teal-200 uppercase">
              <ShieldAlert className="size-4" /> Private support desk
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Get a safer next step.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-teal-50/80">
              Describe what happened. We will help organize the right reporting,
              evidence, legal, wellbeing, or safety route. This is not an
              emergency-response service.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-300/30 bg-rose-500/15 p-5">
            <div className="flex gap-3">
              <Siren className="mt-0.5 size-6 shrink-0 text-rose-200" />
              <div>
                <p className="font-extrabold">Immediate danger?</p>
                <p className="mt-1 text-sm leading-6 text-rose-50/85">
                  If you or someone else may be harmed, contact Bangladesh
                  National Emergency Service now. Do not wait for a support
                  reply.
                </p>
                <a
                  href="tel:999"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-rose-800"
                >
                  Call 999 <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-4 py-8 md:grid-cols-3">
          <ActionCard
            icon={<AlertTriangle className="size-5" />}
            title="Need an official emergency route?"
            text="Police, child protection, financial fraud, and image-abuse resources are listed in Professional Advice."
            href="/professionals"
            action="View emergency resources"
          />
          <ActionCard
            icon={<LockKeyhole className="size-5" />}
            title="Keep sensitive data private"
            text="Do not share passwords, OTPs, NID details, banking PINs, or intimate images in this form or a chat."
          />
          <ActionCard
            icon={<FileWarning className="size-5" />}
            title="Preserve evidence"
            text="Keep original links, screenshots, usernames, dates, transaction references, and threatening messages."
          />
        </div>
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <HelpRequestForm
            signedIn={Boolean(session?.user)}
            sessionLoading={isPending}
            onSubmitted={(request) => {
              if (request) void loadRequests(request.id);
            }}
          />
          {session?.user ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-teal-800">
                    Your private cases
                  </p>
                  <h2 className="mt-1 text-2xl font-black">Case follow-up</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Only you and authorized support staff can access these
                    account-linked cases.
                  </p>
                </div>
                <MessageCircleMore className="size-6 text-teal-700" />
              </div>
              {loadingRequests ? (
                <p className="py-10 text-sm text-slate-500">
                  Loading your cases...
                </p>
              ) : requests.length === 0 ? (
                <EmptyCases />
              ) : (
                <div className="mt-5 grid gap-3 lg:grid-cols-[0.7fr_1.3fr]">
                  <div className="space-y-2">
                    {requests.map((request) => (
                      <button
                        key={request.id}
                        onClick={() => setSelected(request)}
                        className={`w-full rounded-xl border p-3 text-left transition ${selected?.id === request.id ? "border-teal-700 bg-teal-50" : "border-slate-200 hover:border-teal-300"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold">{request.title}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle[request.status]}`}
                          >
                            {request.status.replaceAll("_", " ")}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {categoryLabel(request.category)} ·{" "}
                          {formatDate(request.updatedAt)}
                        </p>
                      </button>
                    ))}
                  </div>
                  <CaseConversation
                    request={selected}
                    messages={messages}
                    messageText={messageText}
                    setMessageText={setMessageText}
                    sending={sending}
                    error={messageError}
                    onSend={sendMessage}
                  />
                </div>
              )}
            </section>
          ) : (
            <SignedOutCaseNotice />
          )}
        </div>
      </section>
    </main>
  );
}
function HelpRequestForm({
  signedIn,
  sessionLoading,
  onSubmitted,
}: {
  signedIn: boolean;
  sessionLoading: boolean;
  onSubmitted: (request: HelpRequest | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HelpCategory>("ACCOUNT_SECURITY");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isAnonymous = !signedIn || anonymous;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    const response = await fetch("/api/help-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        category,
        isAnonymous,
      }),
    });
    const payload = await response.json();
    setSubmitting(false);
    if (!response.ok) {
      setError(payload.message || "Unable to submit your request.");
      return;
    }
    setTitle("");
    setDescription("");
    setSuccess(
      isAnonymous
        ? "Your anonymous request was received. It cannot be retrieved or followed up online."
        : "Your private case was created. You can follow it up from the panel beside this form.",
    );
    onSubmitted(anonymous ? null : payload.data);
  }
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-bold text-teal-800">Start a support request</p>
      <h2 className="mt-1 text-2xl font-black">Tell us only what is needed</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        A clear timeline helps identify the safest next step. Do not include
        highly sensitive credentials or files.
      </p>
      <form className="mt-6 space-y-5" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-bold">
          What best describes the situation?
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as HelpCategory)
            }
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-teal-700 focus:ring-3 focus:ring-teal-100"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <span className="font-normal text-slate-500">
            {categories.find((item) => item.value === category)?.description}
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Short title
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={3}
            maxLength={150}
            placeholder="Example: My Facebook account was taken over"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          What happened?
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={10}
            maxLength={5000}
            rows={7}
            placeholder="Include what happened, when it began, the platform involved, and any immediate safety concern. Do not include passwords or OTPs."
            required
          />
        </label>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-amber-950">Submit anonymously</p>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                {isAnonymous
                  ? "No account is attached. You will not be able to view this case or receive online follow-up."
                  : "Your account is attached so the case and future secure messages appear in your dashboard."}
              </p>
            </div>
            <input
              aria-label="Submit anonymously"
              type="checkbox"
              checked={isAnonymous}
              disabled={!signedIn || sessionLoading}
              onChange={(event) => setAnonymous(event.target.checked)}
              className="mt-1 size-4 accent-teal-700"
            />
          </div>
          {!signedIn && !sessionLoading ? (
            <p className="mt-3 text-xs text-amber-900">
              Sign in before submitting if you want to track your case and use
              secure messages.
            </p>
          ) : null}
        </div>
        {error ? (
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="flex gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            <CheckCircle2 className="size-5 shrink-0" />
            {success}
          </p>
        ) : null}
        <Button
          type="submit"
          size="lg"
          disabled={submitting || sessionLoading}
          className="w-full"
        >
          {submitting ? "Submitting securely..." : "Create support request"}
          <ArrowUpRight />
        </Button>
      </form>
    </section>
  );
}
function CaseConversation({
  request,
  messages,
  messageText,
  setMessageText,
  sending,
  error,
  onSend,
}: {
  request: HelpRequest | null;
  messages: HelpMessage[];
  messageText: string;
  setMessageText: (value: string) => void;
  sending: boolean;
  error: string;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!request)
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-slate-500">
        Select a case to view its details and secure conversation.
      </div>
    );
  return (
    <div className="rounded-xl border border-slate-200">
      <div className="border-b p-4">
        <p className="font-extrabold">{request.title}</p>
        <p className="mt-1 text-xs text-slate-500">
          {categoryLabel(request.category)} · Submitted{" "}
          {formatDate(request.createdAt)}
        </p>
      </div>
      <div className="max-h-72 min-h-36 space-y-3 overflow-y-auto bg-slate-50/60 p-4">
        {messages.length ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-5 ${message.senderType === "USER" ? "ml-auto bg-teal-800 text-white" : "bg-white text-slate-800 shadow-sm"}`}
            >
              <p>{message.text}</p>
              <p
                className={`mt-1 text-[10px] ${message.senderType === "USER" ? "text-teal-100" : "text-slate-400"}`}
              >
                {message.senderType === "USER" ? "You" : "Support"} ·{" "}
                {formatDate(message.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No messages yet. Add context or wait for a support response.
          </p>
        )}
      </div>
      <form onSubmit={onSend} className="border-t p-3">
        <Textarea
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          rows={2}
          maxLength={3000}
          placeholder="Add relevant information. Never send passwords, OTPs, or banking PINs."
        />
        {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
        <Button
          type="submit"
          size="sm"
          disabled={sending || !messageText.trim()}
          className="mt-3"
        >
          {sending ? "Sending..." : "Send message"}
          <Send />
        </Button>
      </form>
    </div>
  );
}
function ActionCard({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href?: string;
  action?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex size-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
        {icon}
      </div>
      <h2 className="mt-4 font-extrabold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      {href && action ? (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-teal-800 hover:underline"
        >
          {action}
          <ArrowUpRight className="size-4" />
        </Link>
      ) : null}
    </article>
  );
}
function EmptyCases() {
  return (
    <div className="mt-5 rounded-xl border border-dashed p-8 text-center">
      <MessageCircleMore className="mx-auto size-7 text-slate-400" />
      <p className="mt-3 text-sm font-bold">No private cases yet</p>
      <p className="mt-1 text-sm text-slate-500">
        Create a non-anonymous request to keep its status and messages here.
      </p>
    </div>
  );
}
function SignedOutCaseNotice() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <LockKeyhole className="size-7 text-teal-800" />
      <h2 className="mt-4 text-2xl font-black">Track support privately</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
        Sign in to keep a private record of your case, see status updates, and
        use secure follow-up messages. Anonymous requests cannot be retrieved
        later.
      </p>
      <Button
        className="mt-5"
        render={<Link href="/login?callbackURL=/help" />}
      >
        Sign in to track a case
        <ArrowUpRight />
      </Button>
    </section>
  );
}
function categoryLabel(category: HelpCategory) {
  return (
    categories.find((item) => item.value === category)?.label ??
    category.replaceAll("_", " ")
  );
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
