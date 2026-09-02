export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  tips: string[];
  cases: string[];
};