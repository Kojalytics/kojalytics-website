import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/studio";

export default function ProjectCard({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <Link
      href={project.href}
      className="group flex flex-col overflow-hidden rounded-[22px] border border-border bg-white transition-[box-shadow,border-color] hover:border-[#d6d3d1] hover:shadow-[0_20px_40px_-24px_rgba(17,17,19,0.3)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image src={project.image.src} alt={project.image.alt} fill sizes={sizes} className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted">{project.kind}</p>
        <h3 className="display mt-1 text-3xl">{project.title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full bg-surface px-3 py-1 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
          Projekt ansehen <ArrowRight size={16} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
