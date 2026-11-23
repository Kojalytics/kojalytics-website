import { getImageProps } from "next/image";
import type { Lang } from "@/lib/i18n";
import "./kbox.css";

const BOX_LABEL = {
  de: "Die Verpackung von Koja Office 2026 mit den 13 App-Symbolen",
  en: "The Koja Office 2026 box with the 13 app icons",
};

/**
 * The Koja Office box of OfficeBox.tsx without client JavaScript (no dragging): the same planes and styles (./kbox.css),
 * server-rendered, so it stands at its place from the first paint. It still sways gently (CSS). The front comes from the
 * image optimiser at the size it is shown (`sizes`), loaded with high priority; spine and top are small files.
 */
export default function OfficeBoxStatic({
  width,
  sizes,
  tone = "dark",
  priority = true,
  className = "",
  lang = "de",
}: {
  /** Width of the front, any CSS length; height and depth follow. */
  width: string;
  /** The `sizes` of the front image, matching `width`. */
  sizes: string;
  tone?: "dark" | "light";
  /** false: further down the page (the Koja Office band above the footer), all three pictures load lazily. */
  priority?: boolean;
  className?: string;
  /** Language of the accessible label (a server component cannot read it from the path). */
  lang?: Lang;
}) {
  const { props: front } = getImageProps({
    src: lang === "en" ? "/office/box-front-en.webp" : "/office/box-front.webp",
    alt: "",
    width: 900,
    height: 1170,
    sizes,
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "auto",
    decoding: "async",
  });

  return (
    <div
      className={`kbox-stage is-static ${tone === "light" ? "on-light" : ""} ${className}`}
      style={{ ["--w" as string]: width }}
      role="img"
      aria-label={BOX_LABEL[lang]}
    >
      <div className="kbox-tilt">
        <div className="kbox">
          {/* eslint-disable @next/next/no-img-element -- faces of a 3D object: plain images at fixed sizes */}
          <img {...front} className="kbox-face kbox-front" alt="" draggable={false} />
          <img className="kbox-face kbox-spine" src="/office/box-spine.webp" alt="" width={248} height={1170} loading={priority ? undefined : "lazy"} decoding="async" draggable={false} />
          <img className="kbox-face kbox-top" src="/office/box-top.webp" alt="" width={900} height={248} loading={priority ? undefined : "lazy"} decoding="async" draggable={false} />
          {/* eslint-enable @next/next/no-img-element */}
          <i className="kbox-face kbox-right" />
          <i className="kbox-face kbox-back" />
          <i className="kbox-face kbox-bottom" />
        </div>
      </div>
      <i className="kbox-glow" />
      <i className="kbox-shadow" />
    </div>
  );
}
