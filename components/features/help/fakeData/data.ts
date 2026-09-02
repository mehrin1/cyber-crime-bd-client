import { HelpRequest, Message } from "../types/types";

export const helpRequests: HelpRequest[] = [
  {
    id: "1",
    title: "Facebook account hacked",
    description: "Someone accessed my account and changed password",
    category: "legal",
    isAnonymous: true,
    status: "pending",
    createdAt: "2026-04-10",
  },
  {
    id: "2",
    title: "Online harassment issue",
    description: "Receiving threats on messenger",
    category: "mental",
    isAnonymous: false,
    status: "in-progress",
    createdAt: "2026-04-09",
  },
];

export const messages: Message[] = [
  {
    id: "1",
    sender: "user",
    text: "I need help with my hacked account",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "professional",
    text: "Please provide more details",
    timestamp: "10:05 AM",
  },
];