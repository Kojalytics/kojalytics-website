"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { isCurrency, type Currency } from "@/lib/currency";

/**
 * The visitor's currency on the client. Pages that sell render per request and pass it down (<CurrencyProvider>), so
 * the first paint already has the right prices. Elsewhere (the Koja Office band at the bottom of static pages, the phone
 * menu) it comes from the kj-cur cookie the middleware sets from the visitor's country, after hydration.
 */
const CurrencyContext = createContext<Currency | null>(null);

export function CurrencyProvider({ currency, children }: { currency: Currency; children: ReactNode }) {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

const noSubscribe = () => () => {};
function fromCookie(): Currency {
  const m = document.cookie.match(/(?:^|;\s*)kj-cur=([A-Z]{3})/);
  return m && isCurrency(m[1]) ? m[1] : "EUR";
}

export function useCurrency(): Currency {
  const given = useContext(CurrencyContext);
  const cookie = useSyncExternalStore(noSubscribe, fromCookie, () => "EUR" as Currency);
  return given ?? cookie;
}
