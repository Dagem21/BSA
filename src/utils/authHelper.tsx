import { cookies } from "next/headers";
import { createToken, decryptToken } from "./token";

export async function verifyUserAuth() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken || !sessionToken.value) {
        throw new Error("Unauthorized");
    }

    try {
        const decoded = decryptToken(sessionToken.value);
        delete decoded.exp;
        delete decoded.iat;

        const newToken = createToken(decoded);
        cookieStore.set({
            name: "session_token",
            value: newToken,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 1,
            path: "/"
        });

        return decoded;
    } catch (error: any) {
        cookieStore.delete("session_token");
        throw new Error("Unauthorized");
    }
}
