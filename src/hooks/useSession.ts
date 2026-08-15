"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
    user: any;
    login: (userData: any) => void;
    logout: () => void;
}

export const useSession = create<AppState>()(
    persist(
        (set) => ({
            user: null,

            login: (userData: any) => set({ user: userData }),
            logout: () => set({ user: null })
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export const useSessionHydrated = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const unsub = useSession.persist.onHydrate(() => setHydrated(false));
        const unsubFinish = useSession.persist.onFinishHydration(() =>
            setHydrated(true)
        );

        setHydrated(useSession.persist.hasHydrated());

        return () => {
            unsub();
            unsubFinish();
        };
    }, []);

    return hydrated;
};
