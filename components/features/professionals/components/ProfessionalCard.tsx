"use client";

import { Professional } from "../types/types";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  professional: Professional;
};

export default function ProfessionalCard({ professional }: Props) {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <h3 className="font-semibold">{professional.name}</h3>

        <p className="text-sm text-muted-foreground capitalize">
          {professional.role}
        </p>

        <p className="text-xs">{professional.designation}</p>

        <p className="text-xs text-muted-foreground">
          {professional.organization}
        </p>

        {professional.verified && (
          <span className="text-green-600 text-xs">✔ Verified</span>
        )}
      </CardContent>
    </Card>
  );
}