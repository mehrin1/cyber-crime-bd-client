"use client";

import { ProfessionalType } from "@/components/features/help/types/types";
import AdviceList from "@/components/features/professionals/components/AdviceList";
import FilterTabs from "@/components/features/professionals/components/FilterTabs";
import { advices, professionals } from "@/components/features/professionals/fakedata/data";
import { useState } from "react";

export default function ProfessionalsPage() {
  const [filter, setFilter] = useState<ProfessionalType | "all">("all");

  const filteredAdvices =
    filter === "all"
      ? advices
      : advices.filter((a) => {
          const pro = professionals.find(
            (p) => p.id === a.professionalId
          );
          return pro?.role === filter;
        });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Learn from Professionals
      </h1>

      <FilterTabs selected={filter} onChange={setFilter} />

      <AdviceList
        advices={filteredAdvices}
        professionals={professionals}
      />
    </div>
  );
}