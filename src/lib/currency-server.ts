import { headers } from "next/headers";
import { currencyForRequest, type Currency } from "@/lib/currency";

export { currencyForRequest };

/** The currency of the visitor of the page being rendered (src/lib/currency.ts). Makes the page render per request. */
export async function visitorCurrency(): Promise<Currency> {
  return currencyForRequest(await headers());
}
