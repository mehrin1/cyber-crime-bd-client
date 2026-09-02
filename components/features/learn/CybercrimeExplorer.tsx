"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSearch,
  Search,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Law = { slug: string; title: string; region: string; status: string };
type Crime = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  subtypes: string[];
  immediateSteps: string[];
  evidenceChecklist: string[];
  legalReferences: Array<{ id: string; guidance: string; law: Law }>;
};

export function CybercrimeExplorer() {
  const [crimes, setCrimes] = useState<Crime[] | null>(null);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const query = new URLSearchParams();
    if (deferredSearch) query.set("search", deferredSearch);
    if (category) query.set("category", category);
    const controller = new AbortController();
    void fetch(`/api/crimes?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setCrimes(payload.data);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") setCrimes([]);
      });
    return () => controller.abort();
  }, [deferredSearch, category]);

  const selected =
    crimes?.find((crime) => crime.slug === selectedSlug) || crimes?.[0];
  const categories = [
    "Fraud and deception",
    "Unauthorised access",
    "Financial crime",
    "Abuse and harassment",
    "Abuse and exploitation",
    "Identity and privacy",
    "Child protection",
  ];

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl bg-[linear-gradient(125deg,#3b0764,#7e22ce_52%,#db2777)] px-6 py-11 text-white shadow-xl shadow-fuchsia-950/15 sm:px-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
          Cybercrime guide
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Recognise the harm. Protect the evidence. Find the legal pathway.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-fuchsia-100">
          Explore major cybercrime categories and common variants, with
          immediate safety steps, evidence checklists, and live references to
          the legal library.
        </p>
      </section>
      <Card className="border bg-background">
        <CardContent className="p-5">
          <label className="relative block">
            <span className="sr-only">Search cybercrime types</span>
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search phishing, fraud, blackmail, account takeover..."
            />
          </label>
        </CardContent>
      </Card>
      {!crimes ? (
        <p className="text-sm text-muted-foreground">
          Loading cybercrime guide...
        </p>
      ) : (
        <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <div>
            <label className="mb-4 grid max-w-sm gap-2 text-sm font-medium">
              Filter by cybercrime category
              <select
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">All cybercrime types</option>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              {crimes.map((crime) => (
                <button
                  key={crime.id}
                  type="button"
                  onClick={() => setSelectedSlug(crime.slug)}
                  className="text-left"
                >
                  <Card
                    className={`h-full border transition hover:-translate-y-0.5 hover:shadow-md ${selected?.id === crime.id ? "border-fuchsia-500 ring-2 ring-fuchsia-500/15" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <p className="text-xs font-semibold tracking-wide text-fuchsia-700 uppercase">
                        {crime.category}
                      </p>
                      <CardTitle className="mt-2 text-lg">
                        {crime.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {crime.description}
                      </p>
                      <p className="mt-4 text-xs font-medium text-muted-foreground">
                        {crime.subtypes.length} common forms
                      </p>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
          <aside className="xl:sticky xl:top-6">
            {selected ? (
              <Card className="overflow-hidden border shadow-lg shadow-slate-950/5">
                <CardHeader className="bg-[linear-gradient(120deg,#fdf4ff,#faf5ff)] p-6">
                  <div className="flex gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-fuchsia-700 text-white">
                      <ShieldAlert className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-fuchsia-700 uppercase">
                        {selected.category}
                      </p>
                      <CardTitle className="mt-2 text-xl leading-7">
                        {selected.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {selected.description}
                  </p>
                  <div>
                    <h2 className="text-sm font-semibold">Common forms</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.subtypes.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border px-2.5 py-1 text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Immediate steps
                    </h2>
                    <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                      {selected.immediateSteps.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span className="font-semibold text-fuchsia-700">
                            {index + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <FileSearch className="size-4 text-sky-700" />
                      Preserve
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                      {selected.evidenceChecklist.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <BookOpen className="size-4 text-amber-600" />
                      Legal references
                    </h2>
                    <div className="mt-3 space-y-2">
                      {selected.legalReferences.map(({ id, law }) => (
                        <Link
                          key={id}
                          href={`/laws?law=${law.slug}`}
                          className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm font-medium transition hover:border-fuchsia-300 hover:bg-fuchsia-50"
                        >
                          <span>{law.title}</span>
                          <ArrowRight className="size-4 shrink-0 text-fuchsia-700" />
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Button
                    render={<Link href="/laws" />}
                    nativeButton={false}
                    className="w-full"
                  >
                    Browse full legal library <ArrowRight />
                  </Button>
                  <p className="text-xs leading-5 text-muted-foreground">
                    This guide is general information, not legal advice. In an
                    immediate safety emergency, contact local emergency
                    services.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No cybercrime type matches your search.
                </CardContent>
              </Card>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
