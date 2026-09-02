"use client";

import { LawCategory, LawRegion } from "../types/types";



type Props = {
  region: LawRegion | "all";
  category: LawCategory | "all";
  setRegion: (val: LawRegion | "all") => void;
  setCategory: (val: LawCategory | "all") => void;
};

export default function LawFilters({
  region,
  category,
  setRegion,
  setCategory,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Region Filter */}
      <select
        className="border p-2 rounded"
        value={region}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e) => setRegion(e.target.value as any)}
      >
        <option value="all">All Regions</option>
        <option value="bangladesh">Bangladesh</option>
        <option value="international">International</option>
      </select>

      {/* Category Filter */}
      <select
        className="border p-2 rounded"
        value={category}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e) => setCategory(e.target.value as any)}
      >
        <option value="all">All Categories</option>
        <option value="cybercrime">Cybercrime</option>
        <option value="data_protection">Data Protection</option>
        <option value="harassment">Harassment</option>
        <option value="financial">Financial</option>
      </select>
    </div>
  );
}