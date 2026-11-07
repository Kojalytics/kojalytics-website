import Image from "next/image";

/**
 * A real app screenshot framed as a macOS window: rounded corners, traffic lights, soft shadow.
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
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  fixedRatio?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[12px] bg-[#ececeb] ring-1 ring-black/10 shadow-[0_30px_60px_-30px_rgba(17,17,19,0.45),0_12px_24px_-12px_rgba(17,17,19,0.18)] ${className}`}
    >
      <div className="flex h-7 items-center gap-1.5 px-3" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
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
