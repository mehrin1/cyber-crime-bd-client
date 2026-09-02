import {
  ArrowUpRight,
  BookOpenCheck,
  FileBarChart2,
  Gavel,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Siren,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const platformAreas = [
  {
    icon: BookOpenCheck,
    title: "Learn before harm happens",
    text: "Plain-language explanations of cybercrime types, prevention steps, and evidence to preserve after an incident.",
    href: "/learn",
    action: "Explore cybercrime types",
    color: "bg-sky-100 text-sky-800",
  },
  {
    icon: Gavel,
    title: "Understand the legal route",
    text: "A structured library of Bangladesh and international legal references connected to common digital harms.",
    href: "/laws",
    action: "Browse laws",
    color: "bg-amber-100 text-amber-800",
  },
  {
    icon: HeartHandshake,
    title: "Find safer support",
    text: "Official emergency and reporting resources, plus private, account-linked support requests for follow-up.",
    href: "/help",
    action: "Seek help",
    color: "bg-rose-100 text-rose-800",
  },
  {
    icon: FileBarChart2,
    title: "Turn insight into action",
    text: "Privacy-aware surveys and anonymized public trends that help identify awareness and support gaps.",
    href: "/research",
    action: "View research",
    color: "bg-teal-100 text-teal-800",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f7] pb-16 text-slate-950">
      <section className="relative overflow-hidden bg-[#102a43] px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="absolute right-[-8rem] bottom-[-10rem] size-[30rem] rounded-full border-[70px] border-cyan-300/10" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-cyan-200 uppercase">
            <ShieldCheck className="size-4" /> About CyberSafeBD
          </p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Cyber safety should be understandable, actionable, and human.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                CyberSafeBD is a Bangladesh-focused cyber-safety project that
                brings learning, legal references, official support routes, and
                community research into one practical public resource.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-bold text-cyan-100">
                The project principle
              </p>
              <p className="mt-3 text-xl leading-8 font-bold">
                Help people take the next safe step without requiring them to
                become cyber-security experts first.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-sky-800 uppercase">
              Why it exists
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Digital harm often leaves people unsure where to begin.
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-slate-600">
            <p>
              A hacked account, impersonation, financial scam, harassment, or
              image-based abuse can require very different next steps.
              CyberSafeBD helps people locate reliable information before they
              share more data, lose evidence, or follow unsafe advice.
            </p>
            <p>
              The project is designed around practical decision-making:
              recognize the issue, preserve what matters, choose an appropriate
              reporting or support route, and learn how to reduce future risk.
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {platformAreas.map(
            ({ icon: Icon, title, text, href, action, color }) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-sky-800 hover:underline"
                >
                  {action}
                  <ArrowUpRight className="size-4" />
                </Link>
              </article>
            ),
          )}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <article className="rounded-2xl bg-[#0f766e] p-7 text-white sm:p-8">
            <LockKeyhole className="size-7 text-teal-100" />
            <h2 className="mt-5 text-2xl font-black">
              Privacy is part of the service design.
            </h2>
            <p className="mt-3 text-sm leading-6 text-teal-50/85">
              Surveys offer anonymous participation. Private support cases are
              visible only to the signed-in case owner and authorized staff.
              Public research views aggregate trends rather than personal
              stories or free-text answers.
            </p>
            <p className="mt-4 text-sm font-bold text-teal-100">
              Never share passwords, PINs, OTPs, banking credentials, NID
              details, or intimate images.
            </p>
          </article>
          <article className="rounded-2xl border border-rose-200 bg-rose-50 p-7 sm:p-8">
            <Siren className="size-7 text-rose-700" />
            <h2 className="mt-5 text-2xl font-black text-rose-950">
              CyberSafeBD is not an emergency service.
            </h2>
            <p className="mt-3 text-sm leading-6 text-rose-900">
              If there is immediate danger, a threat of physical harm, or an
              urgent need for police, fire, or ambulance support in Bangladesh,
              call National Emergency Service 999. Do not wait for an online
              response.
            </p>
            <a
              href="tel:999"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-800"
            >
              Call 999 <ArrowUpRight className="size-4" />
            </a>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-sky-800 uppercase">
                Use the project
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Start with the question you have today.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Explore a crime type, locate a law, find a verified official
                resource, contribute research insight, or create a private
                support request.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:self-end">
              <Button size="lg" render={<Link href="/learn" />}>
                Learn about cybercrime <ArrowUpRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/help" />}
              >
                Seek help <ArrowUpRight />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
