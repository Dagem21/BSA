"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("session_token");

    // Perform server-side redirect (must be OUTSIDE try/catch)
    redirect("/auth/sign-in");
}
