"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DynamicItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface DynamicArea {
    Area: number;
    _areaName: string;
    DynamicItems: DynamicItem[];
}

interface MWAC001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: any[];
    DynamicItemsList?: DynamicArea[];
}

interface MWAC001ExcelViewProps {
    initialData?: MWAC001JsonData;
    activeFileName?: string;
}

export function MWAC001ExcelView({ initialData, activeFileName }: MWAC001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<MWAC001JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        colDesc: string;
        rowIdx: number;
        value: string;
    } | null>({
        cellRef: "A11",
        code: "1.1",
        colDesc: "Sector",
        rowIdx: 1,
        value: ""
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=MWAC001";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch MWAC001 JSON view:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            fetchJsonData(activeFileName);
        }
    }, [activeFileName]);

    const handleDownloadExcel = async () => {
        if (!currentFileName) return;
        const excelName = currentFileName.endsWith(".json")
            ? currentFileName.replace(/\.json$/, ".xlsx")
            : currentFileName;
        try {
            const res = await fetch(`/api/report/download?filename=${encodeURIComponent(excelName)}`);
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
            console.error("Failed to download Excel file:", err);
        }
    };

    const formatNum = (valStr: string, isPercent: boolean = false) => {
        if (valStr === undefined || valStr === null || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        const formatted = num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return isPercent ? `${formatted}%` : formatted;
    };

    // The data is a flattened array of codes. Every 8 items make up one row.
    const flatItems = reportData?.DynamicItemsList?.[0]?.DynamicItems || [];
    const rowsCount = Math.floor(flatItems.length / 8);
    const dynamicRows: DynamicItem[][] = [];

    for (let i = 0; i < rowsCount; i++) {
        dynamicRows.push(flatItems.slice(i * 8, i * 8 + 8));
    }

    // Summary calculations
    let totalOutstanding = 0;
    let totalAccounts = 0;
    let minRateSum = 0;
    let minRateCount = 0;
    let maxRateSum = 0;
    let maxRateCount = 0;
    let weightedRateSum = 0;
    let weightedRateCount = 0;

    dynamicRows.forEach((row) => {
        row.forEach((item) => {
            const num = parseFloat(item.Value);
            if (!isNaN(num) && num !== 0) {
                if (item.Code.endsWith(".3")) totalOutstanding += num;
                if (item.Code.endsWith(".4")) totalAccounts += num;
                if (item.Code.endsWith(".5")) {
                    minRateSum += num;
                    minRateCount++;
                }
                if (item.Code.endsWith(".6")) {
                    maxRateSum += num;
                    maxRateCount++;
                }
                if (item.Code.endsWith(".7")) {
                    weightedRateSum += num;
                    weightedRateCount++;
                }
            }
        });
    });

    const avgMinRate = minRateCount > 0 ? minRateSum / minRateCount : 0;
    const avgMaxRate = maxRateCount > 0 ? maxRateSum / maxRateCount : 0;
    const avgWeightedRate = weightedRateCount > 0 ? weightedRateSum / weightedRateCount : 0;

    const filteredRows = dynamicRows.filter((row) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return row.some(
            (item) =>
                item.Value.toLowerCase().includes(q) ||
                item._description.toLowerCase().includes(q) ||
                item.Code.toLowerCase().includes(q)
        );
    });

    const headers = [
        { code: "1.1", label: "Sector", colLetter: "A" },
        { code: "1.2", label: "Loan Category", colLetter: "B" },
        { code: "1.3", label: "Outstanding Loan (Mn Birr)", colLetter: "C" },
        { code: "1.4", label: "No. of Loan Accounts", colLetter: "D" },
        { code: "1.5", label: "Min Rate (% p.a.)", colLetter: "E" },
        { code: "1.6", label: "Max Rate (% p.a.)", colLetter: "F" },
        { code: "1.7", label: "Weighted Rate (Category)", colLetter: "G" },
        { code: "1.8", label: "Weighted Rate (Sector)", colLetter: "H" }
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header Toolbar */}
            <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                                XL
                            </span>
                            <h2 className="text-xl font-bold text-dark dark:text-white">
                                {reportData?.ReturnKey || "LCMWAC001"} Report Grid View
                            </h2>
                        </div>
                        <p className="mt-1 text-sm text-body-color dark:text-dark-6">
                            Monthly Weighted Average Lending Interest Rates (Conventional Banks) - Area 213
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Tab Selector */}
                        <div className="inline-flex rounded-lg border border-stroke bg-gray-2 p-1 dark:border-dark-3 dark:bg-dark-2">
                            <button
                                onClick={() => setViewTab("grid")}
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                                    viewTab === "grid"
                                        ? "bg-white text-dark shadow-1 dark:bg-gray-dark dark:text-white"
                                        : "text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
                                )}
                            >
                                📊 Grid View
                            </button>
                            <button
                                onClick={() => setViewTab("json")}
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                                    viewTab === "json"
                                        ? "bg-white text-dark shadow-1 dark:bg-gray-dark dark:text-white"
                                        : "text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
                                )}
                            >
                                <span>{"{ }"}</span> JSON Source
                            </button>
                        </div>

                        {/* File Switcher Dropdown */}
                        {availableFiles.length > 0 && (
                            <select
                                value={currentFileName}
                                onChange={(e) => {
                                    setCurrentFileName(e.target.value);
                                    fetchJsonData(e.target.value);
                                }}
                                className="rounded-lg border border-stroke bg-white px-3 py-1.5 text-xs font-medium text-dark outline-none focus:border-teal-500 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            >
                                {availableFiles.map((file) => (
                                    <option key={file} value={file}>
                                        📄 {file}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Download Excel Button */}
                        <button
                            onClick={handleDownloadExcel}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-teal-700 shadow-sm"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                            </svg>
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* Metadata Cards Header */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 border-t border-stroke pt-4 dark:border-dark-3">
                    <div className="rounded-md bg-gray-2 p-3 dark:bg-dark-2">
                        <span className="text-[11px] font-medium text-body-color dark:text-dark-6">Return Key</span>
                        <p className="text-sm font-semibold text-dark dark:text-white mt-0.5">
                            {reportData?.ReturnKey || "LCMWAC001"}
                        </p>
                    </div>
                    <div className="rounded-md bg-gray-2 p-3 dark:bg-dark-2">
                        <span className="text-[11px] font-medium text-body-color dark:text-dark-6">Inst. Code</span>
                        <p className="text-sm font-semibold text-dark dark:text-white mt-0.5">
                            {reportData?.InstCode || "0000001"}
                        </p>
                    </div>
                    <div className="rounded-md bg-gray-2 p-3 dark:bg-dark-2">
                        <span className="text-[11px] font-medium text-body-color dark:text-dark-6">Financial Year</span>
                        <p className="text-sm font-semibold text-dark dark:text-white mt-0.5">
                            {reportData?.FinYear || 2026}
                        </p>
                    </div>
                    <div className="rounded-md bg-gray-2 p-3 dark:bg-dark-2">
                        <span className="text-[11px] font-medium text-body-color dark:text-dark-6">Start Date</span>
                        <p className="text-sm font-semibold text-dark dark:text-white mt-0.5">
                            {reportData?.StartDate?.split("T")[0] || "2026-08-01"}
                        </p>
                    </div>
                    <div className="rounded-md bg-gray-2 p-3 dark:bg-dark-2">
                        <span className="text-[11px] font-medium text-body-color dark:text-dark-6">End Date</span>
                        <p className="text-sm font-semibold text-dark dark:text-white mt-0.5">
                            {reportData?.EndDate?.split("T")[0] || "2026-08-31"}
                        </p>
                    </div>
                    <div className="rounded-md bg-gray-2 p-3 dark:bg-dark-2">
                        <span className="text-[11px] font-medium text-body-color dark:text-dark-6">Total Rows</span>
                        <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                            {rowsCount} Rows
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <span className="text-xs font-semibold text-body-color dark:text-dark-6">Total Outstanding Loan</span>
                    <p className="mt-2 text-xl font-extrabold text-teal-600 dark:text-teal-400">
                        {formatNum(totalOutstanding.toString())} <span className="text-xs font-normal text-body-color">Mn ETB</span>
                    </p>
                </div>
                <div className="rounded-xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <span className="text-xs font-semibold text-body-color dark:text-dark-6">Total Loan Accounts</span>
                    <p className="mt-2 text-xl font-extrabold text-blue-600 dark:text-blue-400">
                        {totalAccounts.toLocaleString()} <span className="text-xs font-normal text-body-color">Accounts</span>
                    </p>
                </div>
                <div className="rounded-xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <span className="text-xs font-semibold text-body-color dark:text-dark-6">Avg Min Interest Rate</span>
                    <p className="mt-2 text-xl font-extrabold text-amber-600 dark:text-amber-400">
                        {formatNum(avgMinRate.toString(), true)}
                    </p>
                </div>
                <div className="rounded-xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <span className="text-xs font-semibold text-body-color dark:text-dark-6">Avg Max Interest Rate</span>
                    <p className="mt-2 text-xl font-extrabold text-purple-600 dark:text-purple-400">
                        {formatNum(avgMaxRate.toString(), true)}
                    </p>
                </div>
                <div className="rounded-xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <span className="text-xs font-semibold text-body-color dark:text-dark-6">Avg Weighted Rate</span>
                    <p className="mt-2 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatNum(avgWeightedRate.toString(), true)}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            {viewTab === "json" ? (
                <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-dark dark:text-white">
                            JSON Output Specification
                        </h3>
                        <span className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-full font-mono">
                            JSON Schema Format
                        </span>
                    </div>
                    <pre className="max-h-[600px] overflow-auto rounded-lg bg-gray-900 p-4 text-xs font-mono text-emerald-400">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            ) : (
                <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    {/* Formula Bar Simulation */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 p-2.5 bg-gray-2 dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
                        <div className="flex items-center gap-2 min-w-[120px] bg-white dark:bg-gray-dark px-3 py-1.5 rounded border border-stroke dark:border-dark-3">
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Cell:</span>
                            <span className="text-xs font-mono font-semibold text-dark dark:text-white">
                                {selectedCell?.cellRef || "A11"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-[140px] bg-white dark:bg-gray-dark px-3 py-1.5 rounded border border-stroke dark:border-dark-3">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Code:</span>
                            <span className="text-xs font-mono font-semibold text-dark dark:text-white">
                                {selectedCell?.code || "1.1"}
                            </span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-dark px-3 py-1.5 rounded border border-stroke dark:border-dark-3 overflow-hidden">
                            <span className="text-xs font-bold text-gray-500">fx:</span>
                            <span className="text-xs font-mono text-dark dark:text-white truncate">
                                {selectedCell?.value || "(Select cell)"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="🔍 Search sector, category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 rounded-lg border border-stroke bg-white px-3 py-1.5 text-xs text-dark outline-none focus:border-teal-500 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Excel Grid Table */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-teal-700 text-white font-semibold">
                                    <th className="border-r border-teal-600 px-3 py-2 text-center w-12 bg-teal-800">
                                        #
                                    </th>
                                    {headers.map((h) => (
                                        <th
                                            key={h.code}
                                            className="border-r border-teal-600 px-3 py-2.5 text-center min-w-[140px]"
                                        >
                                            <div className="text-[10px] text-teal-200 uppercase tracking-wider font-mono">
                                                Col {h.colLetter} ({h.code})
                                            </div>
                                            <div className="text-xs mt-0.5">{h.label}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-body-color">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                                                <span>Loading MWAC001 report data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-body-color">
                                            No MWAC001 rows found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRows.map((rowItems, rIdx) => {
                                        const actualRowIndex = rIdx + 11; // Row 11 is start in template
                                        return (
                                            <tr
                                                key={rIdx}
                                                className={cn(
                                                    "border-b border-stroke transition-colors dark:border-dark-3 hover:bg-teal-50/50 dark:hover:bg-teal-950/20",
                                                    rIdx % 2 === 0 ? "bg-white dark:bg-gray-dark" : "bg-gray-2/50 dark:bg-dark-2/50"
                                                )}
                                            >
                                                {/* Row Header Number */}
                                                <td className="border-r border-stroke bg-gray-2 px-2 py-2 text-center font-mono text-[11px] font-bold text-gray-500 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
                                                    {actualRowIndex}
                                                </td>

                                                {/* 8 Items */}
                                                {rowItems.map((item, cIdx) => {
                                                    const colLetter = String.fromCharCode(65 + cIdx); // A, B, C...
                                                    const cellRef = `${colLetter}${actualRowIndex}`;
                                                    const isSelected = selectedCell?.cellRef === cellRef;
                                                    const isNumericCol = cIdx >= 2;
                                                    const isPercentCol = cIdx >= 4;

                                                    return (
                                                        <td
                                                            key={item.Code}
                                                            onClick={() =>
                                                                setSelectedCell({
                                                                    cellRef,
                                                                    code: item.Code,
                                                                    colDesc: item._description,
                                                                    rowIdx: actualRowIndex,
                                                                    value: item.Value
                                                                })
                                                            }
                                                            className={cn(
                                                                "border-r border-stroke px-3 py-2 text-xs font-mono transition-all cursor-pointer dark:border-dark-3",
                                                                isNumericCol ? "text-right" : "text-left font-sans font-medium",
                                                                isSelected
                                                                    ? "bg-teal-100/80 ring-2 ring-teal-500 font-bold dark:bg-teal-900/50"
                                                                    : ""
                                                            )}
                                                        >
                                                            {isNumericCol
                                                                ? formatNum(item.Value, isPercentCol)
                                                                : item.Value || "-"}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
