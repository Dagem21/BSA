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
import { useEffect, useState } from "react";
import { FilterIcon, RefreshIcon, SearchIcon } from "@/assets/icons";
import { FrequncyTypes, ServiceTypes } from "@/types/types";
import { toast } from "sonner";
import { Select } from "../FormElements/select";
import { FilterType } from "./report-type-table";
import InputGroup from "../FormElements/InputGroup";
import { Button } from "../ui-elements/button";

export function ReportTypeServiceTable() {
    const [reportingDate, setReportingDate] = useState(new Date());
    const [filter, setFilter] = useState<FilterType>({
        show: false,
        reportType: {}
    });

    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/reporttype/status",
        method: "GET"
    });

    const {
        data: dataRerun,
        fetchData: fetchDataRerun,
        isLoading: isLoadingRerun,
        errors: errorRerun
    } = useApiFetch(
        {
            url: "/api/reporttype/rerun",
            method: "POST"
        },
        false
    );

    const reportTypesList: any[] = Array.isArray(data?.reportTypes)
        ? data.reportTypes
        : Array.isArray(data)
          ? data
          : [];

    useEffect(() => {
        if (!isLoadingRerun && dataRerun) {
            toast.success("Service restarted.");
            fetchData({
                params: { reportingDate: reportingDate?.toISOString() || "" }
            });
        } else if (!isLoadingRerun && errorRerun?.details) {
            toast.error(errorRerun.details?.response?.data?.error);
        }
    }, [dataRerun, isLoadingRerun, errorRerun]);

    const handleSearch = () => {
        fetchData({
            params: { reportingDate: reportingDate.toISOString() }
        });
    };

    const handleRerun = (reportTypeID: string) => {
        fetchDataRerun({
            params: {
                reportingDate: reportingDate.toISOString(),
                reportID: reportTypeID
            }
        });
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 sm:p-7.5 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="flex justify-center gap-2">
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

                <Button
                    className="mb-2"
                    onClick={handleSearch}
                    label="Search"
                    shape="rounded"
                    size="small"
                    icon={<SearchIcon />}
                />

                <Button
                    className="mb-2"
                    onClick={() =>
                        setFilter((prev) => ({ ...prev, show: !prev.show }))
                    }
                    label="Filter"
                    shape="rounded"
                    size="small"
                    icon={<FilterIcon />}
                />
            </div>

            {filter.show && (
                <div className="mb-2 flex content-center justify-center gap-3">
                    <InputGroup
                        label=""
                        type="text"
                        value={filter.reportType.reportId ?? ""}
                        onChange={(e) => {
                            setFilter((prev) => ({
                                ...prev,
                                reportType: {
                                    ...prev.reportType,
                                    reportId: e.target.value
                                }
                            }));
                        }}
                        placeholder="Report ID"
                    />

                    <Select
                        className="w-50"
                        label=""
                        items={[
                            { label: "Frequency", value: "" },
                            ...Object.values(FrequncyTypes).map(
                                (frequency) => ({
                                    label: frequency,
                                    value: frequency
                                })
                            )
                        ]}
                        placeholder="Frequency"
                        onChange={(e) => {
                            setFilter((prev) => ({
                                ...prev,
                                reportType: {
                                    ...prev.reportType,
                                    frequency: e.target.value
                                }
                            }));
                        }}
                    />

                    <Select
                        className="w-50"
                        label=""
                        items={[
                            { label: "Service", value: "" },
                            ...Object.values(ServiceTypes).map((service) => ({
                                label: service,
                                value: service
                            }))
                        ]}
                        placeholder="Service"
                        onChange={(e) => {
                            setFilter((prev) => ({
                                ...prev,
                                reportType: {
                                    ...prev.reportType,
                                    service: e.target.value
                                }
                            }));
                        }}
                    />
                </div>
            )}

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
                    {reportTypesList
                        .filter((item) => {
                            if (
                                filter.reportType.reportId &&
                                !item.reportId
                                    ?.toLocaleLowerCase()
                                    ?.includes(
                                        filter.reportType.reportId.toLocaleLowerCase()
                                    )
                            )
                                return false;

                            if (
                                filter.reportType.frequency &&
                                item.frequency != filter.reportType.frequency
                            )
                                return false;

                            if (
                                filter.reportType.service &&
                                item.service != filter.reportType.service
                            )
                                return false;
                            return true;
                        })
                        .map((item: any, index: number) => (
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
                                            item.service ===
                                                ServiceTypes.Manual) &&
                                            ![
                                                "Submitted",
                                                "Approved",
                                                "Pending"
                                            ].includes(
                                                item?.report?.status
                                            ) && (
                                                <button
                                                    className="hover:text-primary"
                                                    onClick={() =>
                                                        handleRerun(item?._id)
                                                    }
                                                    disabled={isLoadingRerun}
                                                >
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
