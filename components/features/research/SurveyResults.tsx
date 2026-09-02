"use client";

import { BarChart3, ListFilter, Search, Table2, Target, Users, X } from "lucide-react";
import { useDeferredValue, useEffect, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const surveySlug = "cyberbullying-resilience-legal-awareness-bd";

type Option = { value: string; label: string };
type FilterQuestion = { key: string; prompt: string; type: string; options: Option[] };
type ResultQuestion = {
  key: string;
  prompt: string;
  type: "SHORT_TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SCALE";
  responseCount: number;
  average: number | null;
  values: Array<Option & { count: number; percentage: number }>;
};
type Results = {
  survey: { title: string };
  responseCount: number;
  totalResponseCount: number;
  filters: { questions: FilterQuestion[] };
  questions: ResultQuestion[];
};
type View = "charts" | "table" | "details";

const chartColors = ["#4285F4", "#EA4335", "#FBBC04", "#34A853", "#A142F4", "#00ACC1", "#FF7043"];
const cohortQuestionKeys = ["age", "gender", "education-level", "residence", "division", "daily-internet-usage", "harm-frequency"];

function BrickBars({ question }: { question: ResultQuestion }) {
  return (
    <div className="space-y-3.5">
      {question.values.map((value, index) => {
        const color = chartColors[index % chartColors.length];
        return (
          <div key={value.value} className="grid gap-1.5">
            <div className="flex items-start justify-between gap-3 text-[13px]">
              <span className="line-clamp-2 leading-5 font-medium">{value.label}</span>
              <span className="shrink-0 font-semibold tabular-nums" style={{ color }}>{value.count}<span className="ml-1 font-normal text-muted-foreground">{value.percentage}%</span></span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted" aria-label={`${value.label}: ${value.count} responses, ${value.percentage}%`}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value.percentage}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ question }: { question: ResultQuestion }) {
  const populatedValues = question.values.filter((value) => value.count > 0);
  const stops = populatedValues.map((value, index) => {
    const start = populatedValues.slice(0, index).reduce((total, item) => total + item.percentage, 0);
    return `${chartColors[index % chartColors.length]} ${start}% ${start + value.percentage}%`;
  });
  const style: CSSProperties = { background: `conic-gradient(${stops.join(", ")})` };

  return (
    <div className="grid grid-cols-[116px_minmax(0,1fr)] items-center gap-5">
      <div className="relative grid size-[7.25rem] place-items-center rounded-full shadow-[0_12px_30px_-18px_rgba(15,23,42,0.5)]" style={style}>
        <div className="grid size-[4.75rem] place-items-center rounded-full bg-background text-center shadow-inner">
          <strong className="text-xl tracking-tight">{question.responseCount}</strong>
          <span className="text-[10px] text-muted-foreground">answers</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {question.values.map((value, index) => (
          <div key={value.value} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2"><span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /> <span className="truncate">{value.label}</span></span>
            <span className="shrink-0 font-semibold tabular-nums">{value.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionChart({ question }: { question: ResultQuestion }) {
  if (question.type === "SHORT_TEXT") {
    return (
      <p className="text-sm text-muted-foreground">
        {question.responseCount} response{question.responseCount === 1 ? "" : "s"} received. Free-text responses are not published to protect participants.
      </p>
    );
  }

  if (!question.responseCount) {
    return <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No matching responses for this question.</p>;
  }

  const showDonut = question.type === "SINGLE_CHOICE" && question.values.length <= 5;
  return (
    <div className="space-y-4">
      {question.type === "SCALE" && question.average !== null ? (
        <div className="flex items-center justify-between rounded-2xl bg-[linear-gradient(135deg,#eff6ff,#f8fafc)] px-4 py-3 dark:bg-muted">
          <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-muted-foreground">Average rating</span>
          <span className="text-xl font-bold text-blue-600">{question.average} <span className="text-sm font-normal text-muted-foreground">/ 4</span></span>
        </div>
      ) : null}
      {showDonut ? <DonutChart question={question} /> : <BrickBars question={question} />}
    </div>
  );
}

function QuestionCard({ question, index }: { question: ResultQuestion; index: number }) {
  const accent = chartColors[index % chartColors.length];
  return (
    <Card className="group relative min-w-0 overflow-hidden border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
      <CardHeader className="gap-2 px-5 pt-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="line-clamp-3 text-[15px] leading-6 font-semibold">{question.prompt}</CardTitle>
          <span className="shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold" style={{ color: accent, backgroundColor: `${accent}18` }}>{question.responseCount}</span>
        </div>
        <CardDescription className="text-xs">{question.responseCount} participant answers</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pt-2 pb-5"><QuestionChart question={question} /></CardContent>
    </Card>
  );
}

function AnalyticsSnapshot({ results, activeFilterCount, focusQuestionKey }: { results: Results; activeFilterCount: number; focusQuestionKey: string }) {
  const cohortShare = results.totalResponseCount ? Math.round((results.responseCount / results.totalResponseCount) * 100) : 0;
  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
      <div className="rounded-2xl bg-[linear-gradient(135deg,#0f4c81,#2563eb_55%,#38bdf8)] p-5 text-white shadow-lg shadow-blue-900/10 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue-100 uppercase">Analysis cohort</p>
        <div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-4xl font-bold tracking-tight sm:text-5xl">{results.responseCount}</p><p className="mt-1 text-sm text-blue-100">of {results.totalResponseCount} survey responses</p></div><span className="rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur">{cohortShare}% included</span></div>
      </div>
      <Card className="border bg-background shadow-sm"><CardContent className="flex h-full items-center gap-4 p-5"><span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700"><Users className="size-5" /></span><div><p className="text-2xl font-bold">{activeFilterCount}</p><p className="text-sm text-muted-foreground">active cohort filters</p></div></CardContent></Card>
      <Card className="border bg-background shadow-sm"><CardContent className="flex h-full items-center gap-4 p-5"><span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Target className="size-5" /></span><div><p className="text-2xl font-bold">{focusQuestionKey ? "1" : results.questions.length}</p><p className="text-sm text-muted-foreground">questions in view</p></div></CardContent></Card>
    </section>
  );
}

export function SurveyResults() {
  const [results, setResults] = useState<Results | null>(null);
  const [view, setView] = useState<View>("charts");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [focusQuestionKey, setFocusQuestionKey] = useState("");
  const [cohortFilters, setCohortFilters] = useState<Record<string, string>>({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cohortQuestions = results?.filters.questions.filter((question) => cohortQuestionKeys.includes(question.key)) || [];
  const visibleQuestions = focusQuestionKey
    ? results?.questions.filter((question) => question.key === focusQuestionKey) || []
    : results?.questions || [];
  const activeCohortFilters = Object.entries(cohortFilters).flatMap(([key, value]) => {
    const question = results?.filters.questions.find((item) => item.key === key);
    const option = question?.options.find((item) => item.value === value);
    return question && option ? [{ key, question: question.prompt, option: option.label }] : [];
  });

  useEffect(() => {
    const query = new URLSearchParams();
    if (deferredSearch) query.set("search", deferredSearch);
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    Object.entries(cohortFilters).forEach(([key, value]) => query.append("filter", `${key}:${value}`));

    const controller = new AbortController();
    void fetch(`/api/surveys/${surveySlug}/results?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Unable to load survey results.");
        setResults(payload.data);
      })
      .catch((loadError: unknown) => {
        if ((loadError as { name?: string }).name !== "AbortError") {
          setError(loadError instanceof Error ? loadError.message : "Unable to load survey results.");
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [deferredSearch, cohortFilters, from, to]);

  function resetFilters() {
    setIsLoading(true);
    setError(null);
    setSearch("");
    setFocusQuestionKey("");
    setCohortFilters({});
    setFrom("");
    setTo("");
  }

  function updateCohortFilter(questionKey: string, optionValue: string) {
    setIsLoading(true);
    setError(null);
    setCohortFilters((current) => {
      const next = { ...current };
      if (optionValue) next[questionKey] = optionValue;
      else delete next[questionKey];
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border bg-background">
        <CardHeader className="gap-2 border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Explore responses</CardTitle>
              <CardDescription className="mt-1">Filter the aggregated results. Personal and free-text responses remain private.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters}>Clear filters</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium xl:col-span-2">
            Search answer text
            <span className="relative"><Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => { setIsLoading(true); setError(null); setSearch(event.target.value); }} placeholder="e.g. Facebook, yes, 18-25" /></span>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Chart focus
            <select className="h-8 rounded-lg border bg-background px-2 text-sm" value={focusQuestionKey} onChange={(event) => setFocusQuestionKey(event.target.value)}>
              <option value="">All questions</option>
              {results?.filters.questions.map((question) => <option key={question.key} value={question.key}>{question.prompt}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm font-medium">From<Input type="date" value={from} onChange={(event) => { setIsLoading(true); setError(null); setFrom(event.target.value); }} /></label>
            <label className="grid gap-2 text-sm font-medium">To<Input type="date" value={to} onChange={(event) => { setIsLoading(true); setError(null); setTo(event.target.value); }} /></label>
          </div>
          </div>
          <div className="border-t pt-5">
            <p className="mb-3 text-sm font-semibold">Cohort filters</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cohortQuestions.map((question) => (
                <label key={question.key} className="grid gap-2 text-sm font-medium">
                  {question.prompt}
                  <select className="h-8 rounded-lg border bg-background px-2 text-sm" value={cohortFilters[question.key] || ""} onChange={(event) => updateCohortFilter(question.key, event.target.value)}>
                    <option value="">All participants</option>
                    {question.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              ))}
            </div>
            {activeCohortFilters.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Active cohort</span>
                {activeCohortFilters.map((filter) => (
                  <Button key={filter.key} variant="secondary" size="xs" onClick={() => updateCohortFilter(filter.key, "")}>
                    {filter.question}: {filter.option}<X />
                  </Button>
                ))}
              </div>
            ) : <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">No cohort restriction applied. Results include all cleaned workbook responses.</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{isLoading ? "Updating results..." : `${results?.responseCount ?? 0} of ${results?.totalResponseCount ?? 0} responses in this cohort`}</p>
        <div className="flex rounded-lg border bg-background p-1">
          <Button variant={view === "charts" ? "secondary" : "ghost"} size="sm" onClick={() => setView("charts")}><BarChart3 />Charts</Button>
          <Button variant={view === "table" ? "secondary" : "ghost"} size="sm" onClick={() => setView("table")}><Table2 />Table</Button>
          <Button variant={view === "details" ? "secondary" : "ghost"} size="sm" onClick={() => setView("details")}><ListFilter />Details</Button>
        </div>
      </div>

      {error ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {!results && !error ? <p className="text-sm text-muted-foreground">Loading results...</p> : null}

      {results && view === "charts" ? (
        <div className="space-y-5">
          <AnalyticsSnapshot results={results} activeFilterCount={activeCohortFilters.length} focusQuestionKey={focusQuestionKey} />
          <div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {visibleQuestions.map((question, index) => <QuestionCard key={question.key} question={question} index={index} />)}
          </div>
        </div>
      ) : null}

      {results && view === "table" ? (
        <Card className="overflow-hidden border bg-background"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase"><tr><th className="p-4">Question</th><th className="p-4">Answer</th><th className="p-4 text-right">Responses</th><th className="p-4 text-right">Share</th></tr></thead><tbody>{visibleQuestions.flatMap((question) => question.type === "SHORT_TEXT" ? [{ question, value: { value: "text", label: "Private free-text responses", count: question.responseCount, percentage: 0 } }] : question.values.map((value) => ({ question, value }))).map(({ question, value }) => <tr key={`${question.key}-${value.value}`} className="border-t"><td className="max-w-md p-4 font-medium">{question.prompt}</td><td className="p-4">{value.label}</td><td className="p-4 text-right tabular-nums">{value.count}</td><td className="p-4 text-right tabular-nums">{question.type === "SHORT_TEXT" ? "-" : `${value.percentage}%`}</td></tr>)}</tbody></table></div></Card>
      ) : null}

      {results && view === "details" ? (
        <div className="space-y-3">{visibleQuestions.map((question) => <Card key={question.key} className="border bg-background"><CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-medium">{question.prompt}</p><p className="mt-1 text-sm text-muted-foreground">{question.type.replaceAll("_", " ").toLowerCase()} · {question.responseCount} answered</p></div><div className="text-sm text-muted-foreground">{question.type === "SCALE" && question.average !== null ? `Average: ${question.average} / 4` : question.type === "SHORT_TEXT" ? "Responses protected" : `${question.values.filter((value) => value.count > 0).length} answer options selected`}</div></CardContent></Card>)}</div>
      ) : null}
    </div>
  );
}
