import { Plus } from "lucide-react";
import RichText from "@/components/RichText";

export type FaqItem = { q: string; a: string };

const plain = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: plain(i.a) } })),
  };
}

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start gap-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            <span className="hud mt-1.5 w-6 shrink-0 text-faint">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="flex-1">{item.q}</h3>
            <Plus size={20} className="mt-1 shrink-0 text-muted transition-transform group-open:rotate-45" aria-hidden />
          </summary>
          <p className="mt-3 max-w-3xl pl-11 leading-relaxed text-muted [&_a]:text-accent [&_a]:underline">
            <RichText text={item.a} />
          </p>
        </details>
      ))}
    </div>
  );
}
