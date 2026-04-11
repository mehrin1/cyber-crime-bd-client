"use client";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="text-center py-12 space-y-4">
      <h2 className="text-2xl font-bold">
        Need Help or Want to Share Your Story?
      </h2>

      <p className="text-muted-foreground">
        Take action now—your safety and voice matter.
      </p>

      <Button size="lg">Get Started</Button>
    </section>
  );
}