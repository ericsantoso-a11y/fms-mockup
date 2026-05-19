import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isApiAuth = request.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) return NextResponse.next();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: request.nextUrl.protocol === "https:",
    });

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isLoginPage) {
      return NextResponse.redirect(new URL("/pickup-group/list", request.url));
    }

    return NextResponse.next();
  } catch {
    // If token verification fails for any reason, redirect to login for security
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
