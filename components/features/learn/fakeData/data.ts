import { Article, Category } from "../types/types";


export const categories: Category[] = [
  {
    id: "phishing",
    name: "Phishing",
    description: "Fraudulent attempts to steal sensitive information.",
  },
  {
    id: "identity",
    name: "Identity Theft",
    description: "Using someone’s identity for illegal purposes.",
  },
  {
    id: "harassment",
    name: "Online Harassment",
    description: "Bullying or threats via digital platforms.",
  },
  {
    id: "fraud",
    name: "Financial Fraud",
    description: "Scams involving money transactions.",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title: "How Phishing Works",
    summary: "Understand how attackers trick users into revealing data.",
    content:
      "Phishing attacks usually come through emails or fake websites that look legitimate...",
    categoryId: "phishing",
    tips: [
      "Never click unknown links",
      "Check sender email carefully",
      "Use 2FA",
    ],
    cases: [
      "A victim lost bank access via fake login page",
      "Email scam targeting students",
    ],
  },
  {
    id: "2",
    title: "Protect Yourself from Identity Theft",
    summary: "Learn how criminals misuse your identity.",
    content:
      "Identity theft occurs when someone uses your personal information...",
    categoryId: "identity",
    tips: ["Avoid sharing NID online", "Use strong passwords"],
    cases: ["Fake SIM registration using stolen ID"],
  },
];