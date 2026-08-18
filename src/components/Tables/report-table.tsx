"use client";

import { CheckIcon, PlusIcon, TrashIcon } from "@/assets/icons";
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
import { ReportTypeDto } from "@/dto/reportType";
import { useEffect, useState } from "react";
import Modal from "../Modal/modal";
import { Button } from "../ui-elements/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReportFormValues, reportSchema } from "@/yup/reportType";
import InputGroup from "../FormElements/InputGroup";
import { toast } from "sonner";
import { Select } from "../FormElements/select";
import { ReportDto } from "@/dto/report";
import { cn } from "@/lib/utils";

export function ReportTable() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenUpdate, setIsPopupOpenUpdate] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportDto | null>(
        null
    );
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

    const {
        data: dataCreate,
        fetchData: fetchDataCreate,
        isLoading: isLoadingCreate,
        errors: errorCreate
    } = useApiFetch(
        {
            url: "/api/report",
            method: "POST"
        },
        false
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ReportFormValues>({
        resolver: yupResolver(reportSchema),
        defaultValues: {
            reportId: "",
            description: "",
            frequency: "Monthly",
            service: "Manual"
        }
    });

    useEffect(() => {
        if (!isLoadingCreate && dataCreate) {
            setIsPopupOpen(false);
            toast.success("Report created.");
            fetchData();
            reset();
        } else if (!isLoadingCreate && errorCreate?.details) {
            toast.error(errorCreate.details?.response?.data?.error);
        }
    }, [dataCreate, isLoadingCreate, errorCreate]);

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

    const onSubmit = (data: ReportFormValues) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(
                ([_, val]) => val !== "" && val !== null
            )
        );

        fetchDataCreate({ data: cleanData });
    };

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
            <Button
                className="mb-2"
                onClick={() => setIsPopupOpen(true)}
                label="New Report"
                variant="primary"
                shape="rounded"
                size="small"
                icon={<PlusIcon />}
            />
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
                                                item.status === "Pending"
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
                                    <button className="hover:text-primary">
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
                                            }}
                                        >
                                            <span className="sr-only">
                                                Approve Report
                                            </span>
                                            <CheckIcon />
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
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="New Report"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <InputGroup
                            label="Report ID"
                            type="text"
                            placeholder="Enter Report ID"
                            {...register("reportId")}
                        />
                        {errors.reportId && (
                            <p className="text-sm text-red-500">
                                {errors.reportId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Service"
                            items={[
                                { label: "Manual", value: "Manual" },
                                { label: "Auto", value: "Auto" },
                                { label: "None", value: "None" }
                            ]}
                            defaultValue="Manual"
                            {...register("service")}
                        />
                        {errors.service && (
                            <p className="text-sm text-red-500">
                                {errors.service.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Frequency"
                            items={[
                                { label: "Daily", value: "Daily" },
                                { label: "Weekly", value: "Weekly" },
                                { label: "Monthly", value: "Monthly" },
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Yearly", value: "Yearly" }
                            ]}
                            defaultValue="Monthly"
                            {...register("frequency")}
                        />
                        {errors.frequency && (
                            <p className="text-sm text-red-500">
                                {errors.frequency.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputGroup
                            label="Description"
                            type="text"
                            placeholder="Enter Description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="w-full transition sm:flex-1"
                            label={isLoadingCreate ? "Saving..." : "Submit"}
                            variant="primary"
                            shape="rounded"
                            size="small"
                        />

                        <button
                            type="button"
                            onClick={() => setIsPopupOpen(false)}
                            className="dark:border-strokedark dark:hover:bg-meta-4 w-full rounded border border-stroke px-4 py-2 font-medium text-black transition hover:bg-gray-100 sm:flex-1 dark:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal
                isOpen={isPopupOpenUpdate}
                onClose={() => setIsPopupOpenUpdate(false)}
                title="Update Report"
            >
                <p>Are you sure you want to approve this report?</p>
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

                    <button
                        type="button"
                        onClick={() => setIsPopupOpenUpdate(false)}
                        className="dark:border-strokedark dark:hover:bg-meta-4 w-full rounded border border-stroke px-4 py-2 font-medium text-black transition hover:bg-gray-100 sm:flex-1 dark:text-white"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}
