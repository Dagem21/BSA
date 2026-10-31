"use client";

import React, { useState, useEffect } from "react";
import { LP001_ITEM_DEFINITIONS } from "@/utils/services/LP001/jsonFormat";
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

interface LP001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
    DynamicItemsList?: any[];
}

interface LP001ExcelViewProps {
    initialData?: LP001JsonData;
    activeFileName?: string;
}

export function LP001ExcelView({
    initialData,
    activeFileName
}: LP001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<LP001JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        colName: string;
        value: string;
    } | null>({
        cellRef: "C16",
        code: "21_00001",
        colName: "Pass (Sum 1.1-1.4)_Amount (A)",
        value: ""
    });

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
                    "Failed to fetch LP001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? `?fileName=${encodeURIComponent(fileName)}`
            : "";
        fetchData({ overrideUrl: `/api/report/json-view${query}` });
    };

    useEffect(() => {
        if (currentFileName && !initialData) {
            fetchJsonData(currentFileName);
        }
    }, [currentFileName]);

    // Create value lookup map
    const valueMap: Record<string, string> = {};
    if (reportData?.ReturnItemsList) {
        reportData.ReturnItemsList.forEach((item) => {
            valueMap[item.Code] = item.Value ?? "";
        });
    }

    const filteredItems = LP001_ITEM_DEFINITIONS.filter((item) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.code.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
    });

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke pb-4 dark:border-strokedark">
                <div>
                    <h2 className="text-xl font-bold text-black dark:text-white">
                        LP001 Report View - Loan Classification & Provisioning
                    </h2>
                    <p className="text-sm text-gray-500">
                        {reportData?.ReturnKey || "LOAN_CLA&PROV_LP001"} | Inst Code:{" "}
                        {reportData?.InstCode || "N/A"} | Fin Year:{" "}
                        {reportData?.FinYear || "N/A"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {availableFiles.length > 1 && (
                        <select
                            value={currentFileName}
                            onChange={(e) => setCurrentFileName(e.target.value)}
                            className="rounded border border-stroke bg-gray px-3 py-1.5 text-sm dark:border-strokedark dark:bg-meta-4"
                        >
                            {availableFiles.map((file) => (
                                <option key={file} value={file}>
                                    {file}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="flex rounded bg-gray p-1 dark:bg-meta-4">
                        <button
                            onClick={() => setViewTab("grid")}
                            className={cn(
                                "rounded px-3 py-1 text-sm font-medium transition",
                                viewTab === "grid"
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-body hover:text-primary"
                            )}
                        >
                            Excel Grid View
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "rounded px-3 py-1 text-sm font-medium transition",
                                viewTab === "json"
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-body hover:text-primary"
                            )}
                        >
                            Raw JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* Cell Formula Bar */}
            {viewTab === "grid" && selectedCell && (
                <div className="flex items-center gap-3 rounded bg-gray-2 p-2 text-sm dark:bg-meta-4">
                    <span className="font-bold text-black dark:text-white">
                        {selectedCell.cellRef}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="font-mono text-primary">
                        Code: {selectedCell.code}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="flex-1 truncate text-gray-600 dark:text-gray-300">
                        {selectedCell.colName}
                    </span>
                    <span className="font-mono font-bold text-black dark:text-white">
                        Val: {selectedCell.value}
                    </span>
                </div>
            )}

            {/* Filter Search */}
            {viewTab === "grid" && (
                <div className="flex items-center justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search items by code or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md rounded border border-stroke bg-gray px-4 py-2 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                    />
                    <span className="text-xs text-gray-500">
                        Showing {filteredItems.length} of {LP001_ITEM_DEFINITIONS.length} items
                    </span>
                </div>
            )}

            {/* Main Content View */}
            {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                    Loading LP001 report data...
                </div>
            ) : viewTab === "json" ? (
                <pre className="max-h-[600px] overflow-auto rounded bg-black/90 p-4 font-mono text-xs text-green-400">
                    {JSON.stringify(reportData, null, 2)}
                </pre>
            ) : (
                <div className="max-h-[600px] overflow-auto rounded border border-stroke dark:border-strokedark">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-gray-2 text-xs uppercase text-body dark:bg-meta-4 dark:text-bodydark">
                            <tr>
                                <th className="border-b border-stroke p-3 font-semibold dark:border-strokedark">
                                    #
                                </th>
                                <th className="border-b border-stroke p-3 font-semibold dark:border-strokedark">
                                    Code
                                </th>
                                <th className="border-b border-stroke p-3 font-semibold dark:border-strokedark">
                                    Description
                                </th>
                                <th className="border-b border-stroke p-3 text-right font-semibold dark:border-strokedark">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, idx) => {
                                const val = valueMap[item.code] ?? "";
                                const isSelected = selectedCell?.code === item.code;
                                return (
                                    <tr
                                        key={item.code}
                                        onClick={() =>
                                            setSelectedCell({
                                                cellRef: `C${16 + idx}`,
                                                code: item.code,
                                                colName: item.description,
                                                value: val
                                            })
                                        }
                                        className={cn(
                                            "cursor-pointer border-b border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4",
                                            isSelected && "bg-primary/10 dark:bg-primary/20"
                                        )}
                                    >
                                        <td className="p-3 text-xs text-gray-500">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3 font-mono text-xs font-medium text-black dark:text-white">
                                            {item.code}
                                        </td>
                                        <td className="p-3 text-gray-700 dark:text-gray-300">
                                            {item.description}
                                        </td>
                                        <td className="p-3 text-right font-mono font-bold text-black dark:text-white">
                                            {val === "" ? "-" : val}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default LP001ExcelView;
