"use client";

import ArticleDetails from "@/components/features/learn/components/ArticleDetails";
import ArticleList from "@/components/features/learn/components/ArticleList";
import CategoryList from "@/components/features/learn/components/CategoryList";
import { articles, categories } from "@/components/features/learn/fakeData/data";
import { Article, Category } from "@/components/features/learn/types/types";
import { useState } from "react";

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.categoryId === selectedCategory.id)
    : articles;

  return (
    <div className="space-y-6 p-6">
      <CategoryList
        categories={categories}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setSelectedArticle(null);
        }}
      />

      <div className="border-2 p-4 rounded-2xl bg-amber-50">
        <ArticleList
        articles={filteredArticles}
        onRead={setSelectedArticle}
      />

      <ArticleDetails article={selectedArticle} />
      </div>
    </div>
  );
}