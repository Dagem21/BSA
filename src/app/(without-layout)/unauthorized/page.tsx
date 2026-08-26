import Signin from "@/components/Auth/Signin";
import { AlertErrorIcon } from "@/components/ui-elements/alert/icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign in"
};

export default function unauthorized() {
    return (
        <div className="flex min-h-screen flex-wrap items-center justify-center">
            <div className="p-6">
                <div className="custom-gradient-1 flex flex-col items-center overflow-hidden rounded-2xl p-12.5 px-15 dark:bg-dark-2! dark:bg-none">
                    <AlertErrorIcon width={100} height={100} />

                    <h1 className="mb-4 text-2xl font-bold text-dark sm:text-heading-3 dark:text-white">
                        Unauthorized!
                    </h1>

                    <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                        You do not have permission to access this page
                    </p>
                    <Link className="font-bold text-primary" href="/">
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
