// Ratgeber (guides): German articles that answer real search questions and lead to the Koja apps.
// Each article is a JSON file in src/content/ratgeber/; the list below defines order and inclusion.

import { ARTICLE_FILES } from "@/content/ratgeber";

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "tip"; text: string }
  | { type: "app"; app: string; text: string };

export type Article = {
  slug: string;
  /** Short title for lists and the footer. */
  navTitle: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  /** ISO date of the last factual review. */
  updated: string;
  readingMinutes: number;
  intro: string[];
  sections: { id: string; h2: string; blocks: Block[] }[];
  faq: { q: string; a: string }[];
  apps: string[];
  sources: { label: string; url: string }[];
};

export const ARTICLES: Article[] = ARTICLE_FILES as Article[];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
