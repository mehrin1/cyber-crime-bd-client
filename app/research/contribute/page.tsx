import { SurveyForm } from "@/components/features/research/SurveyForm";

export default function ResearchContributionPage() {
  return (
    <main className="bg-muted/30 px-4 py-12 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Research contribution</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Assessment of Cyberbullying, Cybersecurity Resilience, and Legal Awareness in Bangladesh</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Please answer based on your own experience and current knowledge. Do not include passwords, financial account details, or identifying information beyond the optional email field.</p>
        <div className="mt-8"><SurveyForm /></div>
      </section>
    </main>
  );
}
