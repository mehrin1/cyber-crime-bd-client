"use client";

import { BookOpen, ExternalLink, Landmark, Search, ShieldCheck } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Law = {
  id: string;
  slug: string;
  title: string;
  description: string;
  region: "BANGLADESH" | "INTERNATIONAL";
  category: string;
  authority: string;
  publishedDate: string;
  status: "IN_FORCE" | "REFERENCE" | "SUPERSEDED" | "NOT_IN_FORCE";
  legalTopics: string[];
  applicability: string[];
  source: string | null;
};

const categoryLabels: Record<string, string> = {
  CYBERCRIME: "Cybercrime",
  DATA_PROTECTION: "Data protection",
  HARASSMENT: "Harassment",
  FINANCIAL: "Financial crime",
  ELECTRONIC_EVIDENCE: "Electronic evidence",
  TELECOMMUNICATIONS: "Telecommunications",
  CHILD_PROTECTION: "Child protection",
  INTELLECTUAL_PROPERTY: "Intellectual property",
  INTERNATIONAL_COOPERATION: "International cooperation",
  PLATFORM_GOVERNANCE: "Platform governance",
};

const statusLabels: Record<Law["status"], string> = {
  IN_FORCE: "In force",
  REFERENCE: "Reference framework",
  SUPERSEDED: "Superseded",
  NOT_IN_FORCE: "Not in force",
};

function statusClass(status: Law["status"]) {
  if (status === "IN_FORCE") return "bg-emerald-100 text-emerald-800";
  if (status === "NOT_IN_FORCE") return "bg-amber-100 text-amber-800";
  if (status === "SUPERSEDED") return "bg-rose-100 text-rose-800";
  return "bg-sky-100 text-sky-800";
}

export function LawLibrary() {
  const [laws, setLaws] = useState<Law[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = new URLSearchParams();
    if (deferredSearch) query.set("search", deferredSearch);
    if (region) query.set("region", region);
    if (category) query.set("category", category);
    if (status) query.set("status", status);
    const controller = new AbortController();

    void fetch(`/api/laws?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Unable to load the legal library.");
        setLaws(payload.data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if ((loadError as { name?: string }).name !== "AbortError") {
          setError(loadError instanceof Error ? loadError.message : "Unable to load the legal library.");
        }
      });

    return () => controller.abort();
  }, [deferredSearch, region, category, status]);

  const selectedLaw = laws?.find((law) => law.slug === (selectedSlug || searchParams.get("law") || "")) || laws?.[0] || null;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#082f49,#0f4c81_52%,#0e7490)] px-6 py-10 text-white shadow-xl shadow-sky-950/15 sm:px-10 sm:py-14">
        <div className="absolute -top-28 -right-20 size-80 rounded-full border-[28px] border-white/10" />
        <div className="absolute -bottom-36 right-1/3 size-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">Legal reference library</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Cyber law, evidence, and digital-rights frameworks.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-sky-100 sm:text-lg">Search current Bangladesh legal instruments and key international frameworks. Each record is source-linked and tagged so future cybercrime types can point to the relevant legal pathway.</p>
        </div>
      </section>

      <Card className="border bg-background shadow-sm">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.5fr_repeat(3,minmax(0,0.55fr))]">
          <label className="relative block"><span className="sr-only">Search legal library</span><Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search law, topic, or problem, e.g. phishing, privacy, evidence" /></label>
          <select className="h-8 rounded-lg border bg-background px-2 text-sm" value={region} onChange={(event) => setRegion(event.target.value)}><option value="">All jurisdictions</option><option value="BANGLADESH">Bangladesh</option><option value="INTERNATIONAL">International</option></select>
          <select className="h-8 rounded-lg border bg-background px-2 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All legal areas</option>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <select className="h-8 rounded-lg border bg-background px-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </CardContent>
      </Card>

      {error ? <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p> : null}
      {!laws && !error ? <p className="text-sm text-muted-foreground">Loading legal library...</p> : null}

      {laws ? (
        <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(330px,0.7fr)]">
          <div>
            <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">{laws.length} legal record{laws.length === 1 ? "" : "s"}</p><span className="text-xs text-muted-foreground">Select a record for details</span></div>
            <div className="grid gap-4 md:grid-cols-2">
              {laws.map((law) => <button key={law.id} type="button" onClick={() => setSelectedSlug(law.slug)} className="text-left"><Card className={`h-full border transition-all hover:-translate-y-0.5 hover:shadow-md ${selectedLaw?.id === law.id ? "border-sky-500 ring-2 ring-sky-500/15" : ""}`}><CardHeader className="gap-3 pb-3"><div className="flex items-center justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(law.status)}`}>{statusLabels[law.status]}</span><span className="text-xs font-medium text-muted-foreground">{law.region === "BANGLADESH" ? "Bangladesh" : "International"}</span></div><CardTitle className="text-base leading-6">{law.title}</CardTitle></CardHeader><CardContent className="space-y-4"><CardDescription className="line-clamp-3 leading-6">{law.description}</CardDescription><div className="flex flex-wrap gap-1.5">{law.legalTopics.slice(0, 3).map((topic) => <span key={topic} className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">{topic}</span>)}</div></CardContent></Card></button>)}
            </div>
          </div>

          <aside className="xl:sticky xl:top-6">
            {selectedLaw ? <Card className="overflow-hidden border bg-background shadow-lg shadow-slate-950/5"><div className="bg-[linear-gradient(120deg,#ecfeff,#eff6ff)] p-6 dark:bg-muted"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-700 text-white"><Landmark className="size-5" /></span><div><p className="text-xs font-semibold tracking-[0.16em] text-sky-800 uppercase dark:text-sky-300">{categoryLabels[selectedLaw.category]}</p><h2 className="mt-2 text-xl leading-7 font-semibold">{selectedLaw.title}</h2></div></div></div><CardContent className="space-y-6 p-6"><p className="text-sm leading-7 text-muted-foreground">{selectedLaw.description}</p><div className="grid gap-3 rounded-xl border bg-muted/30 p-4 text-sm"><div><p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Authority</p><p className="mt-1 font-medium">{selectedLaw.authority}</p></div><div><p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Published / status</p><p className="mt-1 font-medium">{selectedLaw.publishedDate} · {statusLabels[selectedLaw.status]}</p></div></div><div><h3 className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-emerald-600" />Relevant problem types</h3><div className="mt-3 flex flex-wrap gap-2">{selectedLaw.applicability.map((item) => <span key={item} className="rounded-full border px-2.5 py-1 text-xs">{item}</span>)}</div></div><div><h3 className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="size-4 text-sky-700" />Legal topics</h3><div className="mt-3 flex flex-wrap gap-2">{selectedLaw.legalTopics.map((topic) => <span key={topic} className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">{topic}</span>)}</div></div>{selectedLaw.source ? <Button render={<a href={selectedLaw.source} target="_blank" rel="noreferrer" />} className="w-full"><ExternalLink />Open official or primary source</Button> : null}<p className="text-xs leading-5 text-muted-foreground">General legal information only. Verify the current legislation and obtain qualified legal advice for a specific case.</p></CardContent></Card> : <Card><CardContent className="p-6 text-sm text-muted-foreground">No law matches the selected filters.</CardContent></Card>}
          </aside>
        </section>
      ) : null}
    </div>
  );
}
