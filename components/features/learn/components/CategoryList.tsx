"use client";

import { Category } from "../types/types";
import CategoryCard from "./CategoryCard";

type Props = {
  categories: Category[];
  onSelect: (category: Category) => void;
};

export default function CategoryList({ categories, onSelect }: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} onClick={onSelect} />
      ))}
    </div>
  );
}