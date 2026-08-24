"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import useApiFetch from "@/hooks/useAPIFetch";
import DatePickerOne from "../FormElements/DatePicker/DatePickerOne";
import { useState } from "react";
import { RefreshIcon, SearchIcon } from "@/assets/icons";
import { ServiceTypes } from "@/types/types";

export function ReportTypeServiceTable() {
    const [reportingDate, setReportingDate] = useState(new Date());
    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/reporttype/status",
        method: "GET"
    });

    const handleSearch = () => {
        fetchData({
            params: { reportingDate: reportingDate.toISOString() }
        });
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 sm:p-7.5 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex justify-center gap-2">
                <DatePickerOne
                    label=""
                    placeholder="Reporting Date"
                    value={reportingDate || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                            setReportingDate(new Date());
                            return;
                        }

                        const parsedDate = new Date(val);
                        setReportingDate(parsedDate);
                    }}
                />
                <button
                    className="hover:bg-opacity-90 flex inline-flex w-fit cursor-pointer items-center justify-center gap-2.5 rounded bg-primary px-3 py-2.5 text-center font-medium text-white transition focus:outline-none"
                    onClick={handleSearch}
                >
                    <SearchIcon /> Search
                </button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        <TableHead className="min-w-[155px] xl:pl-7.5">
                            Report ID
                        </TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right xl:pr-7.5">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.reportTypes?.map((item: any, index: number) => (
                        <TableRow
                            key={index}
                            className="border-[#eee] dark:border-dark-3"
                        >
                            <TableCell className="min-w-[155px] xl:pl-7.5">
                                <p className="text-dark dark:text-white">
                                    {item.reportId}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item.frequency}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item.service}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item?.report?.status || "N/A"}
                                </p>
                            </TableCell>

                            <TableCell className="xl:pr-7.5">
                                <div className="flex items-center justify-end gap-x-3.5">
                                    {(item.service === ServiceTypes.Auto ||
                                        item.service === ServiceTypes.Manual) &&
                                        ![
                                            "Submitted",
                                            "Approved",
                                            "Pending"
                                        ].includes(item?.report?.status) && (
                                            <button className="hover:text-primary">
                                                <span className="sr-only">
                                                    Run Service
                                                </span>
                                                <RefreshIcon />
                                            </button>
                                        )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {data?.reportTypes?.length === 0 && (
                <p className="text-center text-sm">No records to display.</p>
            )}
        </div>
    );
}
