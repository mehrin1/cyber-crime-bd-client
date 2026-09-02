"use client";

import { Article } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  article: Article;
  onRead: (article: Article) => void;
};

export default function ArticleCard({ article, onRead }: Props) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.summary}
        </p>

        <Button
          variant="link"
          className="p-0 mt-2"
          onClick={() => onRead(article)}
        >
          Read More →
        </Button>
      </CardContent>
    </Card>
  );
}