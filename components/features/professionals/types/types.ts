export type ProfessionalType =
  | "police"
  | "lawyer"
  | "psychologist"
  | "human_rights";

export type Professional = {
  id: string;
  name: string;
  role: ProfessionalType;
  designation: string;
  organization: string;
  verified: boolean;
};

export type Advice = {
  id: string;
  title: string;
  content: string;
  category: string;
  professionalId: string;
  createdAt: string;
};