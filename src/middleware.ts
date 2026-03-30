import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  // Prefer Auth.js v5 secret name, but support legacy NEXTAUTH_SECRET.
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const role =
    typeof token?.role === "string"
      ? token.role.toLowerCase()
      : undefined;
  const isAdmin = role === "admin";

  if (isAdminRoute && !isAdmin) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
