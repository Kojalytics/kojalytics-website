import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/studio";

/**
 * One project as a cell: place it (or a wrapper with `data-reveal`) inside a `.cells` grid, which draws the hairlines.
 */
export default function ProjectCard({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <Link href={project.href} className="group flex h-full flex-col bg-background">
      <div className="flex min-h-11 items-center justify-between gap-3 px-5 py-3 md:px-6">
        <span className="hud truncate">{project.kind}</span>
        <ArrowUpRight size={14} className="shrink-0 text-faint transition-colors group-hover:text-accent" aria-hidden />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden border-y border-border bg-surface">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="display text-[1.55rem]">{project.title}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <span className="link-hud mt-6 group-hover:text-accent">
          Projekt ansehen <ArrowUpRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
