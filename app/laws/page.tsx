import { LawLibrary } from "@/components/features/laws/LawLibrary";

export default function LawsPage() {
  return (
    <main className="bg-muted/30">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <LawLibrary />
      </section>
    </main>
  );
}
