import { useSyncExternalStore } from "react";
import type { Plan } from "@/lib/pricing";

/** A discount code checked with Stripe, as /api/license/discount returns it. */
export type Discount = {
  code: string;
  label: string;
  duration: "once" | "repeating" | "forever";
  months: number | null;
  prices: Partial<Record<Plan, number>>;
};

export const euro = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }) + " €";

/**
 * One discount for the whole page: an ad link (/software?code=X, also ?rabatt=X) or a code redeemed in the price
 * section applies to every price and buy button. The code is kept for this browser tab (sessionStorage), so it
 * survives moving between /software and the app pages. The server always renders the normal prices.
 */
const KEY = "kj-discount-code";

let discount: Discount | null = null;
// Bumped on every change, so a slow check of the link's code can't undo a later redeem or remove.
let version = 0;
let started = false;
const listeners = new Set<() => void>();

function set(next: Discount | null) {
  discount = next;
  version++;
  try {
    if (next) sessionStorage.setItem(KEY, next.code);
    else sessionStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((listener) => listener());
}

export const applyDiscount = (next: Discount) => set(next);
export const clearDiscount = () => set(null);

// The code from the link (or kept from an earlier page), checked once per page load.
async function applyStoredCode() {
  let code = "";
  try {
    const params = new URLSearchParams(window.location.search);
    code = (params.get("code") || params.get("rabatt") || sessionStorage.getItem(KEY) || "").trim();
    if (code) sessionStorage.setItem(KEY, code);
  } catch {}
  if (!code) return;
  const v = version;
  try {
    const res = await fetch("/api/license/discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = res.ok ? await res.json() : null;
    if (version !== v) return;
    if (data) set(data);
    // Unknown, used up or expired: forget it without a message. Rate limit or server trouble: keep it for the next page.
    else if (res.status < 500 && res.status !== 429) set(null);
  } catch {}
}

function subscribe(listener: () => void) {
  if (!started) {
    started = true;
    void applyStoredCode();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDiscount() {
  return useSyncExternalStore(
    subscribe,
    () => discount,
    () => null,
  );
}
