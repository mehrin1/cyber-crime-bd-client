"use client";

import { useState } from "react";
import { Message } from "../types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  initialMessages: Message[];
};

export default function ChatBox({ initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: "now",
    };

    setMessages([...messages, newMsg]);
    setText("");
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}