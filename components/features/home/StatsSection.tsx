"use client";

const stats = [
  { label: "Users Helped", value: "1,200+" },
  { label: "Cases Reported", value: "350+" },
  { label: "Verified Professionals", value: "45+" },
  { label: "Awareness Articles", value: "80+" },
];

export default function StatsSection() {
  return (
    <section className="bg-muted rounded-xl p-8 grid md:grid-cols-4 gap-6 text-center">
      {stats.map((stat, i) => (
        <div key={i}>
          <h2 className="text-2xl font-bold">{stat.value}</h2>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}