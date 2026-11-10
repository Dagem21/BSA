"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    C5001JsonData,
    C5001_CELL_MAPPING
} from "@/utils/services/5C001/jsonFormat";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface C5001ExcelViewProps {
    initialData?: C5001JsonData;
    activeFileName?: string;
}

export function C5001ExcelView({
    initialData,
    activeFileName
}: C5001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"summary" | "instruments" | "json">("summary");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<C5001JsonData | undefined>(initialData);

    const { fetchData, data, isLoading, errors } = useApiFetch(
        {
            url: "/api/report/json-view",
            method: "GET"
        },
        false
    );

    useEffect(() => {
        if (!isLoading && data) {
            setReportData(data.data);
            if (data.fileName) setCurrentFileName(data.fileName);
            if (data.availableFiles) {
                const filtered = data.availableFiles.filter(
                    (f: string) =>
                        f.toUpperCase().includes("5C001") ||
                        f.toUpperCase().includes("MCR5C001")
                );
                setAvailableFiles(filtered.length > 0 ? filtered : data.availableFiles);
            }
        } else if (!isLoading && errors.details) {
            toast.error(
                errors.details?.response?.data?.error ||
                    "Failed to fetch 5C001 JSON report"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: fileName }
            : { type: "MCR5C001" };
        fetchData({ params: query });
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
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            toast.error(err.message || "Failed to download Excel file");
        }
    };

    // Item values lookup map
    const itemsMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (reportData?.ReturnItemsList) {
            reportData.ReturnItemsList.forEach((item) => {
                map[item.Code] = item.Value ?? "";
            });
        }
        return map;
    }, [reportData]);

    const getItemVal = (code: string) => itemsMap[code] ?? "";

    const formatNumber = (val: string | number | undefined | null) => {
        if (val === undefined || val === null || val === "") return "—";
        const n = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
        if (isNaN(n)) return String(val);
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(n);
    };

    // Area 202 Dynamic items
    const area202Entries = useMemo(() => {
        if (!reportData?.DynamicItemsList) return [];
        return reportData.DynamicItemsList.filter((entry) => entry.Area === 202);
    }, [reportData]);

    const filterText = searchQuery.toLowerCase().trim();

    // Summary Items Breakdown
    const summaryRows = useMemo(() => {
        return [
            { id: "Row 14 (B)", label: "Total Commodity Instruments — Gross Long", code: "171_00009", highlight: false },
            { id: "Row 14 (C)", label: "Total Commodity Instruments — Gross Short", code: "171_00010", highlight: false },
            { id: "Row 14 (D)", label: "Total Commodity Instruments — Gross Commodity Position", code: "171_00001", highlight: false },
            { id: "Row 14 (E)", label: "Total Commodity Instruments — Positive Net Open Position", code: "171_00002", highlight: false },
            { id: "Row 14 (F)", label: "Total Commodity Instruments — 15% of Net Open Position", code: "171_00003", highlight: false },
            { id: "Row 14 (G)", label: "Total Commodity Instruments — 3% of Gross Open Position", code: "171_00004", highlight: false },
            { id: "Row 15", label: "1. Capital Required Against Directional Risks (Sum of F)", code: "171_00005", highlight: false },
            { id: "Row 16", label: "2. Capital Required Against Basis, Interest Rate & Forward Gap Risks (Sum of G)", code: "171_00006", highlight: false },
            { id: "Row 17", label: "3. Total Capital Requirement Against Commodity Position Risk (Sum of Row 1 + Row 2)", code: "171_00007", highlight: true },
            { id: "Row 18", label: "Commodity Position Risk Equivalent Assets (Total Capital Requirement (Row 3) * 9.1)", code: "171_00008", highlight: true }
        ];
    }, []);

    const totalCapitalReq = getItemVal("171_00007");
    const riskEquivAssets = getItemVal("171_00008");
    const directionalRisk = getItemVal("171_00005");
    const basisGapRisk = getItemVal("171_00006");

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-4 sm:p-6 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-amber-600 via-yellow-600 to-lime-600 rounded-xl text-white shadow-lg shadow-amber-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Capital Requirement for Market Commodity Risk (5C001)
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {reportData?.ReturnKey || "MCR5C001"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Simplified Approach for Commodity Position Risk • Financial Supervisory Return
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* File Dropdown Selector */}
                    {availableFiles.length > 0 && (
                        <select
                            value={currentFileName}
                            onChange={(e) => {
                                setCurrentFileName(e.target.value);
                                fetchJsonData(e.target.value);
                            }}
                            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                            {availableFiles.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Export Excel Button */}
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Metadata Summary Banner & KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Institution Code</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.InstCode || "—"}</span>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Financial Year</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.FinYear ?? "—"}</span>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Period Start</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.StartDate ? reportData.StartDate.split("T")[0] : "—"}</span>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Period End</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.EndDate ? reportData.EndDate.split("T")[0] : "—"}</span>
                </div>
                <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-800/50 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Total Capital Req.</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">{formatNumber(totalCapitalReq)}</span>
                </div>
                <div className="bg-gradient-to-br from-lime-950/60 to-slate-900 border border-lime-800/50 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-lime-400 uppercase tracking-wider">Risk Equivalent RWA</span>
                    <span className="text-sm font-bold text-white font-mono">{formatNumber(riskEquivAssets)}</span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
                <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setViewTab("summary")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "summary"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Capital Requirement Summary
                    </button>
                    <button
                        onClick={() => setViewTab("instruments")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "instruments"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Commodity Instruments ({area202Entries.length})
                    </button>
                    <button
                        onClick={() => setViewTab("json")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "json"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Raw JSON
                    </button>
                </div>

                {/* Filter Search Input */}
                {viewTab !== "json" && (
                    <div className="relative w-full sm:w-72">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter by description or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-400 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>
                )}
            </div>

            {/* TAB CONTENTS */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400 mt-3">Loading 5C001 report data...</span>
                </div>
            ) : viewTab === "json" ? (
                /* RAW JSON VIEW */
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                            Payload contains {reportData?.ReturnItemsList?.length || 0} ReturnItems and {area202Entries.length} Area 202 Dynamic entries
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
                                toast.success("JSON copied to clipboard");
                            }}
                            className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                        >
                            Copy JSON
                        </button>
                    </div>
                    <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-[650px] p-3 leading-relaxed bg-black/40 rounded-xl border border-slate-900">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            ) : viewTab === "instruments" ? (
                /* COMMODITY INSTRUMENTS AREA 202 TABLE */
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Area 202: Commodity Position Instruments Breakdown
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Showing individual positions across commodity categories (converted into domestic currency)
                            </p>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                            {area202Entries.length} items recorded
                        </span>
                    </div>

                    <div className="overflow-x-auto max-h-[720px]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="sticky top-0 z-10 bg-slate-800/95 text-slate-300 font-semibold border-b border-slate-700/80 shadow-sm backdrop-blur-sm">
                                <tr>
                                    <th className="py-3 px-3 w-16">#</th>
                                    <th className="py-3 px-4 min-w-[240px]">Commodity Instruments</th>
                                    <th className="py-3 px-3 w-32 text-right">Gross Long (A)</th>
                                    <th className="py-3 px-3 w-32 text-right">Gross Short (B)</th>
                                    <th className="py-3 px-3 w-32 text-right">Gross Position (C=A+B)</th>
                                    <th className="py-3 px-3 w-32 text-right">Net Open (D=|A-B|)</th>
                                    <th className="py-3 px-3 w-32 text-right">15% Net Open (E)</th>
                                    <th className="py-3 px-3 w-32 text-right">3% Gross Open (F)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {area202Entries.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-500">
                                            No commodity instruments entered. Upload an Excel file with positions in rows 23–122.
                                        </td>
                                    </tr>
                                ) : (
                                    area202Entries
                                        .filter((entry) => {
                                            if (!filterText) return true;
                                            const subMap: Record<string, string> = {};
                                            entry.DynamicItems?.forEach((item) => {
                                                subMap[item.Code] = item.Value;
                                            });
                                            return (subMap["1.1"] || "").toLowerCase().includes(filterText);
                                        })
                                        .map((entry, idx) => {
                                            const subMap: Record<string, string> = {};
                                            entry.DynamicItems?.forEach((item) => {
                                                subMap[item.Code] = item.Value;
                                            });

                                            return (
                                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-2.5 px-3 font-mono text-amber-400">{idx + 1}</td>
                                                    <td className="py-2.5 px-4 font-semibold text-slate-200">{subMap["1.1"] || `Commodity ${idx + 1}`}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.2"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.3"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-200 font-medium">{formatNumber(subMap["1.4"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-200 font-medium">{formatNumber(subMap["1.5"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-amber-400">{formatNumber(subMap["1.6"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-lime-400">{formatNumber(subMap["1.7"])}</td>
                                                </tr>
                                            );
                                        })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* SUMMARY TAB */
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-800/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Total Capital Requirement</span>
                                <h2 className="text-3xl font-extrabold text-amber-300 font-mono mt-1">
                                    {formatNumber(totalCapitalReq)}
                                </h2>
                                <p className="text-xs text-slate-400 mt-2">
                                    Directional Risk ({formatNumber(directionalRisk)}) + Basis & Forward Gap Risk ({formatNumber(basisGapRisk)}).
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                <span>Code: <code className="text-amber-400 font-mono">171_00007</code></span>
                                <span>Formula: <code className="text-slate-300">Row 1 + Row 2</code></span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-lime-950/40 via-slate-900 to-slate-950 border border-lime-800/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-medium text-lime-400 uppercase tracking-wider">Commodity Position Risk Equivalent Assets</span>
                                <h2 className="text-3xl font-extrabold text-lime-300 font-mono mt-1">
                                    {formatNumber(riskEquivAssets)}
                                </h2>
                                <p className="text-xs text-slate-400 mt-2">
                                    Total Capital Requirement multiplied by 9.1 (reciprocal of supervisory capital ratio).
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                <span>Code: <code className="text-lime-400 font-mono">171_00008</code></span>
                                <span>Formula: <code className="text-slate-300">Row 3 * 9.1</code></span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                Capital Requirement Against Commodity Position Risk Breakdown
                            </h3>
                            <span className="text-xs text-slate-400">Amounts in Millions of ETB</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700/80">
                                        <th className="py-3 px-4 w-28">Excel Ref</th>
                                        <th className="py-3 px-4">Item Description</th>
                                        <th className="py-3 px-4 w-32 font-mono">Code</th>
                                        <th className="py-3 px-4 w-44 text-right">Value (Millions ETB)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {summaryRows
                                        .filter((s) => !filterText || s.label.toLowerCase().includes(filterText) || s.code.includes(filterText))
                                        .map((item) => {
                                            const val = getItemVal(item.code);
                                            return (
                                                <tr
                                                    key={item.code}
                                                    className={cn(
                                                        "hover:bg-slate-800/40 transition-colors",
                                                        item.highlight && "bg-amber-950/20 font-semibold"
                                                    )}
                                                >
                                                    <td className="py-3 px-4 font-mono text-amber-400">{item.id}</td>
                                                    <td className={cn("py-3 px-4", item.highlight ? "text-white" : "text-slate-300")}>
                                                        {item.label}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono text-slate-400">{item.code}</td>
                                                    <td className={cn("py-3 px-4 text-right font-mono", item.highlight ? "text-amber-300 font-bold text-sm" : "text-slate-200")}>
                                                        {formatNumber(val)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default C5001ExcelView;
