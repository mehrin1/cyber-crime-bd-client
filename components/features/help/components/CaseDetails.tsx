"use client";

import { HelpRequest } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  request: HelpRequest | null;
};

export default function CaseDetails({ request }: Props) {
  if (!request) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{request.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>{request.description}</p>

        <div className="text-sm text-muted-foreground">
          <p>Category: {request.category}</p>
          <p>Status: {request.status}</p>
          <p>
            Submitted: {request.isAnonymous ? "Anonymous" : "User"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}