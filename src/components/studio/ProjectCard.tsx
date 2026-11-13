import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/studio";

/**
 * One project as a text cell (no picture): place it inside a `.cells` grid, which draws the hairlines. It links to our
 * own project page only, never to the project itself.
 */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/projekte/${project.slug}`} className="group flex h-full flex-col bg-background p-5 transition-colors hover:bg-surface md:p-6">
      <span className="flex items-start justify-between gap-3">
        <span className="hud truncate">{project.kind}</span>
        <span className="hud shrink-0 text-faint">{String(index + 1).padStart(2, "0")}</span>
      </span>
      <h3 className="display mt-6 text-[1.4rem] transition-colors group-hover:text-accent">{project.title}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{project.summary}</p>
      <span className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </span>
      <span className="link-hud mt-5 group-hover:text-accent">
        Mehr erfahren <ArrowUpRight size={14} aria-hidden />
      </span>
    </Link>
  );
}
