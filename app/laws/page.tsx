import { LawLibrary } from "@/components/features/laws/LawLibrary";
import { Suspense } from "react";

export default function LawsPage() {
  return (
    <main className="bg-muted/30">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading legal library...</p>}>
      <LawLibrary />
    </Suspense>
      </section>
    </main>
  );
}
