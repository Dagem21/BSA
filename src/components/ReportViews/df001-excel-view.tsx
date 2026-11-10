"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    F6001JsonData,
    F6001_CELL_MAPPING
} from "@/utils/services/6F001/jsonFormat";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

interface DF001ExcelViewProps {
    initialData?: F6001JsonData;
    activeFileName?: string;
}

interface TableRowDef {
    sn: string;
    particulars: string;
    section: "assets" | "liabilities" | "positions" | "summary";
    isHeader?: boolean;
    isTotal?: boolean;
    usdCode?: string;
    eurosCode?: string;
    gbpCode?: string;
    othersCode?: string;
    goldCode?: string;
}

const TABLE_ROWS: TableRowDef[] = [
    // 1. Assets
    { sn: "1", particulars: "Foreign Currency Assets", section: "assets", isHeader: true },
    { sn: "1.1", particulars: "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)", section: "assets", isTotal: true, usdCode: "172_00001", eurosCode: "172_00002", gbpCode: "172_00003", othersCode: "172_00004" },
    { sn: "1.1.1", particulars: "Currency on hand", section: "assets", usdCode: "172_00005", eurosCode: "172_00006", gbpCode: "172_00007", othersCode: "172_00008" },
    { sn: "1.1.2", particulars: "Due from banks", section: "assets", usdCode: "172_00009", eurosCode: "172_00010", gbpCode: "172_00011", othersCode: "172_00012" },
    { sn: "1.1.3", particulars: "Cheques and items in transit", section: "assets", usdCode: "172_00013", eurosCode: "172_00014", gbpCode: "172_00015", othersCode: "172_00016" },
    { sn: "1.1.4", particulars: "Loans & advances", section: "assets", usdCode: "172_00017", eurosCode: "172_00018", gbpCode: "172_00019", othersCode: "172_00020" },
    { sn: "1.1.5", particulars: "Accrued interest", section: "assets", usdCode: "172_00021", eurosCode: "172_00022", gbpCode: "172_00023", othersCode: "172_00024" },
    { sn: "1.1.6", particulars: "Other Assets", section: "assets", usdCode: "172_00025", eurosCode: "172_00026", gbpCode: "172_00027", othersCode: "172_00028" },
    { sn: "1.2", particulars: "Off-balance sheet Items (Sum of 1.2 to 1.2.4)", section: "assets", isTotal: true, usdCode: "172_00029", eurosCode: "172_00030", gbpCode: "172_00031", othersCode: "172_00032" },
    { sn: "1.2.1", particulars: "Undelivered spot purchase", section: "assets", usdCode: "172_00033", eurosCode: "172_00034", gbpCode: "172_00035", othersCode: "172_00036" },
    { sn: "1.2.2", particulars: "Forward purchase", section: "assets", usdCode: "172_00037", eurosCode: "172_00038", gbpCode: "172_00039", othersCode: "172_00040" },
    { sn: "1.2.3", particulars: "Option, Swaps, Derivatives", section: "assets", usdCode: "172_00041", eurosCode: "172_00042", gbpCode: "172_00043", othersCode: "172_00044" },
    { sn: "1.2.4", particulars: "Other assets", section: "assets", usdCode: "172_00045", eurosCode: "172_00046", gbpCode: "172_00047", othersCode: "172_00048" },
    { sn: "1.3", particulars: "Total Foreign Currency Assets (Sum of 1.1 & 1.2)", section: "assets", isTotal: true, usdCode: "172_00049", eurosCode: "172_00050", gbpCode: "172_00051", othersCode: "172_00052" },

    // 2. Liabilities
    { sn: "2", particulars: "Foreign Currency Liabilities", section: "liabilities", isHeader: true },
    { sn: "2.1", particulars: "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)", section: "liabilities", isTotal: true, usdCode: "172_00053", eurosCode: "172_00054", gbpCode: "172_00055", othersCode: "172_00056" },
    { sn: "2.1.1", particulars: "Due to banks abroad", section: "liabilities", usdCode: "172_00057", eurosCode: "172_00058", gbpCode: "172_00059", othersCode: "172_00060" },
    { sn: "2.1.2", particulars: "Foreign currency deposits", section: "liabilities", usdCode: "172_00061", eurosCode: "172_00062", gbpCode: "172_00063", othersCode: "172_00064" },
    { sn: "2.1.3", particulars: "Borrowings", section: "liabilities", usdCode: "172_00140", eurosCode: "172_00141", gbpCode: "172_00142", othersCode: "172_00143" },
    { sn: "2.1.4", particulars: "Accrued interest payable", section: "liabilities", usdCode: "172_00065", eurosCode: "172_00066", gbpCode: "172_00067", othersCode: "172_00068" },
    { sn: "2.1.5", particulars: "Other liabilities", section: "liabilities", usdCode: "172_00069", eurosCode: "172_00070", gbpCode: "172_00071", othersCode: "172_00072" },
    { sn: "2.2", particulars: "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)", section: "liabilities", isTotal: true, usdCode: "172_00073", eurosCode: "172_00074", gbpCode: "172_00075", othersCode: "172_00076" },
    { sn: "2.2.1", particulars: "Undelivered spot sales", section: "liabilities", usdCode: "172_00077", eurosCode: "172_00078", gbpCode: "172_00079", othersCode: "172_00080" },
    { sn: "2.2.2", particulars: "Forward sales", section: "liabilities", usdCode: "172_00081", eurosCode: "172_00082", gbpCode: "172_00083", othersCode: "172_00084" },
    { sn: "2.2.3", particulars: "Option, Swaps, Derivatives", section: "liabilities", usdCode: "172_00085", eurosCode: "172_00086", gbpCode: "172_00087", othersCode: "172_00088" },
    { sn: "2.2.4", particulars: "Letter of credit", section: "liabilities", usdCode: "172_00089", eurosCode: "172_00090", gbpCode: "172_00091", othersCode: "172_00092" },
    { sn: "2.2.5", particulars: "Guarantees", section: "liabilities", usdCode: "172_00093", eurosCode: "172_00094", gbpCode: "172_00095", othersCode: "172_00096" },
    { sn: "2.2.6", particulars: "Other liabilities", section: "liabilities", usdCode: "172_00097", eurosCode: "172_00098", gbpCode: "172_00099", othersCode: "172_00100" },
    { sn: "2.3", particulars: "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)", section: "liabilities", isTotal: true, usdCode: "172_00101", eurosCode: "172_00102", gbpCode: "172_00103", othersCode: "172_00104" },

    // 3. FX Positions
    { sn: "3", particulars: "Foreign Exchange Position in Single Currency", section: "positions", isHeader: true },
    { sn: "3.1", particulars: "Net long position (where assets less liabilities is +)", section: "positions", usdCode: "172_00105", eurosCode: "172_00106", gbpCode: "172_00107", othersCode: "172_00108" },
    { sn: "3.2", particulars: "Net short position (where assets less liabilities is -)", section: "positions", usdCode: "172_00109", eurosCode: "172_00110", gbpCode: "172_00111", othersCode: "172_00112" },
    { sn: "4", particulars: "Mid Exchange Rate", section: "positions", usdCode: "172_00113", eurosCode: "172_00114", gbpCode: "172_00115", othersCode: "172_00116" },
    { sn: "5", particulars: "Net long position in Birr (3.1*4)", section: "positions", isTotal: true, usdCode: "172_00117", eurosCode: "172_00118", gbpCode: "172_00119", othersCode: "172_00120" },
    { sn: "6", particulars: "Net short position in Birr (3.2*4)", section: "positions", isTotal: true, usdCode: "172_00121", eurosCode: "172_00122", gbpCode: "172_00123", othersCode: "172_00124" },
    { sn: "7", particulars: "Net open position (Greater of 5 or 6)", section: "positions", isTotal: true, usdCode: "172_00125", eurosCode: "172_00126", gbpCode: "172_00127", othersCode: "172_00128" },
    { sn: "8", particulars: "Overall Foreign Exchange Position", section: "positions", usdCode: "172_00129", eurosCode: "172_00130", gbpCode: "172_00131", othersCode: "172_00132" },

    // 4. Shorthand Summary & Capital Charge
    { sn: "8.1", particulars: "Total long Positions in FX (Sum of row 5)", section: "summary", isTotal: true, goldCode: "172_00133" },
    { sn: "8.2", particulars: "Total Short Positions in FX (Sum of 6)", section: "summary", isTotal: true, goldCode: "172_00134" },
    { sn: "9", particulars: "Max (Total Long Positions; Total Short Positions)", section: "summary", isTotal: true, goldCode: "172_00135" },
    { sn: "10", particulars: "Gold Position (absolute value)", section: "summary", goldCode: "172_00136" },
    { sn: "11", particulars: "Net Global Open Position (Rows 9 + 10)", section: "summary", isTotal: true, goldCode: "172_00137" },
    { sn: "12", particulars: "Total Capital Charge for FX Risk (Row 11*11%)", section: "summary", isTotal: true, goldCode: "172_00138" },
    { sn: "15", particulars: "TOTAL RWA for FX = Row 12 * 9.1", section: "summary", isTotal: true, goldCode: "172_00139" }
];

export function DF001ExcelView({
    initialData,
    activeFileName
}: DF001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "summary" | "assets" | "liabilities" | "positions" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<F6001JsonData | undefined>(initialData);

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
                        f.toUpperCase().includes("6F001") ||
                        f.toUpperCase().includes("DF001") ||
                        f.toUpperCase().includes("MFER6F001")
                );
                setAvailableFiles(filtered.length > 0 ? filtered : data.availableFiles);
            }
        } else if (!isLoading && errors.details) {
            toast.error(
                errors.details?.response?.data?.error ||
                    "Failed to fetch 6F001/DF001 JSON report"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: fileName }
            : { type: "MFER6F001" };
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

    // Lookup map for item values
    const itemsMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (reportData?.ReturnItemsList) {
            reportData.ReturnItemsList.forEach((item) => {
                map[item.Code] = item.Value ?? "";
            });
        }
        return map;
    }, [reportData]);

    const getItemVal = (code?: string) => (code ? itemsMap[code] ?? "" : "");

    const formatNumber = (val: string | number | undefined | null) => {
        if (val === undefined || val === null || val === "") return "—";
        const n = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
        if (isNaN(n)) return String(val);
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(n);
    };

    const filterText = searchQuery.toLowerCase().trim();

    const filteredRows = useMemo(() => {
        return TABLE_ROWS.filter((r) => {
            if (viewTab !== "grid" && viewTab !== "json") {
                if (viewTab === "assets" && r.section !== "assets") return false;
                if (viewTab === "liabilities" && r.section !== "liabilities") return false;
                if (viewTab === "positions" && r.section !== "positions") return false;
                if (viewTab === "summary" && r.section !== "summary") return false;
            }
            if (!filterText) return true;
            return (
                r.particulars.toLowerCase().includes(filterText) ||
                r.sn.toLowerCase().includes(filterText) ||
                (r.usdCode && r.usdCode.includes(filterText)) ||
                (r.eurosCode && r.eurosCode.includes(filterText)) ||
                (r.gbpCode && r.gbpCode.includes(filterText)) ||
                (r.othersCode && r.othersCode.includes(filterText)) ||
                (r.goldCode && r.goldCode.includes(filterText))
            );
        });
    }, [viewTab, filterText]);

    const totalLong = getItemVal("172_00133");
    const totalShort = getItemVal("172_00134");
    const netGlobalOpen = getItemVal("172_00137");
    const capitalCharge = getItemVal("172_00138");
    const totalRwa = getItemVal("172_00139");

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-4 sm:p-6 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 rounded-xl text-white shadow-lg shadow-orange-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Capital Requirement for Market Foreign Exchange Risk (6F001 / DF001)
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {reportData?.ReturnKey || "MFER6F001"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Shorthand Method for Market FX Risk • Financial Supervisory Return
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
                    <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Capital Charge (11%)</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">{formatNumber(capitalCharge)}</span>
                </div>
                <div className="bg-gradient-to-br from-orange-950/60 to-slate-900 border border-orange-800/50 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-orange-400 uppercase tracking-wider">Total FX RWA</span>
                    <span className="text-sm font-bold text-white font-mono">{formatNumber(totalRwa)}</span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
                <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setViewTab("grid")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "grid"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Complete Return Grid
                    </button>
                    <button
                        onClick={() => setViewTab("summary")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "summary"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Capital Charge & RWA
                    </button>
                    <button
                        onClick={() => setViewTab("assets")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "assets"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        1. Assets
                    </button>
                    <button
                        onClick={() => setViewTab("liabilities")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "liabilities"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        2. Liabilities
                    </button>
                    <button
                        onClick={() => setViewTab("positions")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            viewTab === "positions"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                                : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        3. Net Positions
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
                    <span className="text-xs text-slate-400 mt-3">Loading 6F001 report data...</span>
                </div>
            ) : viewTab === "json" ? (
                /* RAW JSON VIEW */
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                            Payload contains {reportData?.ReturnItemsList?.length || 0} ReturnItems
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
            ) : (
                /* TABLE GRID VIEW */
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Capital Requirement for Market Foreign Exchange Risk (Shorthand Method)
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Amounts in Millions of ETB (converted using Mid Exchange Rates)
                            </p>
                        </div>
                        <div className="flex gap-4 text-xs font-mono">
                            <span>
                                Net Global Open: <strong className="text-amber-400">{formatNumber(netGlobalOpen)}</strong>
                            </span>
                            <span>
                                Total RWA: <strong className="text-orange-400">{formatNumber(totalRwa)}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[720px]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="sticky top-0 z-10 bg-slate-800/95 text-slate-300 font-semibold border-b border-slate-700/80 shadow-sm backdrop-blur-sm">
                                <tr>
                                    <th className="py-3 px-3 w-16">No.</th>
                                    <th className="py-3 px-4 min-w-[280px]">Particulars</th>
                                    <th className="py-3 px-3 w-32 text-right">USD</th>
                                    <th className="py-3 px-3 w-32 text-right">Euros</th>
                                    <th className="py-3 px-3 w-32 text-right">GBP</th>
                                    <th className="py-3 px-3 w-32 text-right">Others</th>
                                    <th className="py-3 px-3 w-32 text-right">Gold / Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {filteredRows.map((r, idx) => {
                                    if (r.isHeader) {
                                        return (
                                            <tr key={idx} className="bg-slate-800/70 border-t border-slate-700">
                                                <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{r.sn}</td>
                                                <td colSpan={6} className="py-2.5 px-4 font-bold text-white tracking-wide uppercase text-[11px]">
                                                    {r.particulars}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    const valUsd = getItemVal(r.usdCode);
                                    const valEuros = getItemVal(r.eurosCode);
                                    const valGbp = getItemVal(r.gbpCode);
                                    const valOthers = getItemVal(r.othersCode);
                                    const valGold = getItemVal(r.goldCode);

                                    return (
                                        <tr
                                            key={idx}
                                            className={cn(
                                                "hover:bg-slate-800/40 transition-colors",
                                                r.isTotal ? "bg-amber-950/20 font-semibold" : ""
                                            )}
                                        >
                                            <td className="py-2.5 px-3 font-mono text-slate-400">{r.sn}</td>
                                            <td className={cn("py-2.5 px-4", r.isTotal ? "text-white" : "text-slate-300")}>
                                                {r.particulars}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {r.usdCode ? formatNumber(valUsd) : "—"}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {r.eurosCode ? formatNumber(valEuros) : "—"}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {r.gbpCode ? formatNumber(valGbp) : "—"}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                                                {r.othersCode ? formatNumber(valOthers) : "—"}
                                            </td>
                                            <td className={cn("py-2.5 px-3 text-right font-mono font-medium", r.goldCode ? "text-amber-400 font-bold" : "text-slate-500")}>
                                                {r.goldCode ? formatNumber(valGold) : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DF001ExcelView;
