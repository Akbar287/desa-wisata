import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "desa-wisata-ui.session-token"
        : "desa-wisata-ui.session-token",
  });

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-wahana/:path*",
    "/admin-theme-tour/:path*",
    "/admin-destinasi/:path*",
    "/admin-tour/:path*",
    "/admin-blog/:path*",
    "/admin-testimoni/:path*",
    "/admin-user/:path*",
    "/admin-payment-available/:path*",
    "/admin-profile/:path*",
    "/admin-team/:path*",
    "/admin-career/:path*",
    "/admin-yayasan/:path*",
    "/admin-landing-page/:path*",
    "/buku-petunjuk/:path*",
    "/proses-bisnis/:path*",
  ],
};
