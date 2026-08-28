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
    DynamicItems: DynamicItem[][];
}

interface DPWADP001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: any[];
    DynamicItemsList?: DynamicArea[];
}

interface DPWADP001ExcelViewProps {
    initialData?: DPWADP001JsonData;
    activeFileName?: string;
}

export function DPWADP001ExcelView({ initialData, activeFileName }: DPWADP001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<DPWADP001JsonData | undefined>(initialData);
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
        colDesc: "Deposit Type",
        rowIdx: 1,
        value: "Saving Deposit"
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=DPWADP001";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch DPWADP001 JSON view:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            fetchJsonData(activeFileName);
        }
    }, [activeFileName]);

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

    const dynamicRows = reportData?.DynamicItemsList?.[0]?.DynamicItems || [];

    // Summary calculations
    let totalDepositAmount = 0;
    let totalAccounts = 0;
    let totalRateSum = 0;
    let rateCount = 0;

    dynamicRows.forEach((row) => {
        row.forEach((item) => {
            const num = parseFloat(item.Value);
            if (!isNaN(num)) {
                if (item.Code === "1.3") totalDepositAmount += num;
                if (item.Code === "1.4") totalAccounts += num;
                if (item.Code === "1.7") {
                    totalRateSum += num;
                    rateCount++;
                }
            }
        });
    });

    const overallWeightedAvgRate = rateCount > 0 ? totalRateSum / rateCount : 0;

    const filteredRows = dynamicRows.filter((row) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return row.some((item) => item.Value.toLowerCase().includes(q) || item._description.toLowerCase().includes(q));
    });

    const headers = [
        { code: "1.1", label: "Deposit Type", colLetter: "A" },
        { code: "1.2", label: "Deposit Category", colLetter: "B" },
        { code: "1.3", label: "Total Deposit Amount (Mn Birr)", colLetter: "C" },
        { code: "1.4", label: "No. of Accounts", colLetter: "D" },
        { code: "1.5", label: "Min Rate (% p.a.)", colLetter: "E" },
        { code: "1.6", label: "Max Rate (% p.a.)", colLetter: "F" },
        { code: "1.7", label: "Weighted Avg Rate (Category)", colLetter: "G" },
        { code: "1.8", label: "Weighted Avg Rate (Type)", colLetter: "H" }
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header Toolbar & KPI Summary Cards */}
            <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                Excel Dynamic Report Viewer
                            </span>
                            <span className="rounded bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                {reportData?.ReturnKey || "DPWADP001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Monthly Weighted Average Deposit Profit Rates (Interest-Free Banks)
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution: <span className="font-semibold text-dark dark:text-white">{reportData?.InstCode || "0000001"}</span> | 
                            Financial Year: <span className="font-semibold text-dark dark:text-white">{reportData?.FinYear || 2026}</span> | 
                            Period: <span className="font-semibold text-dark dark:text-white">{reportData?.StartDate?.split("T")[0] || "2026-07-01"} to {reportData?.EndDate?.split("T")[0] || "2026-07-31"}</span>
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
                                className="rounded-lg border border-stroke bg-gray-50 px-3 py-2 text-xs font-medium text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
                            📊 Dynamic Grid
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
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Total Deposit Categories
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {dynamicRows.length} Categories
                        </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Total Deposit Amount
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(String(totalDepositAmount))} Mn Birr
                        </div>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Total Accounts
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(String(totalAccounts))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Overall Avg Profit Rate
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(String(overallWeightedAvgRate), true)}
                        </div>
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
                                Code: <span className="font-semibold text-primary">{selectedCell?.code || "-"}</span> |{" "}
                                {selectedCell ? `Row ${selectedCell.rowIdx} - ${selectedCell.colDesc}` : "Click any cell to inspect"} =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell ? selectedCell.value : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Filter deposit categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Dynamic Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">Row</th>
                                    {headers.map((h) => (
                                        <th key={h.code} className="border-r border-stroke p-2 dark:border-dark-3">
                                            {h.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, rIdx) => {
                                    const excelRowIdx = 11 + rIdx;

                                    return (
                                        <tr key={rIdx} className="border-b border-stroke hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-2/50">
                                            <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                                {excelRowIdx}
                                            </td>

                                            {headers.map((h) => {
                                                const item = row.find((i) => i.Code === h.code);
                                                const val = item ? item.Value : "";
                                                const cellRef = `${h.colLetter}${excelRowIdx}`;
                                                const isSelected = selectedCell?.cellRef === cellRef;
                                                const isNumeric = ["1.3", "1.4", "1.5", "1.6", "1.7", "1.8"].includes(h.code);

                                                return (
                                                    <td
                                                        key={h.code}
                                                        onClick={() =>
                                                            setSelectedCell({
                                                                cellRef,
                                                                code: h.code,
                                                                colDesc: h.label,
                                                                rowIdx: rIdx + 1,
                                                                value: val
                                                            })
                                                        }
                                                        className={cn(
                                                            "cursor-pointer border-r border-stroke p-2 font-mono transition dark:border-dark-3",
                                                            isNumeric ? "text-right" : "text-left",
                                                            isSelected
                                                                ? "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold text-emerald-900 dark:text-emerald-200"
                                                                : "text-gray-800 dark:text-gray-200"
                                                        )}
                                                    >
                                                        {isNumeric ? formatNum(val, ["1.5", "1.6", "1.7", "1.8"].includes(h.code)) : val || "-"}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Raw JSON Viewer Tab */
                <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-dark dark:text-white">
                            Raw JSON Payload ({dynamicRows.length} Dynamic Items)
                        </h2>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    JSON.stringify(reportData, null, 4)
                                );
                            }}
                            className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-opacity-90 transition"
                        >
                            📋 Copy JSON
                        </button>
                    </div>
                    <pre className="max-h-[600px] overflow-auto rounded-lg bg-gray-900 p-4 text-xs font-mono text-emerald-400">
                        {JSON.stringify(reportData, null, 4)}
                    </pre>
                </div>
            )}
        </div>
    );
}
