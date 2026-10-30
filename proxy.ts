import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const cookieHeader = request.headers.get("cookie") ?? "";
        const sessionResponse = await checkSession(cookieHeader);
        const setCookie = sessionResponse.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          const response = isPublicRoute
            ? NextResponse.redirect(new URL("/", request.url))
            : NextResponse.next();

          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            const { name, value, ...options } = parsed;

            if (value) {
              response.cookies.set(name, value, options);
            }
          }

          if (isPublicRoute || isPrivateRoute) {
            return response;
          }
        }
      } catch {
        // Сесія недійсна або не вдалося її оновити.
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
