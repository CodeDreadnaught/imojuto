import { NextResponse } from "next/server";
import { auth } from "@/auth";

type RouteDecision =
  | { kind: "allow" }
  | { kind: "login"; callbackUrl: string }
  | { kind: "forbidden" };

type AuthState = {
  user?: {
    roleId?: string;
    permissions?: string[];
  };
} | null;

const adminPrefix = "/admin";
const officerPrefix = "/officer";
const dashboardPrefixes = ["/dashboard", "/requests", "/notifications", adminPrefix, officerPrefix];

function isProtectedPath(pathname: string) {
  return dashboardPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasPermission(authState: AuthState, permission: string) {
  return authState?.user?.permissions?.includes(permission) ?? false;
}

export function getRouteGateDecision(authState: AuthState, requestUrl: URL): RouteDecision {
  const { pathname, search } = requestUrl;

  if (!isProtectedPath(pathname)) {
    return { kind: "allow" };
  }

  if (!authState?.user?.roleId) {
    return { kind: "login", callbackUrl: `${pathname}${search}` };
  }

  if (pathname === adminPrefix || pathname.startsWith(`${adminPrefix}/`)) {
    return hasPermission(authState, "user:manage") || hasPermission(authState, "request:assign")
      ? { kind: "allow" }
      : { kind: "forbidden" };
  }

  if (pathname === officerPrefix || pathname.startsWith(`${officerPrefix}/`)) {
    return hasPermission(authState, "request:update_status") || hasPermission(authState, "request:assign")
      ? { kind: "allow" }
      : { kind: "forbidden" };
  }

  return { kind: "allow" };
}

export const proxy = auth((request) => {
  const decision = getRouteGateDecision(request.auth, request.nextUrl);

  if (decision.kind === "login") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", decision.callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (decision.kind === "forbidden") {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/requests/:path*", "/notifications/:path*", "/notifications", "/admin/:path*", "/officer/:path*"],
};
