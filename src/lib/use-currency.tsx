"use client";

import { createContext, useContext, type ReactNode } from "react";
import { currencyFor, type Currency } from "@/lib/currency";
import { useLang } from "@/lib/use-lang";

/**
 * The visitor's currency on the client. Pages that sell pass it down (<CurrencyProvider>); elsewhere (the Koja Office
 * band at the bottom of static pages, the phone menu) it follows the language of the page (src/lib/currency.ts).
 */
const CurrencyContext = createContext<Currency | null>(null);

export function CurrencyProvider({ currency, children }: { currency: Currency; children: ReactNode }) {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): Currency {
  const given = useContext(CurrencyContext);
  const lang = useLang();
  return given ?? currencyFor(lang);
}
