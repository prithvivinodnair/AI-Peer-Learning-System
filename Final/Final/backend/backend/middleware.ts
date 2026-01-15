import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to home page without authentication
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow home page
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        // Other pages require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - reset-password (password reset page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|reset-password).*)",
  ],
};
