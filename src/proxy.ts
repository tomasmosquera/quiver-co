import { NextRequest, NextResponse } from "next/server";

// Cookie names used by NextAuth
const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Detect old database-strategy session cookies (not a valid JWT — no dots)
  // JWT tokens have the format: header.payload.signature (at least 2 dots)
  for (const name of SESSION_COOKIES) {
    const cookie = req.cookies.get(name);
    if (cookie && !cookie.value.includes(".")) {
      // Stale DB session token — clear it so NextAuth stops throwing JWTSessionError
      res.cookies.delete(name);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
