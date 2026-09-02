import { SurveyResults } from "@/components/features/research/SurveyResults";

export default function SurveyResultsPage() {
  return (
    <main className="bg-muted/30">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Research dashboard</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Community survey results</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">Explore anonymized trends from the Cyberbullying, Cybersecurity Resilience, and Legal Awareness assessment.</p>
        <div className="mt-10"><SurveyResults /></div>
      </section>
    </main>
  );
}
