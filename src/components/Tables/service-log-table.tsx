"use client";

import { SearchIcon } from "@/assets/icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import useApiFetch from "@/hooks/useAPIFetch";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Pager } from "../pager";
import { Select } from "../FormElements/select";
import { ReportTypeDto } from "@/dto/reportType";
import DatePickerOne from "../FormElements/DatePicker/DatePickerOne";
import { SystemLogDto } from "@/dto/systemLog";

export function ServiceLogTable() {
    const [filter, setFilter] = useState<SystemLogDto>({
        createdAt: new Date()
    });

    const { data: dataReportType } = useApiFetch({
        url: "/api/reporttype",
        method: "GET"
    });

    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/logs/service",
        method: "GET",
        params: { createdAt: new Date() }
    });

    const handleSearch = (page: number = 1, limit: number = 10) => {
        fetchData({
            params: { page, limit, ...filter }
        });
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 sm:p-7.5 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex justify-between gap-2">
                <Select
                    label=""
                    items={[
                        {
                            label: "All",
                            value: ""
                        },
                        ...(dataReportType?.reportTypes?.map(
                            (item: ReportTypeDto) => ({
                                label: `${item.reportId} (${item.service})`,
                                value: item._id
                            })
                        ) ?? []) // Fallback to an empty array if undefined/null
                    ]}
                    placeholder="Report type"
                    onChange={(e) => {
                        setFilter((prev) => ({
                            ...prev,
                            reportType: e.target.value
                        }));
                    }}
                />
                <DatePickerOne
                    label=""
                    placeholder="Log Date"
                    value={
                        filter?.createdAt
                            ? new Date(filter?.createdAt)
                            : undefined
                    }
                    onChange={(e) => {
                        const val = e.target.value;
                        setFilter((prev) => ({
                            ...prev,
                            reportingDate: val || ""
                        }));
                    }}
                />

                <button
                    className="hover:bg-opacity-90 flex inline-flex w-fit cursor-pointer items-center justify-center gap-2.5 rounded bg-primary px-3 py-2.5 text-center font-medium text-white transition focus:outline-none"
                    onClick={() => handleSearch(1, 10)}
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
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started At</TableHead>
                        <TableHead>Finished At</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.contents?.logs?.map(
                        (item: SystemLogDto, index: number) => (
                            <TableRow
                                key={index}
                                className="border-[#eee] dark:border-dark-3"
                            >
                                <TableCell className="min-w-[155px] xl:pl-7.5">
                                    <p className="text-dark dark:text-white">
                                        {item?.reportID?.reportId}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-dark dark:text-white">
                                        {item?.createdAt
                                            ? new Date(
                                                  item.createdAt
                                              ).toDateString()
                                            : "N/A"}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <div
                                        className={cn(
                                            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                                            {
                                                "bg-[#219653]/8 text-[#219653]":
                                                    item.status === "Success",
                                                "bg-[#FF0B0B]/8 text-[#FF0B0B]":
                                                    item.status ===
                                                        "Rejected" ||
                                                    item.status === "Failed"
                                            }
                                        )}
                                    >
                                        {item.status}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <p className="text-dark dark:text-white">
                                        {item?.startedAt
                                            ? new Date(
                                                  item.startedAt
                                              ).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-dark dark:text-white">
                                        {item?.finishedAt
                                            ? new Date(
                                                  item.finishedAt
                                              ).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-dark dark:text-white">
                                        {item?.description}
                                    </p>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
            {data?.contents?.total === 0 ? (
                <p className="text-center text-sm">No records to display.</p>
            ) : (
                <Pager
                    page={data?.contents?.page}
                    limit={data?.contents?.limit}
                    total={data?.contents?.total}
                    fetchNext={handleSearch}
                />
            )}
        </div>
    );
}
