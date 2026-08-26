"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RoleTypes } from "@/types/types";
import { useSession, useSessionHydrated } from "@/hooks/useSession";
import { ROLE_ROUTES } from "@/iib/role";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useSession();
    const isHydrated = useSessionHydrated();
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = Boolean(user);

    const matchedRoute = Object.keys(ROLE_ROUTES).find((route) => {
        if (route === "/") return pathname === "/";
        return pathname.startsWith(route);
    });

    const allowedRoles = matchedRoute ? ROLE_ROUTES[matchedRoute] : null;

    const hasAccess =
        !allowedRoles ||
        (user?.role && allowedRoles.includes(user.role as RoleTypes));

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated) {
            router.replace("/auth/sign-in");
            return;
        }

        if (!hasAccess) router.replace("/unauthorized");
    }, [isHydrated, isAuthenticated, hasAccess, router]);

    if (!isHydrated || !isAuthenticated || !hasAccess) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
}
