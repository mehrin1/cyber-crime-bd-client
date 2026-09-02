import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Eye,
  FileText,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
const researchPillars = [
  {
    icon: ShieldCheck,
    title: "Digital resilience",
    description:
      "How people protect accounts, identify scams, and respond to cyber-security incidents.",
    tone: "bg-teal-100 text-teal-800",
  },
  {
    icon: UsersRound,
    title: "Online harm",
    description:
      "Experiences of cyberbullying, harassment, image-based abuse, and where people seek help.",
    tone: "bg-rose-100 text-rose-800",
  },
  {
    icon: FileText,
    title: "Legal awareness",
    description:
      "Whether people know their rights, evidence practices, and the routes available for reporting.",
    tone: "bg-amber-100 text-amber-800",
  },
];
const steps = [
  [
    "01",
    "Choose your privacy",
    "Use anonymous mode, or sign in and attach an email to keep a personal submission record.",
  ],
  [
    "02",
    "Complete the assessment",
    "Answer based on your experience and current knowledge. Skip sensitive personal details.",
  ],
  [
    "03",
    "See the bigger picture",
    "Public results show anonymized trends, never individual case stories or free-text answers.",
  ],
];

export default function ResearchPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9fb] text-slate-950">
      <section className="relative bg-[#082f49] px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(125,211,252,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.1)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute -top-32 right-[-6rem] size-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-sky-200 uppercase">
              <Database className="size-4" /> Cyber Safe BD research programme
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              From personal experience to public evidence.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50/85">
              Our assessment maps cyberbullying, cybersecurity resilience, and
              legal awareness in Bangladesh so learning resources and support
              routes are shaped by real needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                render={<Link href="/research/contribute" />}
              >
                Take the assessment <ArrowUpRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/research/results" />}
              >
                Explore results <BarChart3 />
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-sky-100/80">
              <LockKeyhole className="size-4" /> Participation is voluntary.
              Never submit passwords, PINs, OTPs, or account credentials.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <div className="rounded-2xl bg-white p-5 text-slate-950">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-sky-700 uppercase">
                    Current study
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-6">
                    Cyberbullying, resilience & legal awareness
                  </h2>
                </div>
                <ClipboardCheck className="size-8 text-sky-700" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 border-y border-slate-100 py-4 text-center">
                <div>
                  <p className="text-lg font-black">3</p>
                  <p className="text-[11px] text-slate-500">research themes</p>
                </div>
                <div className="border-x border-slate-100">
                  <p className="text-lg font-black">2</p>
                  <p className="text-[11px] text-slate-500">privacy choices</p>
                </div>
                <div>
                  <p className="text-lg font-black">1</p>
                  <p className="text-[11px] text-slate-500">
                    shared evidence base
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-3 rounded-xl bg-sky-50 p-3 text-sm leading-5 text-sky-900">
                <Eye className="mt-0.5 size-4 shrink-0" /> Public results
                aggregate responses. Identifying and free-text answers are not
                displayed.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-sky-800 uppercase">
              Research focus
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              What this work is designed to improve
            </h2>
          </div>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Your dashboard <ArrowUpRight />
          </Button>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {researchPillars.map(({ icon: Icon, title, description, tone }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-sky-800 uppercase">
                Participation journey
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Useful data should not cost privacy.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                The research flow is designed to make the consent and
                data-sharing choice visible before a participant begins.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {steps.map(([number, title, description]) => (
                <article key={number} className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-sky-700">{number}</p>
                  <h3 className="mt-6 font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
        <div className="rounded-3xl bg-[#0f766e] p-7 text-white sm:p-9">
          <p className="text-sm font-bold tracking-[0.14em] text-teal-100 uppercase">
            Contribute
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight">
            Your perspective can improve safer digital guidance.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-teal-50/85">
            The assessment takes you through the study purpose, identity choice,
            and questions in one structured flow.
          </p>
          <Button
            size="lg"
            className="mt-6 bg-white text-teal-900 hover:bg-teal-50"
            render={<Link href="/research/contribute" />}
          >
            Start the survey <ArrowUpRight />
          </Button>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <CheckCircle2 className="size-8 text-sky-700" />
          <h2 className="mt-5 text-2xl font-black">Already participated?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Signed-in, non-anonymous submissions are recorded in your dashboard.
            Anonymous submissions remain anonymous and cannot be linked back.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-sky-800 hover:underline"
          >
            Open your dashboard <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
