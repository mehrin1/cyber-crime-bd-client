import Link from "next/link";

const groups = [
  {
    title: "Explore",
    links: [
      ["Cybercrime types", "/learn"],
      ["Legal library", "/laws"],
      ["Official resources", "/professionals"],
      ["Research", "/research"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Seek help", "/help"],
      ["Community", "/community"],
      ["Your dashboard", "/dashboard"],
      ["About CyberSafeBD", "/about"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-teal-950/10 bg-[linear-gradient(180deg,#f0f8f5,#e4f0eb)]">
      <div className="page-container grid gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-12">
        <div>
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-[#092d2a]"
          >
            CyberSafeBD
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            A Bangladesh-focused cyber-safety project for practical learning,
            legal references, official support routes, and privacy-aware
            research.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-teal-950/10 bg-white/70 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-teal-800 uppercase">
            Clear guidance, safer decisions
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-black tracking-[0.12em] text-teal-900 uppercase">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-teal-800 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-teal-950/10 bg-white/35">
        <p className="page-container px-5 py-4 text-center text-xs text-slate-500 sm:px-8 lg:px-12">
          CyberSafeBD provides informational support and does not replace
          emergency, legal, medical, or law-enforcement services. In immediate
          danger in Bangladesh, call 999.
        </p>
      </div>
    </footer>
  );
}
