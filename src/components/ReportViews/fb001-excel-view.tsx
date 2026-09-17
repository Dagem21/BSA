"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface FB001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface FB001ExcelViewProps {
    initialData?: FB001JsonData;
    activeFileName?: string;
}

export function FB001ExcelView({
    initialData,
    activeFileName
}: FB001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<FB001JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        colName: string;
        value: string;
    } | null>(null);

    const { fetchData, data, isLoading, errors } = useApiFetch({
        url: "/api/report/json-view",
        method: "GET"
    });

    useEffect(() => {
        if (!isLoading && data) {
            setReportData(data.data);

            if (data.fileName) setCurrentFileName(data.fileName);
            if (data.availableFiles) setAvailableFiles(data.availableFiles);
        } else if (!isLoading && errors.details) {
            toast.error(
                errors.details?.response?.data?.error ||
                    "Failed to fetch FB001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "FB001" };
        fetchData({ params: query });
    };

    useEffect(() => {
        if (!initialData) {
            fetchJsonData(activeFileName);
        } else if (initialData?.ReturnItemsList?.[0]) {
            const firstItem = initialData.ReturnItemsList[0];
            setSelectedCell({
                cellRef: `C14`,
                code: firstItem.Code,
                colName: firstItem._description,
                value: firstItem.Value || "0"
            });
        }
    }, [activeFileName, initialData]);

    const handleDownloadExcel = async () => {
        if (!currentFileName) return;
        const excelName = currentFileName.endsWith(".json")
            ? currentFileName.replace(/\.json$/, ".xlsx")
            : currentFileName;
        try {
            const res = await fetch(
                `/api/report/download?filename=${encodeURIComponent(excelName)}`
            );
            if (!res.ok) throw new Error("Download failed");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = excelName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to download Excel file.");
        }
    };

    const handleCellClick = (
        code: string,
        rowNum: number,
        value: string,
        desc: string
    ) => {
        setSelectedCell({
            cellRef: `C${rowNum}`,
            code,
            colName: desc,
            value: value || "0"
        });
    };

    const formatNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null || val === "") return "";
        const num = Number(val);
        if (isNaN(num)) return val.toString();
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2
        }).format(num);
    };

    const items = reportData?.ReturnItemsList || [];
    const filteredItems = items.filter(
        (it) =>
            it._description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            it.Code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dark:bg-boxdark dark:border-strokedark flex max-h-[85vh] w-full flex-col overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
            {/* Header / Controls */}
            <div className="dark:border-strokedark dark:bg-meta-4/20 flex flex-wrap items-center justify-between gap-4 border-b border-stroke bg-gray-50/50 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-black dark:text-white">
                            FB001 Balance Sheet
                        </h2>
                        {currentFileName && (
                            <p className="text-body max-w-[200px] truncate text-xs font-medium sm:max-w-[300px]">
                                {currentFileName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="dark:bg-boxdark dark:border-strokedark rounded-md border border-stroke bg-white px-3 py-2 text-sm transition-colors outline-none focus:border-primary"
                        value={currentFileName}
                        onChange={(e) => fetchJsonData(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="" disabled>
                            Select a report...
                        </option>
                        {availableFiles.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>

                    <div className="dark:bg-strokedark/50 flex rounded-lg bg-stroke/50 p-1">
                        <button
                            onClick={() => setViewTab("grid")}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                                viewTab === "grid"
                                    ? "dark:bg-boxdark bg-white text-primary shadow-sm dark:text-white"
                                    : "text-body hover:text-black dark:hover:text-white"
                            )}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                                viewTab === "json"
                                    ? "dark:bg-boxdark bg-white text-primary shadow-sm dark:text-white"
                                    : "text-body hover:text-black dark:hover:text-white"
                            )}
                        >
                            JSON View
                        </button>
                    </div>

                    <button
                        onClick={handleDownloadExcel}
                        disabled={!currentFileName}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                        title="Download Excel"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center p-10">
                    <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    <p className="text-body font-medium">
                        Loading report data...
                    </p>
                </div>
            ) : !reportData ? (
                <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center p-10 text-center">
                    <svg
                        className="text-body/30 mb-4 h-16 w-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
                        No Data Available
                    </h3>
                    <p className="text-body max-w-md">
                        Select a report from the dropdown above or check if the
                        JSON file exists.
                    </p>
                </div>
            ) : viewTab === "json" ? (
                <div className="dark:bg-meta-4/10 flex-1 overflow-auto bg-gray-50 p-4">
                    <pre className="dark:bg-boxdark dark:border-strokedark overflow-x-auto rounded-xl border border-stroke bg-white p-4 font-mono text-xs text-black shadow-sm sm:text-sm dark:text-white">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            ) : (
                <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
                    {/* Left Panel: Search & Hierarchy */}
                    <div className="dark:border-strokedark dark:bg-meta-4/10 flex w-full shrink-0 flex-col border-r border-stroke bg-gray-50/30 md:w-80">
                        <div className="dark:border-strokedark shrink-0 border-b border-stroke p-4">
                            <div className="relative">
                                <span className="text-body absolute top-1/2 left-3 -translate-y-1/2">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search fields or codes..."
                                    className="dark:bg-boxdark dark:border-strokedark w-full rounded-lg border border-stroke bg-white py-2 pr-4 pl-9 text-sm text-black transition-colors outline-none focus:border-primary dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredItems.length === 0 ? (
                                <p className="text-body py-8 text-center text-sm">
                                    No fields match your search.
                                </p>
                            ) : (
                                <div className="space-y-1">
                                    {filteredItems.map((item, idx) => {
                                        const isSelected =
                                            selectedCell?.code === item.Code;
                                        const rowNum =
                                            14 +
                                            items.findIndex(
                                                (i) => i.Code === item.Code
                                            );
                                        const hasValue =
                                            item.Value &&
                                            Number(item.Value) > 0;

                                        return (
                                            <button
                                                key={item.Code}
                                                onClick={() =>
                                                    handleCellClick(
                                                        item.Code,
                                                        rowNum,
                                                        item.Value,
                                                        item._description
                                                    )
                                                }
                                                className={cn(
                                                    "group flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200",
                                                    isSelected
                                                        ? "bg-primary/10 font-medium text-primary"
                                                        : "text-body dark:hover:bg-meta-4 hover:bg-gray-100 hover:text-black dark:hover:text-white"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                                                        hasValue
                                                            ? "bg-success"
                                                            : "dark:bg-strokedark bg-stroke"
                                                    )}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex items-center justify-between gap-2">
                                                        <span className="shrink-0 font-mono text-xs opacity-70">
                                                            {item.Code}
                                                        </span>
                                                        <span className="truncate font-mono text-xs font-medium">
                                                            {formatNumber(
                                                                item.Value
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="line-clamp-2 leading-tight">
                                                        {item._description}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Excel Grid Viewer */}
                    <div className="dark:bg-boxdark relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
                        {/* Formula Bar */}
                        <div className="dark:border-strokedark dark:bg-meta-4/20 flex shrink-0 items-center gap-2 border-b border-stroke bg-gray-50 px-4 py-2">
                            <div className="dark:bg-boxdark dark:border-strokedark w-16 shrink-0 rounded border border-stroke bg-white py-1 text-center font-mono text-sm font-semibold text-black dark:text-white">
                                {selectedCell?.cellRef || ""}
                            </div>
                            <div className="shrink-0 px-1 font-bold text-gray-400">
                                fx
                            </div>
                            <div className="dark:bg-boxdark dark:border-strokedark flex-1 truncate rounded border border-stroke bg-white px-3 py-1 font-mono text-sm text-black dark:text-white">
                                {selectedCell?.value || ""}
                            </div>
                        </div>

                        {/* Minimalist Grid Rendering */}
                        <div className="dark:bg-boxdark flex-1 overflow-auto bg-[#f8f9fa] p-4 md:p-8">
                            <div className="dark:bg-meta-4 dark:border-strokedark mx-auto max-w-4xl overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
                                {/* Metadata Header */}
                                <div className="dark:border-strokedark dark:bg-meta-4/50 grid grid-cols-12 border-b border-stroke bg-gray-50/50 text-sm">
                                    <div className="dark:border-strokedark col-span-12 border-b border-stroke p-4 text-center">
                                        <h3 className="text-lg font-bold text-black dark:text-white">
                                            NATIONAL BANK OF ETHIOPIA
                                        </h3>
                                        <p className="text-body font-medium">
                                            Monthly Balance Sheet Report (FB001)
                                        </p>
                                    </div>
                                    <div className="col-span-12 grid grid-cols-2 gap-4 p-4">
                                        <div>
                                            <div className="mb-1 grid grid-cols-3">
                                                <span className="text-body">
                                                    Institution Code:
                                                </span>
                                                <span className="col-span-2 font-mono font-medium text-black dark:text-white">
                                                    {reportData.InstCode}
                                                </span>
                                            </div>
                                            <div className="mb-1 grid grid-cols-3">
                                                <span className="text-body">
                                                    Financial Year:
                                                </span>
                                                <span className="col-span-2 font-mono font-medium text-black dark:text-white">
                                                    {reportData.FinYear}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 grid grid-cols-3">
                                                <span className="text-body">
                                                    Start Date:
                                                </span>
                                                <span className="col-span-2 font-mono text-black dark:text-white">
                                                    {
                                                        reportData.StartDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                </span>
                                            </div>
                                            <div className="mb-1 grid grid-cols-3">
                                                <span className="text-body">
                                                    End Date:
                                                </span>
                                                <span className="col-span-2 font-mono text-black dark:text-white">
                                                    {
                                                        reportData.EndDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="dark:bg-meta-4 dark:border-strokedark sticky top-0 z-10 grid grid-cols-12 border-b-2 border-stroke bg-gray-100 text-xs font-bold tracking-wider text-black uppercase dark:text-white">
                                    <div className="dark:border-strokedark col-span-1 border-r border-stroke p-3 text-center">
                                        Row
                                    </div>
                                    <div className="dark:border-strokedark col-span-8 border-r border-stroke p-3">
                                        Description
                                    </div>
                                    <div className="col-span-3 p-3 text-right">
                                        Value (ETB)
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div>
                                    {items.map((item, idx) => {
                                        const isSelected =
                                            selectedCell?.code === item.Code;
                                        const rowNum = 14 + idx;
                                        const isMainCategory =
                                            item._description ===
                                                item._description.toUpperCase() &&
                                            item._description.length > 5;

                                        return (
                                            <div
                                                key={item.Code}
                                                onClick={() =>
                                                    handleCellClick(
                                                        item.Code,
                                                        rowNum,
                                                        item.Value,
                                                        item._description
                                                    )
                                                }
                                                className={cn(
                                                    "dark:border-strokedark grid cursor-pointer grid-cols-12 border-b border-stroke text-sm transition-colors",
                                                    isSelected
                                                        ? "bg-primary/5 dark:bg-primary/20"
                                                        : "dark:hover:bg-meta-4/50 hover:bg-gray-50",
                                                    isMainCategory
                                                        ? "dark:bg-meta-4/20 bg-gray-50/50 font-bold"
                                                        : ""
                                                )}
                                            >
                                                <div className="dark:border-strokedark text-body/70 col-span-1 border-r border-stroke p-3 text-center font-mono">
                                                    {rowNum}
                                                </div>
                                                <div className="dark:border-strokedark col-span-8 flex items-center border-r border-stroke p-3 text-black dark:text-white">
                                                    <span
                                                        className={cn(
                                                            "inline-block w-full truncate",
                                                            isMainCategory
                                                                ? ""
                                                                : "pl-4"
                                                        )}
                                                    >
                                                        {item._description}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 p-3 text-right font-mono text-black dark:text-white">
                                                    {formatNumber(item.Value)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
