"use client";

import { Law } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  law: Law;
};

export default function LawCard({ law }: Props) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="text-lg">{law.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {law.description}
        </p>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Authority: {law.authority}</p>
          <p>Published: {law.publishedDate}</p>
          <p className="capitalize">Category: {law.category}</p>
        </div>
      </CardContent>
    </Card>
  );
}