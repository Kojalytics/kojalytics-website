import Image from "next/image";

/**
 * A real app screenshot framed as a macOS window: square hairline frame, traffic lights, optional mono label.
 * With `fixedRatio` the image is cropped to 16:10 from the top, so windows in a grid line up.
 */
export default function MacWindow({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  fixedRatio = false,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  fixedRatio?: boolean;
  /** Optional mono caption in the title bar, e.g. "PhotoKoja". */
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden border border-border-strong bg-[#efefed] shadow-[0_24px_48px_-32px_rgba(14,14,16,0.45)] ${className}`}
    >
      <div className="flex h-6 items-center gap-1.5 border-b border-border-strong px-2.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        {label && <span className="ml-auto truncate font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">{label}</span>}
      </div>
      {fixedRatio ? (
        <div className="relative aspect-[16/10] bg-white">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} fetchPriority={priority ? "high" : undefined} className="object-cover object-left-top" />
        </div>
      ) : (
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} fetchPriority={priority ? "high" : undefined} className="block h-auto w-full" />
      )}
    </div>
  );
}
