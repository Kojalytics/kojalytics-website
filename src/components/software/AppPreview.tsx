import Image from "next/image";
import { appInk, type KojaApp } from "@/lib/apps";

/**
 * The picture at the top of an app card: our own product picture where there is one, otherwise a
 * window with three file cards for the file types the app opens (no third-party screenshots).
 */
export default function AppPreview({ app, sizes }: { app: KojaApp; sizes: string }) {
  if (app.product) {
    return (
      <Image
        src={app.product.src}
        alt={app.product.alt}
        fill
        sizes={sizes}
        className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]"
      />
    );
  }

  const ink = appInk(app.color);
  return (
    <div
      role="img"
      aria-label={`${app.name} öffnet ${app.fileTypes.join(", ")}`}
      className="app-tile absolute inset-0 flex flex-col"
      style={{ ["--c" as string]: app.color, ["--ink" as string]: ink }}
    >
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border bg-white px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-auto mr-auto -translate-x-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{app.name}</span>
      </div>
      <div className="flex flex-1 items-center justify-center gap-0 pb-2">
        {app.fileTypes.map((t, i) => (
          <span key={t} className="app-tile-file" style={{ ["--r" as string]: `${(i - 1) * 7}deg`, ["--y" as string]: i === 1 ? "-6px" : "4px" }}>
            <span className="font-mono text-[12px] font-semibold tracking-[0.04em]" style={{ color: ink }}>
              {t}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
