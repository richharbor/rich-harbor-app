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

    // ✅ Public routes available to everyone
    const publicRoutes = [
        "/auth/login",
        "/auth/signup",
        "/auth/onboarding" // allow onboarding for authenticated & unauthenticated
    ];

    // 1️⃣ Public route handling
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        // If logged in and on login/signup, go to dashboard
        if (authToken && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup"))) {
            return NextResponse.redirect(new URL(`/${currentRole}/dashboard`, request.url));
        }
        // Onboarding should always be accessible
        return NextResponse.next();
    }

    // 2️⃣ Home page — let React client redirect based on role/profile
    if (pathname === "/") {
        return NextResponse.next();
    }

    // 3️⃣ Redirect to login if not authenticated
    if (!authToken || !currentRole) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 4️⃣ Role enforcement: /broker/* → broker, /superadmin/* → superadmin
    const basePath = getBasePath(pathname);
    if (basePath && basePath !== currentRole) {
        return NextResponse.redirect(new URL(`/${currentRole}/dashboard`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
