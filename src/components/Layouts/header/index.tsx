"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
    const { toggleSidebar, isMobile } = useSidebarContext();

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 md:px-5 2xl:px-10 dark:border-stroke-dark dark:bg-gray-dark">
            <button
                onClick={toggleSidebar}
                className="rounded-lg border px-1.5 py-1 lg:hidden dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A]"
            >
                <MenuIcon />
                <span className="sr-only">Toggle Sidebar</span>
            </button>

            {isMobile && (
                <Link href={"/"} className="ml-2 max-[430px]:hidden 2xsm:ml-4">
                    <Image
                        src={"/images/logo/logo-icon.svg"}
                        width={32}
                        height={32}
                        alt=""
                        role="presentation"
                    />
                </Link>
            )}

            <div className="max-xl:hidden">
                <p className="font-medium">BSA Reporting</p>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 2xsm:gap-4">
                <ThemeToggleSwitch />

                <div className="shrink-0">
                    <UserInfo />
                </div>
            </div>
        </header>
    );
}
