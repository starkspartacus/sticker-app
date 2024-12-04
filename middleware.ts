import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { isAuthenticated } = getKindeServerSession();
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      const loginUrl = new URL("/api/auth/login", request.url);
      loginUrl.searchParams.set("post_login_redirect_url", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard/:path*"],
};
