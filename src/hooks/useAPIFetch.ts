"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "./axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface requestConfigParamType {
    url?: string;
    method?: string;
    data?: any;
    params?: any;
    headers?: any;
    auth?: any;
}

const useApiFetch = (
    requestConfigParam: requestConfigParamType = {
        url: "",
        method: "",
        data: {},
        params: {},
        headers: {},
        auth: {}
    },
    intialFetch = true
) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [data, setData] = useState<any>(null);
    const [requestConfig] = useState(requestConfigParam);

    const fetchData = useCallback(async (request?: any) => {
        setIsLoading(true);
        setData(null);
        setErrors({});
        try {
            const response = await axios.request({
                ...requestConfig,
                ...request
            });
            setData(response.data || []);
        } catch (error: any) {
            if (error?.response?.status === 400) {
                setErrors({
                    isError: true,
                    message: "Bad request",
                    details: error
                });
            } else if (error?.response?.status === 401) {
                setErrors({
                    isError: true,
                    message: "Unauthorized",
                    details: error
                });
            } else if (error?.response?.status === 404) {
                setErrors({
                    isError: true,
                    message: "NOT FOUND",
                    details: error
                });
            } else if (error?.response?.status === 422) {
                setErrors({
                    isError: true,
                    message: "Invalid Data, check your inputs",
                    details: error
                });
            } else if (error?.response?.status === 415) {
                setErrors({
                    isError: true,
                    message: "Invalid MIME type, check your inputs",
                    details: error
                });
            } else if (
                error?.response?.status &&
                400 <= error?.response?.status &&
                error?.response?.status <= 499
            ) {
                setErrors({
                    isError: true,
                    message: "Bad Request",
                    details: error
                });
            } else if (
                error?.response?.status &&
                500 <= error?.response?.status &&
                error?.response?.status <= 599
            ) {
                setErrors({
                    isError: true,
                    message: "Server Error",
                    details: error
                });
            } else if (error?.response?.data?.message) {
                setErrors({
                    isError: true,
                    message: error?.response?.message,
                    details: error
                });
            } else if (error?.message) {
                setErrors({
                    isError: true,
                    message: error?.message,
                    details: error
                });
            } else {
                setErrors({ isError: true, message: "Unknown Error" });
            }

            // return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        intialFetch && fetchData(requestConfig);
    }, [requestConfig, fetchData, intialFetch]);

    return { isLoading, errors, data, fetchData, setErrors };
};

export default useApiFetch;
