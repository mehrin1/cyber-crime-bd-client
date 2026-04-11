"use client";

import { Article } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  article: Article | null;
};

export default function ArticleDetails({ article }: Props) {
  if (!article) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>{article.content}</p>

        <div>
          <h3 className="font-semibold">Prevention Tips</h3>
          <ul className="list-disc ml-6 text-sm text-muted-foreground">
            {article.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Real Case Examples</h3>
          <ul className="list-disc ml-6 text-sm text-muted-foreground">
            {article.cases.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}