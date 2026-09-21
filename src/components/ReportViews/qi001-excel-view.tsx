"use client";

import React, { useState, useEffect } from "react";
import { QI001_DESCRIPTIONS, QI001JsonData } from "@/utils/services/QI001/jsonFormat";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface QI001ExcelViewProps {
    initialData?: QI001JsonData;
    activeFileName?: string;
}

interface TableGroupRow {
    sectionCode: string;
    category: string;
    excelRow: number;
    amountCode: string;
    weightCode: string;
    rwaCode: string;
    isHeader?: boolean;
}

const TABLE_ROWS: TableGroupRow[] = [
    { sectionCode: "1", category: "1-Cash on hand (local and foreign currency)", excelRow: 16, amountCode: "11_00001", weightCode: "11_00002", rwaCode: "11_00003" },
    { sectionCode: "2", category: "2-Claims on banks", excelRow: 17, amountCode: "11_00004", weightCode: "11_00005", rwaCode: "11_00006", isHeader: true },
    { sectionCode: "2.1", category: "2,1-Claims on NBE", excelRow: 18, amountCode: "11_00007", weightCode: "11_00008", rwaCode: "11_00009" },
    { sectionCode: "2.2", category: "2,2-Claims on other banks(Domestic & foreign)", excelRow: 19, amountCode: "11_00010", weightCode: "11_00011", rwaCode: "11_00012", isHeader: true },
    { sectionCode: "2.2.1", category: "2.2.1-Less than 1 year maturity", excelRow: 20, amountCode: "11_00013", weightCode: "11_00014", rwaCode: "11_00015" },
    { sectionCode: "2.2.2", category: "2.2.2-Over 1 year maturity", excelRow: 21, amountCode: "11_00016", weightCode: "11_00017", rwaCode: "11_00018" },
    { sectionCode: "3", category: "3-Claims on government", excelRow: 22, amountCode: "11_00019", weightCode: "11_00020", rwaCode: "11_00021", isHeader: true },
    { sectionCode: "3.1", category: "3,1-Central government", excelRow: 23, amountCode: "11_00022", weightCode: "11_00023", rwaCode: "11_00024" },
    { sectionCode: "3.2", category: "3,2-Regional government", excelRow: 24, amountCode: "11_00025", weightCode: "11_00026", rwaCode: "11_00027" },
    { sectionCode: "4", category: "4-Loans & advances (net)", excelRow: 25, amountCode: "11_00028", weightCode: "11_00029", rwaCode: "11_00030", isHeader: true },
    { sectionCode: "4.1", category: "4,1-Secured by cash, central government securities or guaranteed", excelRow: 26, amountCode: "11_00031", weightCode: "11_00032", rwaCode: "11_00033" },
    { sectionCode: "4.2", category: "4,2-Secured/guaranteed by regional government", excelRow: 27, amountCode: "11_00034", weightCode: "11_00035", rwaCode: "11_00036" },
    { sectionCode: "4.3", category: "4,3-Residential mortgage loans", excelRow: 28, amountCode: "11_00037", weightCode: "11_00038", rwaCode: "11_00039" },
    { sectionCode: "4.4", category: "4,4-Others", excelRow: 29, amountCode: "11_00040", weightCode: "11_00041", rwaCode: "11_00042" },
    { sectionCode: "5", category: "5-Securities (non-government)", excelRow: 30, amountCode: "11_00043", weightCode: "11_00044", rwaCode: "11_00045" },
    { sectionCode: "6", category: "6-Investments", excelRow: 31, amountCode: "11_00046", weightCode: "11_00047", rwaCode: "11_00048" },
    { sectionCode: "7", category: "7-Fixed assets (net)", excelRow: 32, amountCode: "11_00049", weightCode: "11_00050", rwaCode: "11_00051" },
    { sectionCode: "8", category: "8-Other assets", excelRow: 33, amountCode: "11_00052", weightCode: "11_00053", rwaCode: "11_00054", isHeader: true },
    { sectionCode: "8.1", category: "8,1-Accounts receivable", excelRow: 34, amountCode: "11_00055", weightCode: "11_00056", rwaCode: "11_00057" },
    { sectionCode: "8.2", category: "8,2-Supplies stock a/c", excelRow: 35, amountCode: "11_00058", weightCode: "11_00059", rwaCode: "11_00060" },
    { sectionCode: "8.3", category: "8,3-Customers’ liabilities for L/C", excelRow: 36, amountCode: "11_00061", weightCode: "11_00062", rwaCode: "11_00063" },
    { sectionCode: "8.4", category: "8,4-Uncleared effect foreign", excelRow: 37, amountCode: "11_00064", weightCode: "11_00065", rwaCode: "11_00066" },
    { sectionCode: "8.5", category: "8,5-Others", excelRow: 38, amountCode: "11_00067", weightCode: "11_00068", rwaCode: "11_00069" },
    { sectionCode: "9", category: "9-Total RWBSA*", excelRow: 39, amountCode: "11_00070", weightCode: "11_00071", rwaCode: "11_00072", isHeader: true }
];

export function QI001ExcelView({
    initialData,
    activeFileName
}: QI001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<QI001JsonData | undefined>(initialData);

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
                    "Failed to fetch QI001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "QI001" };
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

    const getItemValue = (code: string) => {
        const item = reportData?.ReturnItemsList?.find((i) => i.Code === code);
        return item ? item.Value : "";
    };

    const filteredTableRows = TABLE_ROWS.filter((r) => {
        const query = searchQuery.toLowerCase();
        return (
            r.category.toLowerCase().includes(query) ||
            r.sectionCode.toLowerCase().includes(query) ||
            getItemValue(r.amountCode).toLowerCase().includes(query) ||
            getItemValue(r.rwaCode).toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Capital Adequacy On-Balance Sheet (QI001)
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Ready
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            ReturnKey: {reportData?.ReturnKey || "CAP_ADQ_ITEM_QI001"}
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
                            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        >
                            {availableFiles.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                        <button
                            onClick={() => setViewTab("grid")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                viewTab === "grid"
                                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                viewTab === "json"
                                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            JSON View
                        </button>
                    </div>

                    {/* Download Excel */}
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Metadata Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Institution Code</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.InstCode || "—"}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Financial Year</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.FinYear ?? "—"}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Start Date</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.StartDate ? reportData.StartDate.split("T")[0] : "—"}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">End Date</span>
                    <span className="text-sm font-semibold text-slate-100">{reportData?.EndDate ? reportData.EndDate.split("T")[0] : "—"}</span>
                </div>
            </div>

            {viewTab === "grid" ? (
                <div className="flex flex-col gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
                    {/* Search filter */}
                    <div className="relative max-w-sm">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter asset items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/90 text-xs text-slate-200 placeholder-slate-400 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                    </div>

                    {/* Report Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-800/90 text-slate-300 font-semibold border-b border-slate-700/80">
                                    <th className="py-3 px-3 w-16">Code</th>
                                    <th className="py-3 px-3">Assets Category</th>
                                    <th className="py-3 px-3 w-36 text-right">Amount (A)</th>
                                    <th className="py-3 px-3 w-28 text-right">Weight (B)</th>
                                    <th className="py-3 px-3 w-40 text-right">Risk Weighted Assets (C=AxB)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {filteredTableRows.map((r) => {
                                    const amount = getItemValue(r.amountCode);
                                    const weight = getItemValue(r.weightCode);
                                    const rwa = getItemValue(r.rwaCode);

                                    return (
                                        <tr
                                            key={r.sectionCode}
                                            className={cn(
                                                "hover:bg-slate-800/40 transition-colors",
                                                r.isHeader && "bg-slate-800/30 font-semibold"
                                            )}
                                        >
                                            <td className="py-2.5 px-3 text-cyan-400 font-mono">{r.sectionCode}</td>
                                            <td className={cn("py-2.5 px-3", r.isHeader ? "text-slate-100" : "text-slate-300")}>
                                                {r.category}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {amount !== "" ? amount : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                                                {weight !== "" ? weight : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-400">
                                                {rwa !== "" ? rwa : <span className="text-slate-600">—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* JSON Viewer */
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                    <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-[600px] p-2 leading-relaxed">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
