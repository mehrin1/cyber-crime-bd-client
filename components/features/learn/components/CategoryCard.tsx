"use client";

import { Category } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  category: Category;
  onClick: (category: Category) => void;
};

export default function CategoryCard({ category, onClick }: Props) {
  return (
    <Card
      onClick={() => onClick(category)}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {category.description}
        </p>
      </CardContent>
    </Card>
  );
}