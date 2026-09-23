"use client";

import React, { useState, useEffect } from "react";
import { QC001_DESCRIPTIONS, QC001JsonData } from "@/utils/services/QC001/jsonFormat";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface QC001ExcelViewProps {
    initialData?: QC001JsonData;
    activeFileName?: string;
}

export function QC001ExcelView({
    initialData,
    activeFileName
}: QC001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<QC001JsonData | undefined>(initialData);

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
                    "Failed to fetch QC001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "QC001" };
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

    const filteredRows = QC001_DESCRIPTIONS.filter((rowDef) => {
        const query = searchQuery.toLowerCase();
        const val = getItemValue(rowDef.code);
        return (
            rowDef.desc.toLowerCase().includes(query) ||
            rowDef.excelCode.toLowerCase().includes(query) ||
            rowDef.code.toLowerCase().includes(query) ||
            val.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Capital Adequacy Report (QC001)
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Ready
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            ReturnKey: {reportData?.ReturnKey || "CAP_ADQ_CAP_QC001"}
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
                            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
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
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
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
                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            placeholder="Filter items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/90 text-xs text-slate-200 placeholder-slate-400 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Report Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-800/90 text-slate-300 font-semibold border-b border-slate-700/80">
                                    <th className="py-3 px-4 w-20">Code</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4 w-36 text-slate-400">JSON Code</th>
                                    <th className="py-3 px-4 w-48 text-right">Amount (in Millions)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {filteredRows.map((rowDef) => {
                                    const val = getItemValue(rowDef.code);
                                    const isHeaderRow = ["17", "17.1", "18", "19"].includes(rowDef.excelCode);
                                    return (
                                        <tr
                                            key={rowDef.code}
                                            className={cn(
                                                "hover:bg-slate-800/40 transition-colors",
                                                isHeaderRow && "bg-slate-800/20 font-semibold"
                                            )}
                                        >
                                            <td className="py-3 px-4 text-blue-400 font-mono">{rowDef.excelCode}</td>
                                            <td className={cn("py-3 px-4", isHeaderRow ? "text-slate-100" : "text-slate-300")}>
                                                {rowDef.desc}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{rowDef.code}</td>
                                            <td className="py-3 px-4 text-right font-mono font-medium text-emerald-400">
                                                {val !== "" ? val : <span className="text-slate-600">—</span>}
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
