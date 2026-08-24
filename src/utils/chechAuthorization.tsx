import { cookies } from "next/headers";
import { decryptToken } from "./token";
import { RoleTypes } from "@/types/types";

export async function authorizeUser(role: RoleTypes[]) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken || !sessionToken.value) throw new Error("Unauthorized");

    try {
        const decoded = decryptToken(sessionToken.value);
        if (!role.includes(decoded.role)) throw new Error("Unauthorized");

        return;
    } catch (error: any) {
        throw new Error("Unauthorized");
    }
}
