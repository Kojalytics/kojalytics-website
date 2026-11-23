import Image from "next/image";

export default function AppIcon({
  slug,
  name,
  size = 48,
  priority = false,
  lang = "de",
}: {
  slug: string;
  name: string;
  size?: number;
  priority?: boolean;
  lang?: "de" | "en";
}) {
  return (
    <Image
      src={`/apps/${slug}/icon.webp`}
      alt={`${name} ${lang === "en" ? "app icon" : "App-Icon"}`}
      width={size}
      height={size}
      priority={priority}
      className="shrink-0 rounded-[22%] shadow-[0_6px_14px_-8px_rgba(17,17,19,0.5)]"
    />
  );
}
