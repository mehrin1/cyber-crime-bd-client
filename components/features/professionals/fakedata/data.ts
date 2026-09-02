import { Advice, Professional } from "../types/types";


export const professionals: Professional[] = [
  {
    id: "p1",
    name: "Inspector Rahman",
    role: "police",
    designation: "Cyber Crime Unit Officer",
    organization: "Dhaka Metropolitan Police",
    verified: true,
  },
  {
    id: "p2",
    name: "Advocate Sara Khan",
    role: "lawyer",
    designation: "Cyber Law Specialist",
    organization: "Supreme Court",
    verified: true,
  },
  {
    id: "p3",
    name: "Dr. Hasan Mahmud",
    role: "psychologist",
    designation: "Clinical Psychologist",
    organization: "Mind Care BD",
    verified: true,
  },
];

export const advices: Advice[] = [
  {
    id: "a1",
    title: "What to do if your account is hacked",
    content:
      "Immediately change your password and report to the cyber crime unit. Avoid using same passwords.",
    category: "phishing",
    professionalId: "p1",
    createdAt: "2026-04-10",
  },
  {
    id: "a2",
    title: "Legal steps against online harassment",
    content:
      "Collect evidence (screenshots) and file a complaint under cyber security laws.",
    category: "harassment",
    professionalId: "p2",
    createdAt: "2026-04-09",
  },
  {
    id: "a3",
    title: "Handling mental stress after cybercrime",
    content:
      "Talk to someone you trust and seek professional help if anxiety persists.",
    category: "mental",
    professionalId: "p3",
    createdAt: "2026-04-08",
  },
];