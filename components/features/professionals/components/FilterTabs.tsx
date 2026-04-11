"use client";

import { ProfessionalType } from "../types/types";

type Props = {
  selected: ProfessionalType | "all";
  onChange: (val: ProfessionalType | "all") => void;
};

export default function FilterTabs({ selected, onChange }: Props) {
  const tabs = ["all", "police", "lawyer", "psychologist", "human_rights"];

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => onChange(tab as any)}
          className={`px-3 py-1 rounded text-sm border ${
            selected === tab ? "bg-black text-white" : ""
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}