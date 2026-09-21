"use client";

import React, { useState, useEffect } from "react";
import { QO001_DESCRIPTIONS, QO001JsonData } from "@/utils/services/QO001/jsonFormat";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface QO001ExcelViewProps {
    initialData?: QO001JsonData;
    activeFileName?: string;
}

interface TableGroupRow {
    sectionCode: string;
    category: string;
    excelRow: number;
    faceValCode: string;
    convFactorCode: string;
    amountCode: string;
    weightCode: string;
    creditEquCode: string;
}

const TABLE_ROWS: TableGroupRow[] = [
    { sectionCode: "10", category: "Commitments to purchase and/or sell FCY", excelRow: 16, faceValCode: "12_00001", convFactorCode: "12_00002", amountCode: "12_00003", weightCode: "12_00004", creditEquCode: "12_00005" },
    { sectionCode: "11.1", category: "Standby letters of credit - Federal government", excelRow: 18, faceValCode: "12_00006", convFactorCode: "12_00007", amountCode: "12_00008", weightCode: "12_00009", creditEquCode: "12_00010" },
    { sectionCode: "11.2", category: "Standby letters of credit - Regional government", excelRow: 19, faceValCode: "12_00011", convFactorCode: "12_00012", amountCode: "12_00013", weightCode: "12_00014", creditEquCode: "12_00015" },
    { sectionCode: "11.3", category: "Standby letters of credit - Bank (domestic/foreign)", excelRow: 20, faceValCode: "12_00016", convFactorCode: "12_00017", amountCode: "12_00018", weightCode: "12_00019", creditEquCode: "12_00020" },
    { sectionCode: "11.4", category: "Standby letters of credit - All others", excelRow: 21, faceValCode: "12_00021", convFactorCode: "12_00022", amountCode: "12_00023", weightCode: "12_00024", creditEquCode: "12_00025" },
    { sectionCode: "12.1", category: "Loan commitments - Federal government", excelRow: 23, faceValCode: "12_00026", convFactorCode: "12_00027", amountCode: "12_00028", weightCode: "12_00029", creditEquCode: "12_00030" },
    { sectionCode: "12.2", category: "Loan commitments - Regional government", excelRow: 24, faceValCode: "12_00031", convFactorCode: "12_00032", amountCode: "12_00033", weightCode: "12_00034", creditEquCode: "12_00035" },
    { sectionCode: "12.3", category: "Loan commitments - Bank (domestic/foreign)", excelRow: 25, faceValCode: "12_00036", convFactorCode: "12_00037", amountCode: "12_00038", weightCode: "12_00039", creditEquCode: "12_00040" },
    { sectionCode: "12.4", category: "Loan commitments - All other", excelRow: 26, faceValCode: "12_00041", convFactorCode: "12_00042", amountCode: "12_00043", weightCode: "12_00044", creditEquCode: "12_00045" },
    { sectionCode: "13.1", category: "Guarantees issued - Federal government", excelRow: 28, faceValCode: "12_00046", convFactorCode: "12_00047", amountCode: "12_00048", weightCode: "12_00049", creditEquCode: "12_00050" },
    { sectionCode: "13.2", category: "Guarantees issued - Regional government", excelRow: 29, faceValCode: "12_00051", convFactorCode: "12_00052", amountCode: "12_00053", weightCode: "12_00054", creditEquCode: "12_00055" },
    { sectionCode: "13.3", category: "Guarantees issued - Bank (domestic/foreign)", excelRow: 30, faceValCode: "12_00056", convFactorCode: "12_00057", amountCode: "12_00058", weightCode: "12_00059", creditEquCode: "12_00060" },
    { sectionCode: "13.4", category: "Guarantees issued - All others", excelRow: 31, faceValCode: "12_00061", convFactorCode: "12_00062", amountCode: "12_00063", weightCode: "12_00064", creditEquCode: "12_00065" },
    { sectionCode: "14.1", category: "Commercial LC - Federal government", excelRow: 33, faceValCode: "12_00066", convFactorCode: "12_00067", amountCode: "12_00068", weightCode: "12_00069", creditEquCode: "12_00070" },
    { sectionCode: "14.2", category: "Commercial LC - Regional government", excelRow: 34, faceValCode: "12_00071", convFactorCode: "12_00072", amountCode: "12_00073", weightCode: "12_00074", creditEquCode: "12_00075" },
    { sectionCode: "14.3", category: "Commercial LC - Bank (domestic/foreign)", excelRow: 35, faceValCode: "12_00076", convFactorCode: "12_00077", amountCode: "12_00078", weightCode: "12_00079", creditEquCode: "12_00080" },
    { sectionCode: "14.4", category: "Commercial LC - All others", excelRow: 36, faceValCode: "12_00081", convFactorCode: "12_00082", amountCode: "12_00083", weightCode: "12_00084", creditEquCode: "12_00085" },
    { sectionCode: "15", category: "Others**", excelRow: 37, faceValCode: "12_00086", convFactorCode: "12_00087", amountCode: "12_00088", weightCode: "12_00089", creditEquCode: "12_00090" },
    { sectionCode: "16", category: "Total Risk weighted Off - BSA", excelRow: 38, faceValCode: "12_00091", convFactorCode: "12_00092", amountCode: "12_00093", weightCode: "12_00094", creditEquCode: "12_00095" }
];

export function QO001ExcelView({
    initialData,
    activeFileName
}: QO001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<QO001JsonData | undefined>(initialData);

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
                    "Failed to fetch QO001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "QO001" };
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
            getItemValue(r.faceValCode).toLowerCase().includes(query) ||
            getItemValue(r.amountCode).toLowerCase().includes(query) ||
            getItemValue(r.creditEquCode).toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Capital Adequacy Off-Balance Sheet (QO001)
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Ready
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            ReturnKey: {reportData?.ReturnKey || "CAP_ADQ_OFB_QO001"}
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
                            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
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
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
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
                        <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            placeholder="Filter OBSA items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/90 text-xs text-slate-200 placeholder-slate-400 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>

                    {/* Report Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-800/90 text-slate-300 font-semibold border-b border-slate-700/80">
                                    <th className="py-3 px-3 w-16">Code</th>
                                    <th className="py-3 px-3">Off-Balance Sheet Assets (OBSA)</th>
                                    <th className="py-3 px-3 w-32 text-right">Face Value</th>
                                    <th className="py-3 px-3 w-28 text-right">Credit Conv. Factor</th>
                                    <th className="py-3 px-3 w-32 text-right">Amount</th>
                                    <th className="py-3 px-3 w-24 text-right">Weight (%)</th>
                                    <th className="py-3 px-3 w-36 text-right">Credit Equivalent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {filteredTableRows.map((r) => {
                                    const faceVal = getItemValue(r.faceValCode);
                                    const convFactor = getItemValue(r.convFactorCode);
                                    const amount = getItemValue(r.amountCode);
                                    const weight = getItemValue(r.weightCode);
                                    const creditEqu = getItemValue(r.creditEquCode);

                                    const isTotalRow = r.sectionCode === "16";

                                    return (
                                        <tr
                                            key={r.sectionCode}
                                            className={cn(
                                                "hover:bg-slate-800/40 transition-colors",
                                                isTotalRow && "bg-slate-800/30 font-bold"
                                            )}
                                        >
                                            <td className="py-2.5 px-3 text-purple-400 font-mono">{r.sectionCode}</td>
                                            <td className={cn("py-2.5 px-3", isTotalRow ? "text-white" : "text-slate-300")}>
                                                {r.category}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {faceVal !== "" ? faceVal : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                                                {convFactor !== "" ? convFactor : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {amount !== "" ? amount : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                                                {weight !== "" ? weight : <span className="text-slate-600">—</span>}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-400">
                                                {creditEqu !== "" ? creditEqu : <span className="text-slate-600">—</span>}
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
