export type Role = "user" | "professional";

export type ProfessionalType =
  | "police"
  | "lawyer"
  | "psychologist"
  | "human_rights";

export type HelpCategory = "legal" | "mental" | "emergency";

export type CaseStatus = "pending" | "in-progress" | "resolved";

export type HelpRequest = {
  id: string;
  title: string;
  description: string;
  category: HelpCategory;
  isAnonymous: boolean;
  status: CaseStatus;
  createdAt: string;
};

export type Message = {
  id: string;
  sender: "user" | "professional";
  text: string;
  timestamp: string;
};