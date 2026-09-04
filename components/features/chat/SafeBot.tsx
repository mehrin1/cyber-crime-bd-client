"use client";

import { Bot, LoaderCircle, MessageCircle, Plus, Send, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

type Message = { id: string; role: "USER" | "ASSISTANT"; content: string; createdAt: string };
type Conversation = { id: string; title: string; updatedAt: string; _count: { messages: number } };
type Detail = { id: string; title: string; messages: Message[] };

export function SafeBotLauncher() {
  const [open, setOpen] = useState(false);
  return <><button type="button" onClick={() => setOpen(true)} className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-[#092d2a] px-4 py-3 text-sm font-black text-white shadow-xl shadow-teal-950/30 transition hover:-translate-y-0.5 hover:bg-teal-800" aria-label="Open SafeBot"><Bot className="size-5" /> SafeBot</button>{open ? <div className="fixed inset-0 z-50 bg-slate-950/25" onClick={() => setOpen(false)}><aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between bg-[#092d2a] px-5 py-4 text-white"><div className="flex items-center gap-2"><Bot className="size-5" /><div><p className="font-black">SafeBot</p><p className="text-xs text-teal-100/75">Grounded safety guidance</p></div></div><Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} aria-label="Close SafeBot"><X /></Button></div><SafeBotPanel /></aside></div> : null}</>;
}

export function SafeBotPanel({ embedded = false }: { embedded?: boolean }) {
  const { data: session, isPending } = authClient.useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Detail | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (session?.user) void loadConversations(); }, [session?.user]);

  async function loadConversations() {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/conversations", { credentials: "include" });
      const payload = await responseJson<{ data?: Conversation[]; message?: string }>(response);
      if (!response.ok) throw new Error(payload.message || "Unable to load SafeBot history.");
      setConversations(payload.data || []);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load SafeBot history."); }
    finally { setLoading(false); }
  }

  async function selectConversation(id: string) {
    setError("");
    const response = await fetch(`/api/chat/conversations/${id}`, { credentials: "include" });
    const payload = await responseJson<{ data?: Detail; message?: string }>(response);
    if (!response.ok || !payload.data) return setError(payload.message || "Unable to load this conversation.");
    setActive(payload.data);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content) return;
    setSending(true); setError("");
    try {
      const response = await fetch("/api/chat/messages", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: active?.id, content }) });
      const payload = await responseJson<{ data?: { conversationId: string; userMessage: Message; assistantMessage: Message }; message?: string }>(response);
      if (!response.ok || !payload.data) throw new Error(payload.message || "SafeBot could not respond.");
      setInput("");
      const data = payload.data;
      setActive((current) => ({ id: data.conversationId, title: current?.title || content.slice(0, 72), messages: [...(current?.messages || []), data.userMessage, data.assistantMessage] }));
      await loadConversations();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "SafeBot could not respond."); }
    finally { setSending(false); }
  }

  if (isPending) return <div className="flex flex-1 items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 size-4 animate-spin" /> Loading SafeBot...</div>;
  if (!session?.user) return <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><Bot className="size-9 text-teal-700" /><h2 className="mt-4 text-xl font-black">Meet SafeBot</h2><p className="mt-2 text-sm leading-6 text-slate-600">Sign in to ask questions and keep your private chat history.</p><Button className="mt-5" render={<Link href="/login?callbackURL=/help" />}>Sign in to chat</Button></div>;

  return <div className={`flex min-h-0 flex-1 flex-col ${embedded ? "rounded-2xl border border-slate-200 bg-white shadow-sm" : ""}`}>
    <div className="flex items-center justify-between border-b px-4 py-3"><div><p className="font-black text-slate-950">SafeBot</p><p className="text-xs text-slate-500">Your saved safety chats</p></div><Button size="sm" variant="outline" onClick={() => setActive(null)}><Plus /> New</Button></div>
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="max-h-32 shrink-0 overflow-auto border-b bg-slate-50 p-2 md:max-h-none md:w-40 md:border-r md:border-b-0">{loading ? <p className="p-2 text-xs text-slate-500">Loading...</p> : conversations.length ? conversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => void selectConversation(conversation.id)} className={`mb-1 w-full rounded-lg p-2 text-left text-xs ${active?.id === conversation.id ? "bg-teal-800 text-white" : "hover:bg-white"}`}><p className="truncate font-bold">{conversation.title}</p><p className="mt-1 opacity-65">{conversation._count.messages} messages</p></button>) : <p className="p-2 text-xs text-slate-500">No saved chats yet.</p>}</div>
      <div className="flex min-h-0 flex-1 flex-col"><div className="flex-1 space-y-3 overflow-y-auto p-4">{active?.messages.length ? active.messages.map((message) => <div key={message.id} className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-6 ${message.role === "USER" ? "ml-auto bg-slate-900 text-white" : "border border-teal-100 bg-teal-50 text-slate-800"}`}><p className="mb-1 text-[10px] font-bold tracking-wide uppercase opacity-65">{message.role === "USER" ? "You" : "SafeBot"}</p><p className="whitespace-pre-wrap">{message.content}</p></div>) : <div className="py-10 text-center"><MessageCircle className="mx-auto size-7 text-teal-700" /><p className="mt-3 text-sm font-bold">Ask SafeBot for a safer next step</p><p className="mt-1 text-xs leading-5 text-slate-500">Answers use CyberSafeBD&apos;s curated guidance. Do not share passwords, OTPs, or sensitive evidence.</p></div>}{error ? <p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800">{error}</p> : null}</div><form onSubmit={sendMessage} className="border-t bg-slate-50 p-3"><Textarea value={input} onChange={(event) => setInput(event.target.value)} maxLength={2000} rows={2} placeholder="Ask about online safety, laws, or support..." className="bg-white" /><div className="mt-2 flex justify-end"><Button type="submit" size="sm" disabled={sending || !input.trim()}>{sending ? <LoaderCircle className="animate-spin" /> : <Send />}{sending ? "Thinking..." : "Send"}</Button></div></form></div>
    </div>
  </div>;
}

async function responseJson<T>(response: Response): Promise<T> { const body = await response.text(); return body ? JSON.parse(body) as T : {} as T; }
