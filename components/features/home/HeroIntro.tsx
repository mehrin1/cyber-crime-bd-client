"use client";

import { Button } from "@/components/ui/button";

export default function HeroIntro() {
  return (
    <section className="text-center py-16 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Stay Safe in the Digital World
      </h1>

      <p className="text-muted-foreground max-w-2xl mx-auto">
        Learn about cybercrime, get help from professionals, and share your
        experience safely—all in one platform.
      </p>

      <div className="flex justify-center gap-4">
        <Button>Get Help</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </section>
  );
}