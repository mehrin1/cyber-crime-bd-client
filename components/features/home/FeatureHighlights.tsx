"use client";

import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Learn Cybercrime",
    desc: "Understand threats like phishing, fraud, and harassment.",
    icon: "📚",
  },
  {
    title: "Get Professional Help",
    desc: "Connect with police, lawyers, and psychologists.",
    icon: "🆘",
  },
  {
    title: "Share Your Story",
    desc: "Express your experience anonymously and safely.",
    icon: "🗣️",
  },
  {
    title: "Data & Insights",
    desc: "Help improve awareness through surveys and statistics.",
    icon: "📊",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="grid md:grid-cols-4 gap-4">
      {features.map((f, i) => (
        <Card key={i} className="hover:shadow-lg transition">
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}