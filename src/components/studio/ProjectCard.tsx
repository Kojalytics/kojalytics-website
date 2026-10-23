import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/studio";

export default function ProjectCard({ project, sizes }: { project: Project; sizes: string }) {
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={project.image} alt={project.imageAlt} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-accent">{project.kind}</p>
        <h3 className="display mt-2 text-4xl">{project.title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
        {project.href && (
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent">
            View project <ArrowUpRight size={16} aria-hidden />
          </span>
        )}
      </div>
    </>
  );
  const cls = "group flex flex-col overflow-hidden rounded-[18px] border border-border bg-surface transition-colors hover:border-accent/60";
  return project.href ? (
    <Link href={project.href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
