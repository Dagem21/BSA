// import { auth } from "@/lib/auth";
// import type { AppRole } from "@/lib/auth/modules/authorization/permissions";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PATHS = ["/auth/sign-in"];
const SESSION_COOKIE_NAME = "session_token";
// const ROLE_PROTECTED: { prefix: string; requiredRole: AppRole }[] = [
//   { prefix: "/dashboard/settings", requiredRole: "admin" },
//   { prefix: "/dashboard/users", requiredRole: "admin" },
// ];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const callbackUrl = `${pathname}${request.nextUrl.search}`;
    const isAuthOnly = AUTH_ONLY_PATHS.some((path) =>
        pathname.startsWith(path)
    );
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
        if (!isAuthOnly) {
            const url = request.nextUrl.clone();
            url.searchParams.set("callbackUrl", callbackUrl);
            url.pathname = "/auth/sign-in";
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
