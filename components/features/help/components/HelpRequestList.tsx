"use client";

import { HelpRequest } from "../types/types";
import HelpRequestCard from "./HelpRequestCard";

type Props = {
  requests: HelpRequest[];
  onSelect: (req: HelpRequest) => void;
};

export default function HelpRequestList({ requests, onSelect }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {requests.map((req) => (
        <HelpRequestCard
          key={req.id}
          request={req}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}