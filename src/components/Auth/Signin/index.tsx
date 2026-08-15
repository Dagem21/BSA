"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import InputGroup from "../../FormElements/InputGroup";
import { Suspense } from "react";
import useApiFetch from "@/hooks/useAPIFetch";
import { useSession } from "@/hooks/useSession";

export default function Signin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session = useSession();

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const {
        data: responseData,
        fetchData,
        isLoading,
        errors
    } = useApiFetch(
        {
            url: "/api/auth/login",
            method: "POST"
        },
        false
    );

    useEffect(() => {
        if (!isLoading && responseData) {
            const callbackURL = searchParams.get("callbackUrl") || "/";
            session.login(responseData?.user);

            router.push(callbackURL);
            router.refresh();
            toast.success("Sign in successful");
        } else if (!isLoading && errors?.details) {
            setError(errors.details?.response?.data?.error);
        }
    }, [responseData, isLoading, errors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        fetchData({ data });
    };
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        type="email"
                        label="Email"
                        className="mb-4 [&_input]:py-3.75"
                        placeholder="Enter your email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        icon={<EmailIcon />}
                    />

                    <InputGroup
                        type="password"
                        label="Password"
                        className="mb-5 [&_input]:py-3.75"
                        placeholder="Enter your password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        icon={<PasswordIcon />}
                    />

                    <div className="mb-4.5">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Sign In
                            {isLoading && (
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
                            )}
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
            </div>
        </Suspense>
    );
}
