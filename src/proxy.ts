import { NextRequest, NextResponse } from "next/server";

export const PUBLIC_PATHS = ["/auth/sign-in"];
export const SESSION_COOKIE_NAME = "session_token";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const callbackUrl = `${pathname}${request.nextUrl.search}`;
    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie && !isPublic) {
        const url = request.nextUrl.clone();
        url.searchParams.set("callbackUrl", callbackUrl);
        url.pathname = "/auth/sign-in";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
