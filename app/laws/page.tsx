"use client";

import LawFilters from "@/components/features/laws/components/LawFilters";
import LawList from "@/components/features/laws/components/LawList";
import { laws } from "@/components/features/laws/fakeData/data";
import { LawCategory, LawRegion } from "@/components/features/laws/types/types";
import { useState } from "react";


export default function LawsPage() {
  const [region, setRegion] = useState<LawRegion | "all">("all");
  const [category, setCategory] = useState<LawCategory | "all">("all");

  const filteredLaws = laws.filter((law) => {
    const matchRegion = region === "all" || law.region === region;
    const matchCategory =
      category === "all" || law.category === category;

    return matchRegion && matchCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Laws & Regulations
      </h1>

      <LawFilters
        region={region}
        category={category}
        setRegion={setRegion}
        setCategory={setCategory}
      />

      <LawList laws={filteredLaws} />
    </div>
  );
}