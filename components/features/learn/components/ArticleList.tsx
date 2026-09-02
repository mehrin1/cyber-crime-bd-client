"use client";

import { Article } from "../types/types";
import ArticleCard from "./ArticleCard";

type Props = {
  articles: Article[];
  onRead: (article: Article) => void;
};

export default function ArticleList({ articles, onRead }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onRead={onRead}
        />
      ))}
    </div>
  );
}