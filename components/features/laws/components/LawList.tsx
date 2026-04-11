"use client";

import { Law } from "../types/types";
import LawCard from "./LawCard";

type Props = {
  laws: Law[];
};

export default function LawList({ laws }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {laws.map((law) => (
        <LawCard key={law.id} law={law} />
      ))}
    </div>
  );
}