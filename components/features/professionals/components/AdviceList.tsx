"use client";

import { Advice, Professional } from "../types/types";
import AdviceCard from "./AdviceCard";

type Props = {
  advices: Advice[];
  professionals: Professional[];
};

export default function AdviceList({ advices, professionals }: Props) {
  const getProfessional = (id: string) =>
    professionals.find((p) => p.id === id)!;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {advices.map((advice) => (
        <AdviceCard
          key={advice.id}
          advice={advice}
          professional={getProfessional(advice.professionalId)}
        />
      ))}
    </div>
  );
}