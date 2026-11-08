import { NextRequest, NextResponse } from "next/server";

// Stripe sends buyers here after paying. The checkout session id moves into a short-lived cookie, so the
// thank-you page URL (which analytics tags and the browser history see) cannot unlock the licence key.
export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("session_id") ?? "";
  const res = NextResponse.redirect(new URL("/software/danke", request.url), 303);
  if (/^cs_[A-Za-z0-9_]+$/.test(id)) {
    res.cookies.set("kj_session", id, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 3600, path: "/software/danke" });
  }
  return res;
}
