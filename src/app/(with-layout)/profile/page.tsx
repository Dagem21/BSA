"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSession } from "@/hooks/useSession";

export default function Page() {
    const session = useSession();

    const profile = {
        name: session?.user?.displayName,
        role: session?.user?.role || "Role not set",
        lastLogin: session?.user?.lastLogin
    };

    return (
        <div className="mx-auto w-full max-w-242.5">
            <Breadcrumb pageName="Profile" />

            <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="mt-4">
                        <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                            {profile.name}
                        </h3>
                        <p className="font-medium">{profile.role}</p>
                        <p className="font-medium">{profile.lastLogin}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
