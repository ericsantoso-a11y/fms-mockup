import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// On Vercel, x-forwarded-host is set to the deployment-specific preview URL.
// NextAuth reads that header to build the OAuth callback URL, ignoring NEXTAUTH_URL.
// We override it here so the callback always uses the canonical production domain.
function withCanonicalHost(req: NextRequest): NextRequest {
  if (!process.env.NEXTAUTH_URL) return req;
  const canonical = new URL(process.env.NEXTAUTH_URL);
  const headers = new Headers(req.headers);
  headers.set("x-forwarded-host", canonical.host);
  headers.set("x-forwarded-proto", "https");
  return new NextRequest(req, { headers });
}

const nextAuthHandler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  return nextAuthHandler(withCanonicalHost(req) as any, {} as any);
}

export async function POST(req: NextRequest) {
  return nextAuthHandler(withCanonicalHost(req) as any, {} as any);
}
