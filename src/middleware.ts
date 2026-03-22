import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Protect Admin Routes
    if (pathname.startsWith("/admin")) {
        if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
        if (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/discover", req.url));
        }
    }

    // Protect Private User Routes
    if (pathname.startsWith("/profile") || pathname.startsWith("/settings") || pathname.startsWith("/messages") || pathname.startsWith("/discover")) {
        if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup")) {
        if (token) return NextResponse.redirect(new URL("/discover", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*", "/settings/:path*", "/messages/:path*", "/discover/:path*", "/auth/:path*"],
};
