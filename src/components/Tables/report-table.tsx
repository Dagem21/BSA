"use client";

import { CheckIcon, PlusIcon, XIcon } from "@/assets/icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { DownloadIcon, PreviewIcon } from "./icons";
import useApiFetch from "@/hooks/useAPIFetch";
import { useEffect, useState } from "react";
import Modal from "../Modal/modal";
import { Button } from "../ui-elements/button";
import { toast } from "sonner";
import { ReportDto } from "@/dto/report";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";

export function ReportTable() {
    const [isPopupOpenUpdate, setIsPopupOpenUpdate] = useState(false);
    const [isPopupOpenView, setIsPopupOpenView] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportDto | null>(
        null
    );
    const [rejectionReason, setRejectionReason] = useState<{
        message: string;
        error?: string;
    }>({
        message: "",
        error: ""
    });

    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/report",
        method: "GET"
    });

    const {
        data: dataUpdate,
        fetchData: fetchDataUpdate,
        isLoading: isLoadingUpdate,
        errors: errorsUpdate
    } = useApiFetch(
        {
            url: "/api/report",
            method: "PUT"
        },
        false
    );

    useEffect(() => {
        if (!isLoadingUpdate && dataUpdate) {
            setIsPopupOpenUpdate(false);
            toast.success("Report updated.");
            fetchData();
            setSelectedReport(null);
        } else if (!isLoadingUpdate && errorsUpdate?.details) {
            toast.error(errorsUpdate.details?.response?.data?.error);
        }
    }, [dataUpdate, isLoadingUpdate, errorsUpdate]);

    const handleDownload = async (fileName: string) => {
        try {
            const response = await fetch(
                `/api/report/download?&filename=${encodeURIComponent(fileName)}`
            );

            if (!response.ok) {
                throw new Error("File download failed");
            }

            // 1. Extract filename from Content-Disposition header
            const disposition = response.headers.get("content-disposition");
            let downloadName = fileName; // fallback

            if (disposition && disposition.includes("filename=")) {
                // Regex extracts value inside filename="..." or filename=...
                const match = disposition.match(/filename="?([^";]+)"?/);
                if (match && match[1]) {
                    downloadName = match[1];
                }
            }

            // 2. Trigger browser download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = downloadName; // Uses filename parsed from server
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 sm:p-7.5 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <Link
                href={"/report"}
                className="hover:bg-opacity-90 mb-2 flex inline-flex w-fit cursor-pointer items-center justify-center gap-2.5 rounded bg-primary px-3 py-2.5 text-center font-medium text-white transition focus:outline-none"
            >
                <PlusIcon /> New Report
            </Link>
            <Table>
                <TableHeader>
                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        <TableHead className="min-w-[155px] xl:pl-7.5">
                            Report ID
                        </TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead className="text-right xl:pr-7.5">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.reports?.map((item: ReportDto, index: number) => (
                        <TableRow
                            key={index}
                            className="border-[#eee] dark:border-dark-3"
                        >
                            <TableCell className="min-w-[155px] xl:pl-7.5">
                                <p className="text-dark dark:text-white">
                                    {item?.reportType?.reportId}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item?.startDate
                                        ? new Date(
                                              item.startDate
                                          ).toDateString()
                                        : "N/A"}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item?.endDate
                                        ? new Date(item.endDate).toDateString()
                                        : "N/A"}
                                </p>
                            </TableCell>

                            <TableCell>
                                <div
                                    className={cn(
                                        "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                                        {
                                            "bg-[#219653]/8 text-[#219653]":
                                                item.status === "Submitted",
                                            "bg-[#D34053]/8 text-[#4056d3]":
                                                item.status === "Approved",
                                            "bg-[#FFA70B]/8 text-[#FFA70B]":
                                                item.status === "Pending",
                                            "bg-[#FF0B0B]/8 text-[#FF0B0B]":
                                                item.status === "Rejected" ||
                                                item.status === "Failed"
                                        }
                                    )}
                                >
                                    {item.status}
                                </div>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item?.updatedAt
                                        ? new Date(
                                              item.updatedAt
                                          ).toDateString()
                                        : "N/A"}
                                </p>
                            </TableCell>

                            <TableCell className="xl:pr-7.5">
                                <div className="flex items-center justify-end gap-x-4.5">
                                    <button
                                        className="hover:text-primary"
                                        onClick={() => {
                                            setSelectedReport(item);
                                            setIsPopupOpenView(true);
                                        }}
                                    >
                                        <span className="sr-only">
                                            View Report
                                        </span>
                                        <PreviewIcon />
                                    </button>

                                    {item.status === "Pending" && (
                                        <button
                                            className="hover:text-primary"
                                            onClick={() => {
                                                setSelectedReport(item);
                                                setIsPopupOpenUpdate(true);
                                                setRejectionReason({
                                                    message: "",
                                                    error: ""
                                                });
                                            }}
                                        >
                                            <span className="sr-only">
                                                Approve Report
                                            </span>
                                            <div className="flex items-center justify-center">
                                                <CheckIcon />/
                                                <XIcon />
                                            </div>
                                        </button>
                                    )}

                                    <button
                                        className="hover:text-primary"
                                        onClick={() => {
                                            handleDownload(item?.file || "");
                                        }}
                                    >
                                        <span className="sr-only">
                                            Download Report
                                        </span>
                                        <DownloadIcon />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {data?.reports?.length === 0 && (
                <p className="text-center text-sm">No records to display.</p>
            )}
            <Modal
                isOpen={isPopupOpenView}
                onClose={() => setIsPopupOpenView(false)}
                title="Report Details"
            >
                <div className="flex flex-col gap-2">
                    <div>
                        <label className="text-sm">Report Type: </label>
                        <p className="font-medium">
                            {selectedReport?.reportType?.reportId}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="text-sm">Start Date: </label>
                            <p className="font-medium">
                                {selectedReport?.startDate &&
                                    new Date(
                                        selectedReport?.startDate
                                    ).toDateString()}
                            </p>
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="text-sm">End Date: </label>
                            <p className="font-medium">
                                {selectedReport?.endDate &&
                                    new Date(
                                        selectedReport?.endDate
                                    ).toDateString()}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm">Status: </label>
                        <p
                            className={cn(
                                "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                                {
                                    "bg-[#219653]/8 text-[#219653]":
                                        selectedReport?.status === "Submitted",
                                    "bg-[#D34053]/8 text-[#4056d3]":
                                        selectedReport?.status === "Approved",
                                    "bg-[#FFA70B]/8 text-[#FFA70B]":
                                        selectedReport?.status === "Pending",
                                    "bg-[#FF0B0B]/8 text-[#FF0B0B]":
                                        selectedReport?.status === "Rejected" ||
                                        selectedReport?.status === "Failed"
                                }
                            )}
                        >
                            {selectedReport?.status}
                        </p>
                    </div>
                    {(selectedReport?.status === "Rejected" ||
                        selectedReport?.status === "Failed") && (
                        <div>
                            <label className="text-sm">Reason: </label>
                            <p className="text-sm font-normal">
                                {selectedReport?.response?.toString()}
                            </p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => setIsPopupOpenView(false)}
                        className="dark:border-strokedark dark:hover:bg-meta-4 w-full rounded border border-stroke px-4 py-2 font-medium text-black transition hover:bg-gray-100 sm:flex-1 dark:text-white"
                    >
                        Close
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isPopupOpenUpdate}
                onClose={() => setIsPopupOpenUpdate(false)}
                title="Update Report"
            >
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to approve this report?</p>
                    <div>
                        <TextAreaGroup
                            label="Rejection Reason"
                            value={rejectionReason.message}
                            onChange={(e) =>
                                setRejectionReason({
                                    message: e.target.value,
                                    error: ""
                                })
                            }
                        />
                        {rejectionReason.error && (
                            <span className="mt-1 block text-sm font-medium text-red-500">
                                {rejectionReason.error}
                            </span>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="w-full transition sm:flex-1"
                            label={isLoadingUpdate ? "Updating..." : "Approve"}
                            variant="primary"
                            shape="rounded"
                            size="small"
                            onClick={() => {
                                fetchDataUpdate({
                                    data: {
                                        reportId: selectedReport?._id,
                                        status: "Approved"
                                    }
                                });
                            }}
                        />

                        <Button
                            className="w-full transition sm:flex-1"
                            label={isLoadingUpdate ? "Updating..." : "Reject"}
                            variant="danger"
                            shape="rounded"
                            size="small"
                            onClick={() => {
                                if (!rejectionReason) {
                                    setRejectionReason((prev) => ({
                                        ...prev,
                                        error: "Provide rejection reason."
                                    }));
                                    return;
                                }
                                fetchDataUpdate({
                                    data: {
                                        reportId: selectedReport?._id,
                                        status: "Rejected"
                                    }
                                });
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
