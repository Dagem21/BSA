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

interface GS001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface GS001ExcelViewProps {
    initialData?: GS001JsonData;
    activeFileName?: string;
}

export function GS001ExcelView({
    initialData,
    activeFileName
}: GS001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<GS001JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        colSuffix: string;
        value: string;
    } | null>({
        cellRef: "C14",
        code: "163_00001",
        rowDesc: "Demand",
        colSuffix: "Deposit Amount",
        value: "0"
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
                    "Failed to fetch GS001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "GS001" };
        fetchData({ params: query });
    };

    useEffect(() => {
        if (!initialData) {
            fetchJsonData(activeFileName);
        }
    }, [activeFileName]);

    const handleDownloadExcel = async () => {
        try {
            if (currentFileName) {
                const excelName = currentFileName.endsWith(".json")
                    ? currentFileName.replace(/\.json$/, ".xlsx")
                    : currentFileName;
                const res = await fetch(
                    `/api/report/download?filename=${encodeURIComponent(excelName)}`
                );
                if (res.ok) {
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = excelName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    return;
                }
            }

            if (reportData) {
                const res = await fetch(`/api/report/download`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reportData)
                });
                if (!res.ok) throw new Error("Download failed");
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${reportData.ReturnKey || "GS001"}_export.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error("Failed to download Excel file:", err);
        }
    };

    const returnItemsMap: Record<string, string> = {};
    if (reportData?.ReturnItemsList) {
        reportData.ReturnItemsList.forEach((item) => {
            returnItemsMap[item.Code] = item.Value;
        });
    }

    const getItemValue = (codeStr: string): string => {
        if (returnItemsMap[codeStr] !== undefined) {
            return returnItemsMap[codeStr];
        }
        return "0";
    };

    const formatNum = (valStr: string, isInteger: boolean = false) => {
        if (!valStr || valStr === "0" || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: isInteger ? 0 : 2,
            maximumFractionDigits: isInteger ? 0 : 2
        });
    };

    const categories = [
        {
            name: "Demand",
            excelRow: 14,
            items: [
                { code: "163_00001", suffix: "Deposit Amount", isInteger: false, cellRef: "C14" },
                { code: "163_00002", suffix: "# of depositors accounts", isInteger: true, cellRef: "D14" },
                { code: "163_00003", suffix: "# of depositors", isInteger: true, cellRef: "E14" }
            ]
        },
        {
            name: "Saving",
            excelRow: 15,
            items: [
                { code: "163_00004", suffix: "Deposit Amount", isInteger: false, cellRef: "C15" },
                { code: "163_00005", suffix: "# of Depositors accounts", isInteger: true, cellRef: "D15" },
                { code: "163_00006", suffix: "# of Depositors", isInteger: true, cellRef: "E15" }
            ]
        },
        {
            name: "Time",
            excelRow: 16,
            items: [
                { code: "163_00007", suffix: "Deposit Amount", isInteger: false, cellRef: "C16" },
                { code: "163_00008", suffix: "# of Depositors accounts", isInteger: true, cellRef: "D16" },
                { code: "163_00009", suffix: "# of Depositors", isInteger: true, cellRef: "E16" }
            ]
        },
        {
            name: "Total",
            excelRow: 17,
            items: [
                { code: "163_00010", suffix: "Deposit Amount", isInteger: false, cellRef: "C17" },
                { code: "163_00011", suffix: "# of Depositors accounts", isInteger: true, cellRef: "D17" },
                { code: "163_00012", suffix: "# of Depositors", isInteger: true, cellRef: "E17" }
            ]
        }
    ];

    // Summary Metric values
    const totalDepositAmount = getItemValue("163_00010");
    const totalAccountsCount = getItemValue("163_00011");
    const totalDepositorsCount = getItemValue("163_00012");
    const savingDepositAmount = getItemValue("163_00004");

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header Toolbar & KPI Summary Cards */}
            <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                Excel Report Viewer
                            </span>
                            <span className="rounded bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                {reportData?.ReturnKey || "Digital SavingGS001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Digital Saving Report (GS001)
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.InstCode || "0000001"}
                            </span>{" "}
                            | Financial Year:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.FinYear || 2026}
                            </span>{" "}
                            | Period:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.StartDate?.split("T")[0] ||
                                    "2026-04-01"}{" "}
                                to{" "}
                                {reportData?.EndDate?.split("T")[0] ||
                                    "2026-06-30"}
                            </span>
                        </p>
                    </div>

                    {/* File Selector & Mode Switcher */}
                    <div className="flex flex-wrap items-center gap-3">
                        {availableFiles.length > 0 && (
                            <select
                                value={currentFileName}
                                onChange={(e) => {
                                    setCurrentFileName(e.target.value);
                                    fetchJsonData(e.target.value);
                                }}
                                className="rounded-lg border border-stroke bg-gray-50 px-3 py-2 text-xs font-medium text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            >
                                {availableFiles.map((fn) => (
                                    <option key={fn} value={fn}>
                                        📄 {fn}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={() => setViewTab("grid")}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                                viewTab === "grid"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                            )}
                        >
                            📊 Excel Spreadsheet
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                                viewTab === "json"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                            )}
                        >
                            {`{ }`} Raw JSON
                        </button>

                        <button
                            onClick={handleDownloadExcel}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                            ⬇️ Download Excel
                        </button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
                        <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                            Total Deposit Amount
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalDepositAmount)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Total (Row 4, Col 1)
                        </span>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                            Total Depositor Accounts
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalAccountsCount, true)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Total (Row 4, Col 2)
                        </span>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                            Total Depositors
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalDepositorsCount, true)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Total (Row 4, Col 3)
                        </span>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/30">
                        <span className="text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                            Saving Deposit Amount
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(savingDepositAmount)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Saving (Row 2, Col 1)
                        </span>
                    </div>
                </div>
            </div>

            {viewTab === "grid" ? (
                <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    {/* Excel Formula Bar & Search Filter */}
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 items-center gap-2 rounded-md border border-stroke bg-gray-50 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-2">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {selectedCell ? selectedCell.cellRef : "Cell"}
                            </span>
                            <span className="text-gray-400">fx</span>
                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                Code:{" "}
                                <span className="font-semibold text-primary">
                                    {selectedCell?.code || "-"}
                                </span>{" "}
                                |{" "}
                                {selectedCell
                                    ? `${selectedCell.rowDesc} - ${selectedCell.colSuffix}`
                                    : "Click any cell to inspect"}{" "}
                                =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell
                                    ? formatNum(selectedCell.value)
                                    : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Search deposit types..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Excel Spreadsheet Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-100 text-center font-mono text-[11px] font-semibold text-gray-600 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300">
                                    <th className="w-10 border-r border-stroke py-1.5 dark:border-dark-3"></th>
                                    <th className="w-16 border-r border-stroke py-1.5 dark:border-dark-3">
                                        B
                                    </th>
                                    <th className="min-w-[200px] border-r border-stroke py-1.5 dark:border-dark-3">
                                        C
                                    </th>
                                    <th className="min-w-[200px] border-r border-stroke py-1.5 dark:border-dark-3">
                                        D
                                    </th>
                                    <th className="min-w-[200px] border-r border-stroke py-1.5 dark:border-dark-3">
                                        E
                                    </th>
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        #
                                    </th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">
                                        Deposit Type
                                    </th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">
                                        Deposit Amount
                                    </th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">
                                        # of depositors accounts
                                    </th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">
                                        # of depositors
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((cat, idx) => (
                                    <tr
                                        key={cat.name}
                                        className={cn(
                                            "border-b border-stroke transition dark:border-dark-3",
                                            cat.name === "Total"
                                                ? "bg-emerald-500/10 font-bold text-dark dark:bg-emerald-500/20 dark:text-white"
                                                : "hover:bg-gray-50 dark:hover:bg-dark-2/50"
                                        )}
                                    >
                                        <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                            {cat.excelRow}
                                        </td>

                                        <td className="border-r border-stroke p-2 font-medium text-dark dark:border-dark-3 dark:text-white">
                                            {cat.name}
                                        </td>

                                        {cat.items.map((item) => {
                                            const val = getItemValue(item.code);
                                            const isSelected =
                                                selectedCell?.code === item.code;

                                            return (
                                                <td
                                                    key={item.code}
                                                    onClick={() =>
                                                        setSelectedCell({
                                                            cellRef: item.cellRef,
                                                            code: item.code,
                                                            rowDesc: cat.name,
                                                            colSuffix: item.suffix,
                                                            value: val
                                                        })
                                                    }
                                                    className={cn(
                                                        "cursor-pointer border-r border-stroke p-2 text-right font-mono transition dark:border-dark-3",
                                                        isSelected
                                                            ? "bg-emerald-500/20 font-bold text-emerald-900 ring-2 ring-emerald-500 ring-inset dark:text-emerald-200"
                                                            : "text-gray-800 dark:text-gray-200"
                                                    )}
                                                >
                                                    {formatNum(val, item.isInteger)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Raw JSON Viewer Tab */
                <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-dark dark:text-white">
                            Raw JSON Payload (
                            {reportData?.ReturnItemsList?.length || 12} items)
                        </h2>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    JSON.stringify(reportData, null, 4)
                                );
                            }}
                            className="hover:bg-opacity-90 rounded bg-primary px-3 py-1.5 text-xs font-medium text-white transition"
                        >
                            📋 Copy JSON
                        </button>
                    </div>
                    <pre className="max-h-[600px] overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-emerald-400">
                        {JSON.stringify(reportData, null, 4)}
                    </pre>
                </div>
            )}
        </div>
    );
}
