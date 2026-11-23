import { NextRequest, NextResponse } from "next/server";

// The English /software/danke/start: Stripe sends buyers from the English pages here after paying. The checkout
// session id moves into a short-lived cookie, so the thank-you page URL cannot unlock the license key.
export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("session_id") ?? "";
  const res = NextResponse.redirect(new URL("/en/thanks", request.url), 303);
  if (/^cs_[A-Za-z0-9_]+$/.test(id)) {
    res.cookies.set("kj_session", id, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 3600, path: "/en/thanks" });
  }
  return res;
}
