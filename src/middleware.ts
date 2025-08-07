// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value
    const role = request.cookies.get('role')?.value

    const { pathname } = request.nextUrl

    // Redirect to login if no authToken
    if (!authToken) {
        const loginUrl = new URL('/auth/login', request.url)
        return NextResponse.redirect(loginUrl)
    }


    // 2. Admin trying to access user routes → redirect to /admin/dashboard
    if (role === 'admin' && pathname.startsWith('/superadmin')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // 3. User trying to access admin routes → redirect to /user/dashboard
    if (role === 'superadmin' && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url))
    }

    // Optionally, redirect based on role
    if (pathname === '/') {
        if (role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        } else if (role === 'superadmin') {
            return NextResponse.redirect(new URL('/superadmin/dashboard', request.url))
        }
    }

    // Allow request to proceed
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * - /_next (Next.js internals)
         * - /auth/login (login page)
         */
        '/((?!_next|auth/login).*)',
    ],
}
