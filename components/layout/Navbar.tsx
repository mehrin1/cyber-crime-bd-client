"use client";

import { LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [["Learn", "/learn"], ["Laws", "/laws"], ["Resources", "/professionals"], ["Research", "/research"], ["Community", "/community"], ["Seek help", "/help"]] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const callbackURL = pathname === "/login" || pathname === "/register" ? "/" : pathname;

  async function signOut() {
    setSigningOut(true);
    const result = await authClient.signOut();
    if (!result.error) { router.push("/"); router.refresh(); }
    setSigningOut(false);
  }

  const authActions = !isPending && session?.user ? <><Button size="sm" variant="outline" render={<Link href="/dashboard" />}><LayoutDashboard /> Dashboard</Button><Button size="sm" variant="ghost" disabled={signingOut} onClick={signOut}><LogOut /> {signingOut ? "Signing out" : "Sign out"}</Button></> : !isPending ? <><Button size="sm" variant="ghost" render={<Link href={`/login?callbackURL=${encodeURIComponent(callbackURL)}`} />}>Sign in</Button><Button size="sm" render={<Link href={`/register?callbackURL=${encodeURIComponent(callbackURL)}`} />}>Create account</Button></> : null;

  return <header className="sticky top-0 z-30 border-b border-teal-950/8 bg-[#fdfcf8]/88 backdrop-blur-xl">
    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
      <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label="CyberSafeBD home"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#092d2a] text-teal-100 shadow-md shadow-teal-950/15 transition-transform duration-200 group-hover:-rotate-6"><ShieldCheck className="size-5" /></span><span className="leading-none"><span className="block text-[0.95rem] font-black tracking-tight text-[#092d2a]">CyberSafeBD</span><span className="mt-1 block text-[0.58rem] font-bold tracking-[0.16em] text-teal-700 uppercase">Know your next step</span></span></Link>
      <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} href={href} className={cn("rounded-lg px-2.5 py-2 text-[0.8rem] font-bold transition-colors", pathname === href ? "bg-teal-100 text-teal-950" : "text-slate-600 hover:bg-teal-50 hover:text-teal-950")}>{label}</Link>)}</nav>
      <div className="hidden items-center gap-2 lg:flex">{authActions}</div>
      <Button size="icon" variant="outline" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button>
    </div>
    {open ? <div className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}><div className="ml-auto flex h-full w-[min(22rem,90vw)] flex-col bg-[#fdfcf8] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><p className="font-black text-[#092d2a]">Explore CyberSafeBD</p><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu"><X /></Button></div><nav className="mt-8 grid gap-1">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("rounded-xl px-4 py-3 text-sm font-bold", pathname === href ? "bg-teal-100 text-teal-950" : "text-slate-700 hover:bg-teal-50")}>{label}</Link>)}</nav><div className="mt-auto grid gap-2 border-t border-teal-950/10 pt-5">{authActions}</div></div></div> : null}
  </header>;
}
