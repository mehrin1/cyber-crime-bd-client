"use client";

import { useState } from "react";
import { HelpCategory } from "../types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HelpRequestForm() {
  const [category, setCategory] = useState<HelpCategory>("legal");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const title = (form.title as any).value;
    const description = (form.description as HTMLTextAreaElement).value;

    console.log({
      title,
      description,
      category,
      isAnonymous,
    });

    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="title" placeholder="Issue title" required />

      <Textarea
        name="description"
        placeholder="Describe your problem..."
        required
      />

      {/* Category */}
      <select
        className="w-full border rounded p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value as HelpCategory)}
      >
        <option value="legal">Legal</option>
        <option value="mental">Mental Health</option>
        <option value="emergency">Emergency</option>
      </select>

      {/* Anonymous */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={() => setIsAnonymous(!isAnonymous)}
        />
        Submit anonymously
      </label>

      <Button type="submit" className="w-full">
        Submit Request
      </Button>
    </form>
  );
}