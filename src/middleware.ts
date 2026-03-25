import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, ROUTES } from "@/constants/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ────────────────────────────────────────────────
  // Public routes — always allow
  // ────────────────────────────────────────────────
  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname as any) ||
    pathname.startsWith(`${ROUTES.TUTORS}/`);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ────────────────────────────────────────────────
  // Try to get session
  // ────────────────────────────────────────────────
  let isAuthenticated = false;
  let userRole: string | undefined;

  try {
    const apiUrl = `${process.env.BACKEND_URL || "https://skillbridge-server-nu.vercel.app"}/api`;
    const baseUrl = apiUrl.endsWith("/api") ? `${apiUrl}/auth` : apiUrl.replace("/api/v1", "/api/auth");

    const response = await fetch(`${baseUrl}/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      isAuthenticated = !!data?.user;
      userRole = data?.user?.role;
    }
  } catch (err) {
    console.error("[Middleware] Session fetch failed:", err);
  }

  console.log(`[Middleware] ${pathname} → Auth: ${isAuthenticated}, Role: ${userRole}`);

  // ────────────────────────────────────────────────
  // If authenticated → redirect AWAY from login/register
  // ────────────────────────────────────────────────
  if (isAuthenticated) {
    if (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER) {
      console.log(`[Middleware] Redirecting logged-in user away from ${pathname}`);
      let redirectTo: string = ROUTES.STUDENT_DASHBOARD;
      if (userRole === "TUTOR") redirectTo = ROUTES.TUTOR_DASHBOARD;
      if (userRole === "ADMIN") redirectTo = ROUTES.ADMIN_DASHBOARD;
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // Role protection for private routes
    const isStudentRoute = pathname.startsWith("/dashboard");
    const isTutorRoute   = pathname.startsWith("/tutor");
    const isAdminRoute   = pathname.startsWith("/admin");

    if (isStudentRoute && userRole !== "STUDENT" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
    if (isTutorRoute && userRole !== "TUTOR" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
  }

  // ────────────────────────────────────────────────
  // Not authenticated → force login for protected routes
  // ────────────────────────────────────────────────
  if (!isAuthenticated && !isPublicRoute) {
    console.log(`[Middleware] Redirecting unauthenticated user to login from ${pathname}`);
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};