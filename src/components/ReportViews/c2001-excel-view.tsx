"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    C2001JsonData,
    C2001_CELL_MAPPING
} from "@/utils/services/2C001/jsonFormat";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface C2001ExcelViewProps {
    initialData?: C2001JsonData;
    activeFileName?: string;
}

export function C2001ExcelView({
    initialData,
    activeFileName
}: C2001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<
        "summary" | "on-balance" | "off-balance" | "derivatives" | "sft" | "json"
    >("summary");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<C2001JsonData | undefined>(initialData);

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
                        f.toUpperCase().includes("2C001") ||
                        f.toUpperCase().includes("QCR2C001")
                );
                setAvailableFiles(filtered.length > 0 ? filtered : data.availableFiles);
            }
        } else if (!isLoading && errors.details) {
            toast.error(
                errors.details?.response?.data?.error ||
                    "Failed to fetch 2C001 JSON report"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: fileName }
            : { type: "QCR2C001" };
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

    // Value lookup map for ReturnItemsList
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

    // Pre-calculate structured rows from C2001_CELL_MAPPING
    const structuredRows = useMemo(() => {
        const rowMap = new Map<number, { row: number; desc: string; cols: Record<string, string> }>();
        for (const m of C2001_CELL_MAPPING) {
            if (!rowMap.has(m.row)) {
                const baseDesc = m.desc.split("_")[0];
                rowMap.set(m.row, { row: m.row, desc: baseDesc, cols: {} });
            }
            rowMap.get(m.row)!.cols[m.col] = m.code;
        }
        return rowMap;
    }, []);

    // 2.1 On-balance sheet items (rows 18 to 111)
    const onBalanceRows = useMemo(() => {
        const rows = [];
        for (let r = 18; r <= 111; r++) {
            const rowData = structuredRows.get(r);
            if (rowData) rows.push(rowData);
        }
        return rows;
    }, [structuredRows]);

    // 2.3 OTC Derivatives items (rows 240 to 265)
    const derivativesRows = useMemo(() => {
        const rows = [];
        for (let r = 240; r <= 265; r++) {
            const rowData = structuredRows.get(r);
            if (rowData) rows.push(rowData);
        }
        return rows;
    }, [structuredRows]);

    // 2.5 Total Credit Risk Summary items (rows 297 to 305)
    const summaryRows = useMemo(() => {
        const list = [
            { id: "A", row: 297, label: "Total Risk Weighted Assets for Credit Risk (=B+C)", code: "168_00706", highlight: true },
            { id: "B", row: 298, label: "TOTAL On-balance Sheet Credit Risk RWA", code: "168_00707", highlight: false },
            { id: "C", row: 299, label: "TOTAL Off-balance Sheet Credit Risk RWA (=C.1+C.2+C.3)", code: "168_00708", highlight: false },
            { id: "C.1", row: 300, label: "Total Off-balance Sheet (Non-Derivatives and SFT) Credit RWA", code: "168_00709", highlight: false },
            { id: "C.2", row: 301, label: "Total Off-balance Sheet OTC Derivatives Credit RWA", code: "168_00710", highlight: false },
            { id: "C.3", row: 302, label: "Total Off-balance Sheet SFT Credit Risk RWA", code: "168_00711", highlight: false },
            { id: "D", row: 303, label: "Total Capital For Credit Risk (=E+F)", code: "168_00712", highlight: true },
            { id: "E", row: 304, label: "Total On-balance Sheet Credit Risk Capital (=B*11%)", code: "168_00713", highlight: false },
            { id: "F", row: 305, label: "Total Off-balance Sheet Credit Risk Capital (=C*11%)", code: "168_00714", highlight: false }
        ];
        return list;
    }, []);

    // 2.2 Off-balance sheet CCF categories
    const ccfCategories = useMemo(() => {
        return [
            { catNum: 1, ccf: "10%", title: "Commitments unconditionally cancellable without notice (CCF 10%)", summaryCode: "168_00715" },
            { catNum: 2, ccf: "20%", title: "Short-term self-liquidating trade letters of credit (CCF 20%)", summaryCode: "168_00716" },
            { catNum: 3, ccf: "40%", title: "Commitments regardless of maturity (CCF 40%)", summaryCode: "168_00717" },
            { catNum: 4, ccf: "50%", title: "Transaction-related contingent items, performance bonds, warranties (CCF 50%)", summaryCode: "168_00718" },
            { catNum: 5, ccf: "50%", title: "Note issuance facilities (NIFs) & revolving underwriting facilities (RUFs) (CCF 50%)", summaryCode: "168_00719" },
            { catNum: 6, ccf: "100%", title: "Direct credit substitutes & general guarantees of indebtedness (CCF 100%)", summaryCode: "168_00720" },
            { catNum: 7, ccf: "100%", title: "Sale & repurchase agreements with recourse (CCF 100%)", summaryCode: "168_00721" },
            { catNum: 8, ccf: "100%", title: "Lending of securities or collateral posting by banks (CCF 100%)", summaryCode: "168_00722" },
            { catNum: 9, ccf: "100%", title: "Forward asset purchases, forward deposits & partly paid shares (CCF 100%)", summaryCode: "168_00723" },
            { catNum: 10, ccf: "100%", title: "Other off-balance sheet credit substitutes (CCF 100%)", summaryCode: "168_00724" }
        ];
    }, []);

    // Area 200 Dynamic Items
    const area200Items = useMemo(() => {
        if (!reportData?.DynamicItemsList) return [];
        return reportData.DynamicItemsList.filter((entry) => entry.Area === 200);
    }, [reportData]);

    // Area 201 Dynamic Items (SFT)
    const area201Items = useMemo(() => {
        if (!reportData?.DynamicItemsList) return [];
        return reportData.DynamicItemsList.filter((entry) => entry.Area === 201);
    }, [reportData]);

    const totalRWA = getItemVal("168_00706");
    const totalCapital = getItemVal("168_00712");
    const onBalanceRWA = getItemVal("168_00707");
    const offBalanceRWA = getItemVal("168_00708");

    const filterText = searchQuery.toLowerCase().trim();

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-4 sm:p-6 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 rounded-xl text-white shadow-lg shadow-teal-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Capital Requirement for Credit Risk (2C001)
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {reportData?.ReturnKey || "QCR2C001"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Standardized Approach for Credit Risk • Financial Supervisory Return
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
                            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                        <svg className="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-800/50 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-teal-400 uppercase tracking-wider">Total Credit RWA</span>
                    <span className="text-sm font-bold text-white font-mono">{formatNumber(totalRWA)}</span>
                </div>
                <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/50 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Capital Req. (11%)</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">{formatNumber(totalCapital)}</span>
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
                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        2.5 Capital Summary
                    </button>
                    <button
                        onClick={() => setViewTab("on-balance")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "on-balance"
                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        2.1 On-Balance Sheet ({onBalanceRows.length})
                    </button>
                    <button
                        onClick={() => setViewTab("off-balance")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "off-balance"
                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        2.2 Off-Balance Sheet ({area200Items.length} items)
                    </button>
                    <button
                        onClick={() => setViewTab("derivatives")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "derivatives"
                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        2.3 OTC Derivatives ({derivativesRows.length})
                    </button>
                    <button
                        onClick={() => setViewTab("sft")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "sft"
                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        2.4 Security Financing (SFT) ({area201Items.length})
                    </button>
                    <button
                        onClick={() => setViewTab("json")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "json"
                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Raw JSON
                    </button>
                </div>

                {/* Filter Search Input (visible on tabular views) */}
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
                            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-400 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>
                )}
            </div>

            {/* TAB CONTENTS */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400 mt-3">Loading 2C001 report data...</span>
                </div>
            ) : viewTab === "summary" ? (
                /* SECTION 2.5: TOTAL RISK WEIGHTED ASSETS AND CAPITAL REQUIREMENT */
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-medium text-teal-400 uppercase tracking-wider">Total Credit Risk Weighted Assets</span>
                                <h2 className="text-3xl font-extrabold text-white font-mono mt-1">
                                    {formatNumber(totalRWA)}
                                </h2>
                                <p className="text-xs text-slate-400 mt-2">
                                    Combines On-Balance Sheet ({formatNumber(onBalanceRWA)}) + Off-Balance Sheet ({formatNumber(offBalanceRWA)}) exposures.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                <span>Code: <code className="text-teal-400 font-mono">168_00706</code></span>
                                <span>Formula: <code className="text-slate-300">B + C</code></span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Minimum Capital Requirement (11%)</span>
                                <h2 className="text-3xl font-extrabold text-emerald-300 font-mono mt-1">
                                    {formatNumber(totalCapital)}
                                </h2>
                                <p className="text-xs text-slate-400 mt-2">
                                    National Bank of Ethiopia minimum capital charge at 11% for credit risk.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                <span>Code: <code className="text-emerald-400 font-mono">168_00712</code></span>
                                <span>Formula: <code className="text-slate-300">E + F (11% of RWA)</code></span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                                Section 2.5: Total Risk Weighted Assets & Capital Requirement Breakdown
                            </h3>
                            <span className="text-xs text-slate-400">Amounts in ETB</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700/80">
                                        <th className="py-3 px-4 w-16">Item</th>
                                        <th className="py-3 px-4">Description</th>
                                        <th className="py-3 px-4 w-32 font-mono">Code</th>
                                        <th className="py-3 px-4 w-44 text-right">Value (ETB)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {summaryRows
                                        .filter((s) => !filterText || s.label.toLowerCase().includes(filterText) || s.code.includes(filterText))
                                        .map((item) => {
                                            const val = getItemVal(item.code);
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={cn(
                                                        "hover:bg-slate-800/40 transition-colors",
                                                        item.highlight && "bg-teal-950/20 font-semibold"
                                                    )}
                                                >
                                                    <td className="py-3 px-4 font-mono text-teal-400">{item.id}</td>
                                                    <td className={cn("py-3 px-4", item.highlight ? "text-white" : "text-slate-300")}>
                                                        {item.label}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono text-slate-400">{item.code}</td>
                                                    <td className={cn("py-3 px-4 text-right font-mono", item.highlight ? "text-emerald-300 font-bold" : "text-slate-200")}>
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
            ) : viewTab === "on-balance" ? (
                /* SECTION 2.1: ON-BALANCE SHEET RISK WEIGHTED ASSETS */
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Section 2.1: On-Balance Sheet Risk Weighted Assets
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Showing 94 on-balance sheet asset classes with CRM adjustments and risk weighting
                            </p>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                            Total On-Balance RWA: <strong className="text-teal-400">{formatNumber(onBalanceRWA)}</strong>
                        </span>
                    </div>

                    <div className="overflow-x-auto max-h-[700px]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="sticky top-0 z-10 bg-slate-800/95 text-slate-300 font-semibold border-b border-slate-700/80 shadow-sm backdrop-blur-sm">
                                <tr>
                                    <th className="py-3 px-3 w-16">Row</th>
                                    <th className="py-3 px-4 min-w-[280px]">On-Balance Sheet Item</th>
                                    <th className="py-3 px-3 w-32 text-right">Total Exposure (C)</th>
                                    <th className="py-3 px-3 w-32 text-right">Exp w/o CRM (E)</th>
                                    <th className="py-3 px-3 w-32 text-right">Exp w/ CRM (F)</th>
                                    <th className="py-3 px-3 w-24 text-right">Risk Wt % (G)</th>
                                    <th className="py-3 px-3 w-36 text-right">RWA (H)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {onBalanceRows
                                    .filter((r) => !filterText || r.desc.toLowerCase().includes(filterText) || Object.values(r.cols).some((c) => c.includes(filterText)))
                                    .map((r) => {
                                        const totExp = getItemVal(r.cols["C"]);
                                        const woCrm = getItemVal(r.cols["E"]);
                                        const wCrm = getItemVal(r.cols["F"]);
                                        const rw = getItemVal(r.cols["G"]);
                                        const rwa = getItemVal(r.cols["H"]);
                                        const isTotalRow = r.row === 110 || r.row === 111;

                                        return (
                                            <tr
                                                key={r.row}
                                                className={cn(
                                                    "hover:bg-slate-800/40 transition-colors",
                                                    isTotalRow ? "bg-teal-950/30 font-bold border-t-2 border-teal-800" : ""
                                                )}
                                            >
                                                <td className="py-2.5 px-3 font-mono text-slate-400">{r.row}</td>
                                                <td className={cn("py-2.5 px-4", isTotalRow ? "text-white" : "text-slate-300")}>
                                                    {r.desc}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                    {formatNumber(totExp)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                                                    {formatNumber(woCrm)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                                                    {formatNumber(wCrm)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-teal-400">
                                                    {rw !== "" ? `${rw}%` : "—"}
                                                </td>
                                                <td className={cn("py-2.5 px-3 text-right font-mono font-medium", isTotalRow ? "text-emerald-300 text-sm" : "text-emerald-400")}>
                                                    {formatNumber(rwa)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : viewTab === "off-balance" ? (
                /* SECTION 2.2: OFF-BALANCE SHEET RISK WEIGHTED ASSETS (AREA 200 + SUMMARIES) */
                <div className="flex flex-col gap-6">
                    {/* Category Summaries Table */}
                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-white">
                                    Section 2.2: Off-Balance Sheet (Non-Market) CCF Category Totals
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Summary across all 10 Credit Conversion Factor (CCF) categories
                                </p>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                                Total Off-Balance RWA: <strong className="text-teal-400">{formatNumber(getItemVal("168_00725"))}</strong>
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700/80">
                                        <th className="py-3 px-3 w-16">#</th>
                                        <th className="py-3 px-3 w-20">CCF</th>
                                        <th className="py-3 px-4">Category Description</th>
                                        <th className="py-3 px-4 w-32 font-mono">Summary Code</th>
                                        <th className="py-3 px-4 w-40 text-right">RWA (ETB)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {ccfCategories.map((cat) => {
                                        const rwaVal = getItemVal(cat.summaryCode);
                                        return (
                                            <tr key={cat.catNum} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-2.5 px-3 font-mono text-teal-400">{cat.catNum}</td>
                                                <td className="py-2.5 px-3 font-mono font-semibold text-amber-400">{cat.ccf}</td>
                                                <td className="py-2.5 px-4 text-slate-200">{cat.title}</td>
                                                <td className="py-2.5 px-4 font-mono text-slate-400">{cat.summaryCode}</td>
                                                <td className="py-2.5 px-4 text-right font-mono font-medium text-emerald-400">
                                                    {formatNumber(rwaVal)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-teal-950/30 border-t-2 border-teal-800 font-bold">
                                        <td className="py-3 px-3 font-mono text-white">11</td>
                                        <td className="py-3 px-3 font-mono text-teal-400">—</td>
                                        <td className="py-3 px-4 text-white">Total Off-Balance Sheet (Non-Derivatives & SFT) Credit RWA</td>
                                        <td className="py-3 px-4 font-mono text-slate-300">168_00725</td>
                                        <td className="py-3 px-4 text-right font-mono text-emerald-300 text-sm font-bold">
                                            {formatNumber(getItemVal("168_00725"))}
                                        </td>
                                    </tr>
                                    <tr className="bg-emerald-950/30 font-bold">
                                        <td className="py-3 px-3 font-mono text-white">12</td>
                                        <td className="py-3 px-3 font-mono text-emerald-400">11%</td>
                                        <td className="py-3 px-4 text-emerald-200">Total Off-Balance Sheet (Non-Market) Credit Risk CAPITAL</td>
                                        <td className="py-3 px-4 font-mono text-slate-300">168_00726</td>
                                        <td className="py-3 px-4 text-right font-mono text-emerald-300 text-sm font-bold">
                                            {formatNumber(getItemVal("168_00726"))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Area 200 Dynamic Breakdown */}
                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">
                                Area 200: Dynamic Off-Balance Sheet Individual Line Items
                            </h3>
                            <span className="text-xs text-slate-400">
                                {area200Items.length} categories populated
                            </span>
                        </div>

                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead className="sticky top-0 z-10 bg-slate-800/95 text-slate-300 font-semibold border-b border-slate-700/80 shadow-sm backdrop-blur-sm">
                                    <tr>
                                        <th className="py-3 px-3 w-16">Item #</th>
                                        <th className="py-3 px-3">Category Name</th>
                                        <th className="py-3 px-3 text-right">Face Value</th>
                                        <th className="py-3 px-3 text-right">Pre-CCF (B)</th>
                                        <th className="py-3 px-3 text-right">Credit Eq (C)</th>
                                        <th className="py-3 px-3 text-right">CRM (D)</th>
                                        <th className="py-3 px-3 text-right">Eq w/ CRM (E)</th>
                                        <th className="py-3 px-3 text-right">RWA (F)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {area200Items.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-slate-500">
                                                No Area 200 dynamic items recorded.
                                            </td>
                                        </tr>
                                    ) : (
                                        area200Items.map((entry, idx) => {
                                            const subMap: Record<string, string> = {};
                                            entry.DynamicItems?.forEach((item) => {
                                                subMap[item.Code] = item.Value;
                                            });

                                            return (
                                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-2.5 px-3 font-mono text-teal-400">{subMap["1.1"] || idx + 1}</td>
                                                    <td className="py-2.5 px-3 text-slate-200">{entry._areaName}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.2"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.4"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.5"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.6"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.7"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-400">{formatNumber(subMap["1.8"])}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : viewTab === "derivatives" ? (
                /* SECTION 2.3: OVER-THE-COUNTER (OTC) DERIVATIVES */
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Section 2.3: Risk Weighted Assets for OTC - Derivatives
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Current Exposure Method: Replacement Cost + Add-On Potential Future Exposure
                            </p>
                        </div>
                        <div className="flex gap-4 text-xs font-mono">
                            <span>
                                Total RWA: <strong className="text-teal-400">{formatNumber(getItemVal("168_00704"))}</strong>
                            </span>
                            <span>
                                Capital: <strong className="text-emerald-400">{formatNumber(getItemVal("168_00705"))}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[700px]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="sticky top-0 z-10 bg-slate-800/95 text-slate-300 font-semibold border-b border-slate-700/80 shadow-sm backdrop-blur-sm">
                                <tr>
                                    <th className="py-3 px-3 w-16">Row</th>
                                    <th className="py-3 px-4 min-w-[260px]">Contract Type</th>
                                    <th className="py-3 px-3 w-24 text-right">Add-On (A)</th>
                                    <th className="py-3 px-3 w-28 text-right">Cost (B)</th>
                                    <th className="py-3 px-3 w-28 text-right">Notional (C)</th>
                                    <th className="py-3 px-3 w-32 text-right">Credit Eq. (D)</th>
                                    <th className="py-3 px-3 w-28 text-right">CRM Cost (E)</th>
                                    <th className="py-3 px-3 w-28 text-right">CRM Notional (F)</th>
                                    <th className="py-3 px-3 w-20 text-right">RW % (H)</th>
                                    <th className="py-3 px-3 w-32 text-right">RWA (I)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {derivativesRows
                                    .filter((r) => !filterText || r.desc.toLowerCase().includes(filterText) || Object.values(r.cols).some((c) => c.includes(filterText)))
                                    .map((r) => {
                                        const addOn = getItemVal(r.cols["C"]);
                                        const costB = getItemVal(r.cols["D"]);
                                        const notionalC = getItemVal(r.cols["E"]);
                                        const creditEqD = getItemVal(r.cols["F"]);
                                        const costE = getItemVal(r.cols["G"]);
                                        const notionalF = getItemVal(r.cols["H"]);
                                        const rw = getItemVal(r.cols["J"]);
                                        const rwa = getItemVal(r.cols["K"]);
                                        const isTotalRow = r.row === 264 || r.row === 265;

                                        return (
                                            <tr
                                                key={r.row}
                                                className={cn(
                                                    "hover:bg-slate-800/40 transition-colors",
                                                    isTotalRow ? "bg-teal-950/30 font-bold border-t-2 border-teal-800" : ""
                                                )}
                                            >
                                                <td className="py-2.5 px-3 font-mono text-slate-400">{r.row}</td>
                                                <td className={cn("py-2.5 px-4", isTotalRow ? "text-white font-bold" : "text-slate-300")}>
                                                    {r.desc}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-amber-400">
                                                    {addOn !== "" ? `${addOn}%` : "—"}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(costB)}</td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(notionalC)}</td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-200 font-medium">{formatNumber(creditEqD)}</td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(costE)}</td>
                                                <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(notionalF)}</td>
                                                <td className="py-2.5 px-3 text-right font-mono text-teal-400">
                                                    {rw !== "" ? `${rw}%` : "—"}
                                                </td>
                                                <td className={cn("py-2.5 px-3 text-right font-mono font-medium", isTotalRow ? "text-emerald-300 text-sm" : "text-emerald-400")}>
                                                    {formatNumber(rwa)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : viewTab === "sft" ? (
                /* SECTION 2.4: SECURITY FINANCING TRANSACTIONS (SFT) */
                <div className="flex flex-col gap-6">
                    {/* SFT Summary Totals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-400">Total SFT Credit Risk RWA</span>
                                <div className="text-2xl font-bold text-teal-400 font-mono mt-1">
                                    {formatNumber(getItemVal("168_00698"))}
                                </div>
                            </div>
                            <span className="text-xs font-mono text-slate-500">Row 291 / Code 168_00698</span>
                        </div>
                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-400">Total SFT Required Capital (11%)</span>
                                <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                                    {formatNumber(getItemVal("168_00702"))}
                                </div>
                            </div>
                            <span className="text-xs font-mono text-slate-500">Row 292 / Code 168_00702</span>
                        </div>
                    </div>

                    {/* SFT Individual Items Table */}
                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">
                                Area 201: Security Financing Transactions (SFT) Portfolios
                            </h3>
                            <span className="text-xs text-slate-400">
                                {area201Items.length} transactions recorded
                            </span>
                        </div>

                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead className="sticky top-0 z-10 bg-slate-800/95 text-slate-300 font-semibold border-b border-slate-700/80 shadow-sm backdrop-blur-sm">
                                    <tr>
                                        <th className="py-3 px-3 w-16">#</th>
                                        <th className="py-3 px-3">Transaction</th>
                                        <th className="py-3 px-3 text-right">Exposure (A)</th>
                                        <th className="py-3 px-3 text-right">Collateral (B)</th>
                                        <th className="py-3 px-3 text-right">HFX (C)</th>
                                        <th className="py-3 px-3 text-right">RW % (D)</th>
                                        <th className="py-3 px-3 text-right">RWA (E)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {area201Items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500">
                                                No SFT transactions recorded in Area 201.
                                            </td>
                                        </tr>
                                    ) : (
                                        area201Items.map((entry, idx) => {
                                            const subMap: Record<string, string> = {};
                                            entry.DynamicItems?.forEach((item) => {
                                                subMap[item.Code] = item.Value;
                                            });

                                            return (
                                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-2.5 px-3 font-mono text-teal-400">{idx + 1}</td>
                                                    <td className="py-2.5 px-3 font-semibold text-slate-200">{subMap["1.1"] || `SFT ${idx + 1}`}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.2"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatNumber(subMap["1.3"])}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-amber-400">{subMap["1.4"] ?? "0"}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono text-teal-400">{subMap["1.5"] ? `${subMap["1.5"]}%` : "—"}</td>
                                                    <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-400">{formatNumber(subMap["1.6"])}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* RAW JSON VIEW */
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                            Payload contains {reportData?.ReturnItemsList?.length || 0} ReturnItems and {reportData?.DynamicItemsList?.length || 0} Dynamic Area entries
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
            )}
        </div>
    );
}

export default C2001ExcelView;
