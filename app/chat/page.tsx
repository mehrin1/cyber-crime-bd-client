"use client";

import { Bot, ExternalLink, LoaderCircle, MessageCircle, Plus, Send, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

type Source = { type: string; title: string; excerpt: string; url?: string };
type Message = { id: string; role: "USER" | "ASSISTANT"; content: string; sources: Source[] | null; createdAt: string };
type Conversation = { id: string; title: string; createdAt: string; updatedAt: string; user: { name: string; email: string }; _count: { messages: number } };
type ConversationDetail = { id: string; title: string; user: { name: string; email: string }; messages: Message[] };

export default function ChatPage() {
  return <Suspense fallback={<Loading />}><ChatWorkspace /></Suspense>;
}

function ChatWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const adminMode = searchParams.get("admin") === "true";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<ConversationDetail | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/login?callbackURL=/chat");
  }, [isPending, router, session?.user]);

  useEffect(() => {
    if (!session?.user) return;
    void loadConversations();
    // The list changes only when the signed-in identity or admin mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, adminMode]);

  async function loadConversations() {
    setLoading(true);
    setError("");
    try {
      const endpoint = adminMode ? "/api/chat/admin/conversations" : "/api/chat/conversations";
      const response = await fetch(endpoint, { credentials: "include" });
      const payload = await readJson<{ data?: Conversation[]; message?: string }>(response);
      if (!response.ok) throw new Error(payload.message || "Unable to load chat history.");
      setConversations(payload.data || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load chat history.");
    } finally {
      setLoading(false);
    }
  }

  async function selectConversation(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/chat/conversations/${id}`, { credentials: "include" });
      const payload = await readJson<{ data?: ConversationDetail; message?: string }>(response);
      if (!response.ok || !payload.data) throw new Error(payload.message || "Unable to load this conversation.");
      setActive(payload.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load this conversation.");
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || adminMode) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: active?.id, content }),
      });
      const payload = await readJson<{ data?: { conversationId: string; userMessage: Message; assistantMessage: Message }; message?: string }>(response);
      if (!response.ok || !payload.data) throw new Error(payload.message || "Unable to send your message.");
      const data = payload.data;
      setInput("");
      setActive((current) => ({
        id: data.conversationId,
        title: current?.title || content.slice(0, 72),
        user: current?.user || { name: session?.user?.name || "You", email: "" },
        messages: [...(current?.messages || []), data.userMessage, data.assistantMessage],
      }));
      await loadConversations();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send your message.");
    } finally {
      setSending(false);
    }
  }

  if (isPending || !session?.user) return <Loading />;

  return (
    <main className="page-shell bg-transparent px-4 py-7 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[18rem_1fr]">
        <aside className="surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold tracking-[0.15em] text-teal-700 uppercase">{adminMode ? "Admin review" : "Private history"}</p><h1 className="mt-1 font-black text-slate-950">Chat assistant</h1></div>
            {!adminMode ? <Button size="sm" variant="outline" onClick={() => setActive(null)}><Plus /> New</Button> : null}
          </div>
          <div className="mt-4 space-y-2">
            {loading ? <p className="py-4 text-sm text-slate-500">Loading conversations...</p> : conversations.length ? conversations.map((conversation) => (
              <button key={conversation.id} type="button" onClick={() => void selectConversation(conversation.id)} className={`w-full rounded-xl p-3 text-left text-sm transition ${active?.id === conversation.id ? "bg-teal-800 text-white shadow-sm" : "bg-slate-50 hover:bg-teal-50"}`}>
                <p className="truncate font-bold">{conversation.title}</p>
                {adminMode ? <p className="mt-1 truncate text-xs opacity-75">{conversation.user.name} · {conversation.user.email}</p> : null}
                <p className="mt-1 text-xs opacity-65">{formatDate(conversation.updatedAt)} · {conversation._count.messages} messages</p>
              </button>
            )) : <p className="py-4 text-sm text-slate-500">{adminMode ? "No saved conversations." : "Start a chat to save it here."}</p>}
          </div>
        </aside>
        <section className="surface-card flex min-h-[38rem] flex-col overflow-hidden">
          <header className="border-b bg-[#092d2a] px-5 py-5 text-white sm:px-7"><div className="flex items-start gap-3"><div className="rounded-xl bg-white/10 p-2"><Bot className="size-5" /></div><div><h2 className="font-black">{adminMode ? active ? `${active.user.name}'s conversation` : "Select a conversation" : "CyberSafeBD knowledge assistant"}</h2><p className="mt-1 text-sm text-teal-50/75">{adminMode ? "Read-only access for moderation and support review." : "Answers are grounded in this site's laws, guidance, learning articles, and support resources."}</p></div></div></header>
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
            {active?.messages.length ? active.messages.map((message) => <ChatMessage key={message.id} message={message} />) : <EmptyState adminMode={adminMode} />}
            {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
          </div>
          {!adminMode ? <form onSubmit={sendMessage} className="border-t bg-slate-50 p-4 sm:p-5"><Textarea value={input} onChange={(event) => setInput(event.target.value)} maxLength={2000} placeholder="Ask about online safety, cybercrime, laws, or available support..." className="min-h-24 bg-white" /><div className="mt-3 flex items-center justify-between gap-4"><p className="text-xs text-slate-500">Avoid sharing passwords, account codes, or sensitive evidence.</p><Button type="submit" disabled={sending || !input.trim()}>{sending ? <LoaderCircle className="animate-spin" /> : <Send />} {sending ? "Thinking..." : "Send"}</Button></div></form> : null}
        </section>
      </div>
    </main>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isAssistant = message.role === "ASSISTANT";
  return <article className={`max-w-3xl rounded-2xl p-4 text-sm leading-6 ${isAssistant ? "border border-teal-100 bg-teal-50 text-slate-800" : "ml-auto bg-slate-900 text-white"}`}><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] opacity-70">{isAssistant ? <Bot className="size-3.5" /> : <MessageCircle className="size-3.5" />}{isAssistant ? "Assistant" : "You"}</p><p className="whitespace-pre-wrap">{message.content}</p>{isAssistant && message.sources?.length ? <div className="mt-4 border-t border-teal-200 pt-3"><p className="text-xs font-bold text-teal-900">Retrieved sources</p><div className="mt-2 space-y-2">{message.sources.map((source, index) => <div key={`${source.title}-${index}`} className="rounded-lg bg-white/70 p-2 text-xs"><p className="font-bold">[{index + 1}] {source.title}</p><p className="mt-1 text-slate-600">{source.excerpt}</p>{source.url ? <a className="mt-1 inline-flex items-center gap-1 text-teal-800 underline" href={source.url} target="_blank" rel="noreferrer">Open source <ExternalLink className="size-3" /></a> : null}</div>)}</div></div> : null}</article>;
}

function EmptyState({ adminMode }: { adminMode: boolean }) {
  return <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center"><ShieldCheck className="size-9 text-teal-700" /><h3 className="mt-4 text-xl font-black">{adminMode ? "Choose a saved conversation" : "Ask a safer next-step question"}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{adminMode ? "Administrators can review histories but cannot send messages on a user's behalf." : "I will search CyberSafeBD's curated knowledge first, then answer with sources. This is general information, not legal or emergency advice."}</p></div>;
}

function Loading() { return <main className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500"><LoaderCircle className="size-5 animate-spin" /> Loading chat</main>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(new Date(value)); }
async function readJson<T>(response: Response): Promise<T> { const raw = await response.text(); return raw ? JSON.parse(raw) as T : {} as T; }
