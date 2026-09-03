"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  HeartHandshake,
  Landmark,
  LoaderCircle,
  Search,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type SupportResource = {
  id: string;
  name: string;
  description: string;
  region: "BANGLADESH" | "INTERNATIONAL";
  serviceType: string;
  urgency: "IMMEDIATE" | "TIME_SENSITIVE" | "GUIDANCE";
  contactLabel: string;
  contactValue: string;
  contactUrl: string | null;
  availability: string | null;
  languages: string[];
  eligibility: string | null;
  isOfficial: boolean;
  sourceUrl: string;
};

const serviceLabels: Record<string, string> = {
  ALL: "All support",
  EMERGENCY: "Emergency",
  CYBER_REPORTING: "Cyber reporting",
  REPORTING: "Police reporting",
  PROTECTION: "Protection",
  CHILD_SAFETY: "Child safety",
  FINANCIAL_SAFETY: "Financial fraud",
  LEGAL_AID: "Legal aid",
  MENTAL_HEALTH: "Mental health",
  HUMAN_RIGHTS: "Human rights",
  GOVERNMENT_REFERRAL: "Government referral",
  IMAGE_ABUSE: "Image abuse",
  ETHICAL_HACKER: "Ethical hackers",
  INTERNATIONAL_REPORTING: "International guidance",
};
const urgencyStyle: Record<SupportResource["urgency"], string> = {
  IMMEDIATE: "border-rose-200 bg-rose-50 text-rose-800",
  TIME_SENSITIVE: "border-amber-200 bg-amber-50 text-amber-800",
  GUIDANCE: "border-sky-200 bg-sky-50 text-sky-800",
};

function formatServiceType(value: string) {
  return serviceLabels[value] ?? value.toLowerCase().replaceAll("_", " ");
}

export default function ProfessionalsPage() {
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [region, setRegion] = useState("ALL");
  const [serviceType, setServiceType] = useState("ALL");
  const [urgency, setUrgency] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams();
    if (region !== "ALL") query.set("region", region);
    if (serviceType !== "ALL") query.set("serviceType", serviceType);
    if (urgency !== "ALL") query.set("urgency", urgency);
    if (search.trim()) query.set("search", search.trim());
    async function loadResources() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/support-resources?${query.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error("Unable to load the support directory.");
        const payload = (await response.json()) as { data: SupportResource[] };
        setResources(payload.data);
      } catch (requestError: unknown) {
        if (requestError instanceof Error && requestError.name !== "AbortError")
          setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    void loadResources();
    return () => controller.abort();
  }, [region, serviceType, urgency, search]);

  const types = [
    "ALL",
    ...Array.from(new Set(resources.map((resource) => resource.serviceType))),
  ];
  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16 text-slate-950">
      <section className="overflow-hidden bg-[#092d2a] px-5 py-12 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-teal-200 uppercase">
              <HeartHandshake className="size-4" /> Professional advice &
              emergency support
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Find the right help, before the harm grows.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-teal-50/80 sm:text-lg">
              Official Bangladesh contacts, trusted international reporting
              tools, and safe routes to legal, wellbeing, and authorized
              technical support.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-300/30 bg-rose-500/15 p-5 shadow-2xl shadow-black/20">
            <div className="flex items-start gap-3">
              <Siren className="mt-0.5 size-6 shrink-0 text-rose-200" />
              <div>
                <p className="font-bold">Immediate danger in Bangladesh?</p>
                <p className="mt-1 text-sm leading-6 text-rose-50/85">
                  Call National Emergency Service for police, fire, or ambulance
                  support. Do not wait for an online reply.
                </p>
                <a
                  href="tel:999"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-extrabold text-rose-800 transition hover:bg-rose-50"
                >
                  Call 999 <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="relative -mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/8 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(3,0.7fr)]">
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <span className="sr-only">Search support services</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search: hacked account, harassment, legal aid..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-10 text-sm outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
              />
            </label>
            <Select
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                ["ALL", "All regions"],
                ["BANGLADESH", "Bangladesh"],
                ["INTERNATIONAL", "International"],
              ]}
            />
            <Select
              label="Need"
              value={serviceType}
              onChange={setServiceType}
              options={types.map((type) => [type, formatServiceType(type)])}
            />
            <Select
              label="Urgency"
              value={urgency}
              onChange={setUrgency}
              options={[
                ["ALL", "Any urgency"],
                ["IMMEDIATE", "Immediate"],
                ["TIME_SENSITIVE", "Time-sensitive"],
                ["GUIDANCE", "Guidance"],
              ]}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-teal-800">
              Verified resource directory
            </p>
            <p className="text-sm text-slate-500">
              {loading
                ? "Updating results..."
                : `${resources.length} resources matched your filters`}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <BadgeCheck className="size-4 text-teal-700" /> Links go to the
            organization&apos;s official source.
          </p>
        </div>
        {error ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </div>
        ) : null}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="size-5 animate-spin" /> Loading support
            resources
          </div>
        ) : null}
        {!loading && !error ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : null}
        {!loading && !error && resources.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Search className="mx-auto size-8 text-slate-400" />
            <p className="mt-3 font-bold">No matching support resources</p>
            <p className="mt-1 text-sm text-slate-500">
              Broaden the filters or search with a different incident type.
            </p>
          </div>
        ) : null}
        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          <GuidanceCard
            icon={<ShieldAlert className="size-5" />}
            title="Preserve, do not escalate"
            text="Keep screenshots, links, dates, usernames, transaction IDs, and emails. Do not send money, passwords, OTPs, NID details, or intimate images to anyone."
          />
          <GuidanceCard
            icon={<BriefcaseBusiness className="size-5" />}
            title="Ethical hackers work with permission"
            text="Use an authorized specialist only for systems you own or are explicitly authorized to test. A legitimate engagement has written scope and clear reporting."
          />
          <GuidanceCard
            icon={<Landmark className="size-5" />}
            title="Professional advice is not representation"
            text="This directory provides routes to help. For a legal case, obtain advice from a qualified lawyer or legal-aid provider for your circumstances."
          />
        </section>
      </section>
    </main>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
function ResourceCard({ resource }: { resource: SupportResource }) {
  const isImmediate = resource.urgency === "IMMEDIATE";
  return (
    <article
      className={`group flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${isImmediate ? "border-rose-200" : "border-slate-200"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            {resource.region === "BANGLADESH" ? "Bangladesh" : "International"}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${urgencyStyle[resource.urgency]}`}
          >
            {resource.urgency.replaceAll("_", " ")}
          </span>
        </div>
        {resource.isOfficial ? (
          <BadgeCheck
            className="size-5 shrink-0 text-teal-700"
            aria-label="Official source"
          />
        ) : null}
      </div>
      <p className="mt-5 text-xs font-bold tracking-[0.12em] text-teal-700 uppercase">
        {formatServiceType(resource.serviceType)}
      </p>
      <h2 className="mt-2 text-xl font-extrabold leading-6 text-slate-950">
        {resource.name}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {resource.description}
      </p>
      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        <p>
          <span className="font-bold text-slate-700">Access:</span>{" "}
          {resource.availability ?? "See source"}
        </p>
        <p>
          <span className="font-bold text-slate-700">For:</span>{" "}
          {resource.eligibility ?? "See source"}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={resource.contactUrl ?? resource.sourceUrl}
          target={
            resource.contactUrl?.startsWith("http") ? "_blank" : undefined
          }
          rel={
            resource.contactUrl?.startsWith("http") ? "noreferrer" : undefined
          }
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${isImmediate ? "bg-rose-700 text-white hover:bg-rose-800" : "bg-teal-800 text-white hover:bg-teal-900"}`}
        >
          {resource.contactLabel}
          <ArrowUpRight className="size-4" />
        </a>
        <a
          href={resource.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 underline-offset-4 hover:text-teal-800 hover:underline"
        >
          Official source <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </article>
  );
}
function GuidanceCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-teal-700 text-white">
        {icon}
      </div>
      <h2 className="mt-4 font-extrabold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
