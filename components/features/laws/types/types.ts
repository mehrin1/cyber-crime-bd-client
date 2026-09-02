export type LawRegion = "international" | "bangladesh";

export type LawCategory =
  | "cybercrime"
  | "data_protection"
  | "harassment"
  | "financial";

export type Law = {
  id: string;
  title: string;
  description: string;
  region: LawRegion;
  category: LawCategory;
  authority: string;
  publishedDate: string;
  source?: string;
};