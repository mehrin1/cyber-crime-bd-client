"use client";

import { HelpRequest } from "../types/types";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  request: HelpRequest;
  onSelect: (req: HelpRequest) => void;
};

export default function HelpRequestCard({ request, onSelect }: Props) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md"
      onClick={() => onSelect(request)}
    >
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold">{request.title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {request.description}
        </p>

        <div className="flex justify-between text-xs">
          <span>{request.category}</span>
          <span className="capitalize">{request.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}