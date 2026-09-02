import {
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Gavel,
  HeartHandshake,
  Landmark,
  LockKeyhole,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Siren,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const services = [
  {
    icon: BookOpenCheck,
    title: "Learn cybercrime",
    text: "Understand scams, account takeover, harassment, financial fraud, image abuse, and safer next steps.",
    href: "/learn",
    action: "Explore crime types",
    tone: "bg-sky-100 text-sky-800",
  },
  {
    icon: Gavel,
    title: "Find legal references",
    text: "Browse Bangladesh and international laws connected to cybercrime, evidence, privacy, and reporting.",
    href: "/laws",
    action: "Open law library",
    tone: "bg-amber-100 text-amber-800",
  },
  {
    icon: HeartHandshake,
    title: "Seek safer support",
    text: "Use official reporting resources or create a private, account-linked support request for follow-up.",
    href: "/help",
    action: "Open support desk",
    tone: "bg-rose-100 text-rose-800",
  },
  {
    icon: BarChart3,
    title: "Contribute to research",
    text: "Share privacy-aware survey insight and explore anonymized trends that improve awareness resources.",
    href: "/research",
    action: "Visit research",
    tone: "bg-teal-100 text-teal-800",
  },
];

const paths = [
  [
    "01",
    "Recognize the risk",
    "Start with a cybercrime type or search for the issue you are facing.",
  ],
  [
    "02",
    "Protect evidence and access",
    "Preserve links and screenshots. Secure accounts. Never share passwords or OTPs.",
  ],
  [
    "03",
    "Choose the right route",
    "Find legal references, official emergency resources, or private support based on your situation.",
  ],
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f7] text-slate-950">
      <section className="relative overflow-hidden bg-[#092d2a] px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(153,246,228,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(153,246,228,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute top-[-12rem] right-[-8rem] size-[31rem] rounded-full bg-teal-300/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-teal-200 uppercase">
              <ShieldCheck className="size-4" /> CyberSafeBD ·
              Bangladesh-focused cyber safety
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Know what happened. Know what to do next.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-teal-50/85">
              CyberSafeBD brings cybercrime learning, legal references, official
              support routes, private case follow-up, and community research
              into one practical place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-teal-200 text-teal-950 hover:bg-teal-100"
                render={<Link href="/learn" />}
              >
                Explore cyber safety <ArrowUpRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/help" />}
              >
                Seek help <HeartHandshake />
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-teal-100/80">
              <LockKeyhole className="size-4" /> Do not share passwords, PINs,
              OTPs, bank credentials, or intimate images.
            </p>
          </div>
          <HomepageDemo />
        </div>
      </section>
      <section className="border-b border-rose-200 bg-rose-50 px-5 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Siren className="mt-0.5 size-5 text-rose-700" />
            <div>
              <p className="font-extrabold text-rose-950">
                Immediate danger or urgent safety threat?
              </p>
              <p className="text-sm text-rose-800">
                CyberSafeBD is not an emergency service. Call Bangladesh
                National Emergency Service for police, fire, or ambulance
                support.
              </p>
            </div>
          </div>
          <a
            href="tel:999"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800"
          >
            Call 999 <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-[0.14em] text-teal-800 uppercase">
            What CyberSafeBD offers
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Built around the decisions people need to make after digital harm.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ icon: Icon, title, text, href, action, tone }) => (
            <article
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              <Link
                href={href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-teal-800 hover:underline"
              >
                {action}
                <ArrowUpRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-teal-800 uppercase">
              A safer path
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Move from uncertainty to an informed next step.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The platform is designed to help before a person loses evidence,
              sends money, shares sensitive data, or follows unsafe online
              advice.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {paths.map(([number, title, text]) => (
              <article key={number} className="rounded-2xl bg-[#f1f8f7] p-5">
                <p className="text-sm font-black text-teal-700">{number}</p>
                <h3 className="mt-7 font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-3xl bg-[#123f5a] p-7 text-white sm:p-9">
            <p className="text-sm font-bold tracking-[0.14em] text-sky-200 uppercase">
              Research & surveys
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight">
              Help make future cyber-safety guidance more relevant.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-sky-50/85">
              Contribute to the Cyberbullying, Cybersecurity Resilience, and
              Legal Awareness assessment. You can choose anonymous participation
              or retain a personal record through your account.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="bg-white text-sky-950 hover:bg-sky-50"
                render={<Link href="/research/contribute" />}
              >
                Take the survey <ArrowUpRight />
              </Button>
              <Button
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/research/results" />}
              >
                View public trends <BarChart3 />
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
            <Landmark className="size-8 text-amber-700" />
            <h2 className="mt-5 text-2xl font-black">
              Find the correct official route.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The Professional Advice directory organizes Bangladesh and
              international reporting, protection, legal-aid, financial-safety,
              and child-safety resources.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              render={<Link href="/professionals" />}
            >
              Browse official resources <ArrowUpRight />
            </Button>
          </div>
        </div>
      </section>
      <section className="px-5 pb-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-teal-200 bg-teal-50 p-7 sm:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-teal-800 uppercase">
                <SearchCheck className="size-4" /> Start where you are
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                A question, an incident, or a research insight all have a place
                here.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-900/80">
                Use the dashboard when signed in to review your linked survey
                responses and private support cases.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/dashboard" />}>
                Open dashboard <ArrowUpRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/about" />}
              >
                About CyberSafeBD <ArrowUpRight />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomepageDemo() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-5 rounded-[2rem] bg-teal-300/10 blur-2xl" />
      <div className="relative rounded-3xl border border-white/15 bg-slate-950/35 p-4 shadow-2xl shadow-black/25 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-rose-300" />
            <span className="size-2 rounded-full bg-amber-200" />
            <span className="size-2 rounded-full bg-teal-200" />
          </div>
          <p className="text-xs font-bold text-teal-100">CyberSafeBD guide</p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-white p-4 text-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-wide text-teal-700 uppercase">
                  Account security
                </p>
                <p className="mt-1 font-extrabold">My account was taken over</p>
              </div>
              <ShieldAlert className="size-5 text-rose-600" />
            </div>
            <div className="mt-4 grid gap-2 text-xs">
              <p className="flex gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-teal-700" />{" "}
                Secure recovery email and password
              </p>
              <p className="flex gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-teal-700" />{" "}
                Preserve the account URL and screenshots
              </p>
              <p className="flex gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-teal-700" /> Find
                reporting and legal guidance
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
              <FileText className="size-5 text-amber-200" />
              <p className="mt-3 text-sm font-bold">Legal references</p>
              <p className="mt-1 text-xs text-teal-100/75">
                Relevant laws, clearly connected.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
              <BarChart3 className="size-5 text-cyan-200" />
              <p className="mt-3 text-sm font-bold">Community insight</p>
              <p className="mt-1 text-xs text-teal-100/75">
                Anonymized research trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
