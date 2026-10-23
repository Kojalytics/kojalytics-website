"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GOOGLE_ADS_ID } from "@/lib/gtag";

const STORAGE_KEY = "kj-consent-v1";
const CHANGE_EVENT = "kj:consent";
const OPEN_EVENT = "kj:open-consent";
const CLARITY_ID = "wrmm9ck898";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Reopens the banner, e.g. from the footer's "Cookie settings". */
export function openConsent() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function Consent() {
  // "unknown" on the server and during hydration, so nothing renders until we know the choice.
  const choice = useSyncExternalStore(subscribe, readChoice, () => "unknown" as const);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const onOpen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const decide = (next: Choice) => {
    const before = readChoice();
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setReopened(false);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    // Scripts that already ran cannot be unloaded; a reload starts the page without them.
    if (before === "granted" && next === "denied") window.location.reload();
  };

  const open = choice === null || (choice !== "unknown" && reopened);

  return (
    <>
      {choice === "granted" && <TrackingScripts />}
      {open && (
        <div
          role="dialog"
          aria-label="Cookie settings"
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-[16px] border border-border bg-surface p-4 shadow-2xl shadow-black/60 sm:flex-row sm:items-center sm:gap-4 sm:p-6">
            <p className="flex-1 text-[13px] leading-snug text-muted sm:text-sm sm:leading-relaxed">
              With your consent we use cookies from Google, Meta and Microsoft to measure our ads. Change it any time in the footer.{" "}
              <Link href="/datenschutz" className="text-foreground underline underline-offset-2">
                Privacy policy
              </Link>
            </p>
            <div className="grid shrink-0 grid-cols-2 gap-2">
              <button onClick={() => decide("denied")} className="btn-secondary text-sm !px-5 !py-2.5">
                Reject
              </button>
              <button onClick={() => decide("granted")} className="btn-primary text-sm !px-5 !py-2.5">
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TrackingScripts() {
  const pathname = usePathname();
  const first = useRef(true);

  // Client-side navigation: report each new page once the tags are loaded.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}
      </Script>
      <Script id="clarity" strategy="lazyOnload">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
      </Script>
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
