"use client";

import { Advice, Professional } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  advice: Advice;
  professional: Professional;
};

export default function AdviceCard({ advice, professional }: Props) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="text-lg">{advice.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {advice.content}
        </p>

        <div className="text-xs text-muted-foreground">
          <p>
            By: <span className="font-medium">{professional.name}</span>
          </p>
          <p className="capitalize">{professional.role}</p>
        </div>
      </CardContent>
    </Card>
  );
}