"use client";

import { useState } from "react";
import { helpRequests, messages } from "@/components/features/help/fakeData/data";
import { HelpRequest } from "@/components/features/help/types/types";
import HelpRequestForm from "@/components/features/help/components/HelpRequestForm";
import HelpRequestList from "@/components/features/help/components/HelpRequestList";
import CaseDetails from "@/components/features/help/components/CaseDetails";
import ChatBox from "@/components/features/help/components/ChatBox";

export default function HelpPage() {
  const [selected, setSelected] = useState<HelpRequest | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Form */}
      <HelpRequestForm />

      {/* Requests */}
      <HelpRequestList
        requests={helpRequests}
        onSelect={setSelected}
      />

      {/* Case Details */}
      <CaseDetails request={selected} />

      {/* Chat */}
      {selected && <ChatBox initialMessages={messages} />}
    </div>
  );
}