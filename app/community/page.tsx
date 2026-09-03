"use client";

import {
  Heart,
  LoaderCircle,
  LogIn,
  MessageCircle,
  PenLine,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

type CommunityPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; image: string | null };
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
};

type CommunityComment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
};

type FeedResponse = {
  data: { posts: CommunityPost[]; nextCursor: string | null };
};

export default function CommunityPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [search, setSearch] = useState("");
  const [showMine, setShowMine] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mine") === "true",
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [comments, setComments] = useState<Record<string, CommunityComment[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [activeLikeId, setActiveLikeId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadPosts();
    }, search ? 300 : 0);
    return () => window.clearTimeout(timeout);
    // Reload only after a deliberate search/filter change or sign-in state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, showMine, session?.user?.id]);

  async function loadPosts(cursor?: string) {
    if (showMine && !session?.user) {
      setPosts([]);
      setNextCursor(null);
      setIsLoading(false);
      return;
    }

    if (cursor) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError("");
    try {
      const query = new URLSearchParams({ limit: "12" });
      if (search.trim()) query.set("search", search.trim());
      if (showMine) query.set("mine", "true");
      if (cursor) query.set("cursor", cursor);
      const response = await fetch(`/api/community/posts?${query.toString()}`, {
        credentials: "include",
      });
      const payload = (await response.json()) as FeedResponse & { message?: string };
      if (!response.ok) throw new Error(payload.message || "Unable to load community posts.");
      setPosts((current) => (cursor ? [...current, ...payload.data.posts] : payload.data.posts));
      setNextCursor(payload.data.nextCursor);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load community posts.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  function requestLogin() {
    router.push("/login?callbackURL=/community");
  }

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.user) return requestLogin();
    setIsPosting(true);
    setError("");
    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const payload = (await response.json()) as { data?: CommunityPost; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message || "Unable to publish your post.");
      setPosts((current) => [payload.data!, ...current]);
      setTitle("");
      setContent("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to publish your post.");
    } finally {
      setIsPosting(false);
    }
  }

  async function toggleLike(post: CommunityPost) {
    if (!session?.user) return requestLogin();
    setActiveLikeId(post.id);
    try {
      const response = await fetch(`/api/community/posts/${post.id}/likes`, {
        method: "POST",
        credentials: "include",
      });
      const payload = (await response.json()) as { data?: { liked: boolean; likeCount: number }; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message || "Unable to update the like.");
      setPosts((current) => current.map((item) => item.id === post.id ? {
        ...item,
        likedByCurrentUser: payload.data!.liked,
        likeCount: payload.data!.likeCount,
      } : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update the like.");
    } finally {
      setActiveLikeId(null);
    }
  }

  async function toggleComments(postId: string) {
    const isOpen = openComments[postId];
    setOpenComments((current) => ({ ...current, [postId]: !isOpen }));
    if (isOpen || comments[postId]) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, { credentials: "include" });
      const payload = (await response.json()) as { data?: CommunityComment[]; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message || "Unable to load comments.");
      setComments((current) => ({ ...current, [postId]: payload.data! }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load comments.");
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    if (!session?.user) return requestLogin();
    const value = commentText[postId]?.trim();
    if (!value) return;
    setCommentingPostId(postId);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value }),
      });
      const payload = (await response.json()) as { data?: CommunityComment; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message || "Unable to add your comment.");
      setComments((current) => ({ ...current, [postId]: [...(current[postId] || []), payload.data!] }));
      setCommentText((current) => ({ ...current, [postId]: "" }));
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add your comment.");
    } finally {
      setCommentingPostId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[2rem] bg-[#092d2a] px-6 py-9 text-white shadow-xl shadow-teal-950/10 sm:px-10">
          <p className="text-sm font-bold tracking-[0.16em] text-teal-200 uppercase">CyberSafeBD community</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Share what helped. Learn from people who understand.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-50/80 sm:text-base">Read experiences openly. Sign in when you want to add your own perspective, support a post, or join the conversation.</p>
            </div>
            {!isSessionPending && !session?.user ? (
              <Button className="bg-[#f2c14e] text-slate-950 hover:bg-[#ffdc76]" onClick={requestLogin}>
                <LogIn /> Sign in to participate
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {session?.user ? (
            <form onSubmit={submitPost} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><PenLine className="size-4 text-teal-700" /> Share your experience</div>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A short title for your post" maxLength={160} required />
              <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What happened, what did you learn, or what would you tell someone in the same situation?" maxLength={5000} required className="min-h-28" />
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500">Share only information you are comfortable making public.</p>
                <Button type="submit" disabled={isPosting || title.trim().length < 3 || content.trim().length < 10}>
                  {isPosting ? <LoaderCircle className="animate-spin" /> : <Send />} {isPosting ? "Publishing..." : "Publish post"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-extrabold text-slate-900">Have an experience to share?</p><p className="mt-1 text-sm text-slate-600">Create an account to make a post, like, or comment.</p></div>
              <Button onClick={requestLogin}><LogIn /> Sign in to contribute</Button>
            </div>
          )}
        </section>

        <section className="mt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-black text-slate-950">Community stories</h2><p className="mt-1 text-sm text-slate-600">Search shared experiences and useful lessons.</p></div>
            <Button variant={showMine ? "default" : "outline"} onClick={() => setShowMine((value) => !value)} disabled={isSessionPending}>
              <UserRound /> {showMine ? "Showing your posts" : "My posts"}
            </Button>
          </div>
          <div className="relative mt-5"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, story, or author" className="h-11 pl-10" /></div>
          {showMine && !session?.user ? <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><span>Sign in to filter the feed to your posts.</span><Button size="sm" variant="outline" onClick={requestLogin}>Sign in</Button></div> : null}
          {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p> : null}
          {isLoading ? <LoadingFeed /> : posts.length ? <div className="mt-5 space-y-4">{posts.map((post) => <PostCard key={post.id} post={post} comments={comments[post.id] || []} commentsOpen={Boolean(openComments[post.id])} commentText={commentText[post.id] || ""} isCommenting={commentingPostId === post.id} isLiking={activeLikeId === post.id} onLike={() => void toggleLike(post)} onToggleComments={() => void toggleComments(post.id)} onCommentTextChange={(value) => setCommentText((current) => ({ ...current, [post.id]: value }))} onSubmitComment={(event) => void submitComment(event, post.id)} />)}</div> : <EmptyFeed mine={showMine} search={search} />}
          {nextCursor ? <div className="mt-6 text-center"><Button variant="outline" disabled={isLoadingMore} onClick={() => void loadPosts(nextCursor)}>{isLoadingMore ? <LoaderCircle className="animate-spin" /> : null} {isLoadingMore ? "Loading..." : "Load more posts"}</Button></div> : null}
        </section>
      </div>
    </main>
  );
}

function PostCard({ post, comments, commentsOpen, commentText, isCommenting, isLiking, onLike, onToggleComments, onCommentTextChange, onSubmitComment }: { post: CommunityPost; comments: CommunityComment[]; commentsOpen: boolean; commentText: string; isCommenting: boolean; isLiking: boolean; onLike: () => void; onToggleComments: () => void; onCommentTextChange: (value: string) => void; onSubmitComment: (event: FormEvent<HTMLFormElement>) => void }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><Avatar name={post.author.name} /><div><p className="text-sm font-extrabold text-slate-900">{post.author.name}</p><p className="text-xs text-slate-500">{formatDate(post.createdAt)}</p></div></div><h3 className="mt-5 text-lg font-black text-slate-950">{post.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.content}</p><div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4"><Button variant={post.likedByCurrentUser ? "default" : "ghost"} size="sm" disabled={isLiking} onClick={onLike} aria-label="Like post"><Heart className={post.likedByCurrentUser ? "fill-current" : ""} /> {post.likeCount}</Button><Button variant="ghost" size="sm" onClick={onToggleComments} aria-expanded={commentsOpen}><MessageCircle /> {post.commentCount} {commentsOpen ? "Hide comments" : "Comments"}</Button></div>{commentsOpen ? <div className="mt-4 border-t border-slate-100 pt-4"><div className="space-y-3">{comments.length ? comments.map((comment) => <div key={comment.id} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-extrabold text-slate-800">{comment.author.name} <span className="ml-1 font-normal text-slate-400">{formatDate(comment.createdAt)}</span></p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{comment.content}</p></div>) : <p className="text-sm text-slate-500">No comments yet. Start the conversation.</p>}</div><form onSubmit={onSubmitComment} className="mt-4 flex gap-2"><Input value={commentText} onChange={(event) => onCommentTextChange(event.target.value)} placeholder="Write a comment" maxLength={1500} /><Button type="submit" size="sm" disabled={isCommenting || !commentText.trim()}>{isCommenting ? <LoaderCircle className="animate-spin" /> : <Send />}</Button></form></div> : null}</article>;
}

function Avatar({ name }: { name: string }) { return <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-sm font-black text-teal-800">{name.slice(0, 1).toUpperCase()}</div>; }
function EmptyFeed({ mine, search }: { mine: boolean; search: string }) { return <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><MessageCircle className="mx-auto size-7 text-teal-700" /><h3 className="mt-3 font-extrabold text-slate-900">{mine ? "No posts from you yet" : search ? "No matching posts" : "No community posts yet"}</h3><p className="mt-2 text-sm text-slate-600">{mine ? "Share an experience above, or switch to the full community feed." : "Try a different search or check back soon."}</p></div>; }
function LoadingFeed() { return <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="size-5 animate-spin" /> Loading community posts</div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(new Date(value)); }
