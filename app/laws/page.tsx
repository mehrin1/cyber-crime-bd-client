import { LawLibrary } from "@/components/features/laws/LawLibrary";
import { Suspense } from "react";

export default function LawsPage() {
  return (
    <main className="page-shell">
      <Suspense fallback={<p className="page-container px-5 py-10 text-sm text-muted-foreground sm:px-8 lg:px-12">Loading legal library...</p>}>
        <LawLibrary />
      </Suspense>
    </main>
  );
}
