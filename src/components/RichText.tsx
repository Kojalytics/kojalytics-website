import Link from "next/link";
import { Fragment, type ReactNode } from "react";

// Renders the small inline markup used in the content files: **bold** and [label](/link).
// Only internal links become links: the site owner wants no links that lead visitors away.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

export default function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  const out: ReactNode[] = parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={i} href={href}>
          {label}
        </Link>
      ) : (
        <Fragment key={i}>{label}</Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
  return <>{out}</>;
}
