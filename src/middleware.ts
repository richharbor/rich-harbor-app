// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getBasePath(pathname: string): string {
  const parts = pathname.split("/");
  return parts[1] || "";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;
  const currentRole = request.cookies.get("currentRole")?.value;

  const publicRoutes = ["/auth/login", "/auth/onboarding", "/auth/verify"];

  // 1️⃣ Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (authToken && pathname.startsWith("/auth/login") && currentRole) {
      return NextResponse.redirect(
        new URL(`/${currentRole}/dashboard`, request.url)
      );
    }
    return NextResponse.next();
  }

  // 2️⃣ Home page → let client-side handle redirection
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 3️⃣ If not authenticated → redirect to login
  if (!authToken || !currentRole) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 4️⃣ Special case: if user tries `/dashboard` without role → redirect
  if (pathname === "/dashboard") {
    return NextResponse.redirect(
      new URL(`/${currentRole}/dashboard`, request.url)
    );
  }

  // 5️⃣ Role enforcement: only allow access under currentRole
  const basePath = getBasePath(pathname);
  if (basePath && basePath !== currentRole) {
    return NextResponse.redirect(
      new URL(`/${currentRole}/dashboard`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
