"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";
import { RI003_REGIONS, getRI003SubRows, RI003_METRIC_DESCRIPTIONS } from "@/utils/services/RI003/jsonFormat";

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface RI003JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface RI003ExcelViewProps {
    initialData?: RI003JsonData;
    activeFileName?: string;
}

export function RI003ExcelView({
    initialData,
    activeFileName
}: RI003ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<RI003JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        metricDesc: string;
        value: string;
    } | null>({
        cellRef: "C15",
        code: "RI003_35702",
        rowDesc: "Addis Ababa",
        metricDesc: "Pub. Enterprise_Amount",
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
                    "Failed to fetch RI003 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "RI003" };
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
                a.download = `${reportData.ReturnKey || "RI003"}_Report.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to download Excel file");
        }
    };

    const itemsMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        if (reportData?.ReturnItemsList) {
            reportData.ReturnItemsList.forEach((item) => {
                map[item.Code] = item.Value;
            });
        }
        return map;
    }, [reportData]);

    const getItemVal = (code: string) => itemsMap[code] || "";

    const parseNum = (code: string): number => {
        const val = getItemVal(code);
        if (!val) return 0;
        const n = parseFloat(val.replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
    };

    const formatCurr = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatCount = (count: number) => {
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0
        }).format(count);
    };

    // Calculate Summary Metrics across 14 regions
    const kpiSummary = React.useMemo(() => {
        let totalDepositAmount = 0;
        let totalDepositors = 0;
        let totalAccounts = 0;
        let addisAbabaAmount = 0;

        RI003_REGIONS.forEach((regName, regIdx) => {
            // Head row starts at 35702 + regIdx * 8 * 18
            const headStartCodeNum = 35702 + regIdx * 144;
            const regTotalAmtCode = `RI003_${headStartCodeNum + 15}`;
            const regTotalDepCode = `RI003_${headStartCodeNum + 16}`;
            const regTotalAccCode = `RI003_${headStartCodeNum + 17}`;

            const amt = parseNum(regTotalAmtCode);
            const dep = parseNum(regTotalDepCode);
            const acc = parseNum(regTotalAccCode);

            totalDepositAmount += amt;
            totalDepositors += dep;
            totalAccounts += acc;

            if (regName === "Addis Ababa") {
                addisAbabaAmount = amt;
            }
        });

        return {
            totalDepositAmount,
            totalDepositors,
            totalAccounts,
            addisAbabaAmount
        };
    }, [itemsMap]);

    return (
        <div className="w-full bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden font-sans">
            {/* Header Toolbar */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg">
                        RI
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                RI003 - Interest-Free Banking Deposit by Sector & Region
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                {reportData?.ReturnKey || "INT_FRE_SECRI003"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Institution: <span className="text-slate-200 font-mono">{reportData?.InstCode || "0000001"}</span> | Fin Year: <span className="text-slate-200 font-mono">{reportData?.FinYear || 2026}</span> | Period: <span className="text-slate-200 font-mono">{reportData?.StartDate ? reportData.StartDate.split("T")[0] : "2026-04-01"} to {reportData?.EndDate ? reportData.EndDate.split("T")[0] : "2026-06-30"}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {availableFiles.length > 1 && (
                        <select
                            value={currentFileName}
                            onChange={(e) => {
                                setCurrentFileName(e.target.value);
                                fetchJsonData(e.target.value);
                            }}
                            className="bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500"
                        >
                            {availableFiles.map((fn) => (
                                <option key={fn} value={fn}>
                                    {fn}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setViewTab("grid")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                viewTab === "grid"
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            Grid Spreadsheet View
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                viewTab === "json"
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            Raw JSON View
                        </button>
                    </div>

                    <button
                        onClick={handleDownloadExcel}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-teal-900/30 border border-teal-500/50 flex items-center gap-2 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-900 border-b border-slate-800">
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 shadow-inner">
                    <span className="text-xs text-slate-400 font-medium">Total IFB Deposit Amount</span>
                    <div className="text-2xl font-black text-teal-400 mt-1 font-mono">
                        ETB {formatCurr(kpiSummary.totalDepositAmount)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Across 6 Sectors & 14 Regions</span>
                </div>

                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 shadow-inner">
                    <span className="text-xs text-slate-400 font-medium">Total IFB Depositors</span>
                    <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
                        {formatCount(kpiSummary.totalDepositors)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Sector depositors count</span>
                </div>

                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 shadow-inner">
                    <span className="text-xs text-slate-400 font-medium">Total IFB Accounts</span>
                    <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">
                        {formatCount(kpiSummary.totalAccounts)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Sector account count</span>
                </div>

                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 shadow-inner">
                    <span className="text-xs text-slate-400 font-medium">Addis Ababa IFB Share</span>
                    <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
                        ETB {formatCurr(kpiSummary.addisAbabaAmount)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                        {kpiSummary.totalDepositAmount > 0
                            ? `${((kpiSummary.addisAbabaAmount / kpiSummary.totalDepositAmount) * 100).toFixed(1)}% of national IFB deposit`
                            : "0%"}
                    </span>
                </div>
            </div>

            {/* Formula Bar & Filters */}
            <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 font-mono text-teal-400 font-semibold">
                        <span>{selectedCell?.cellRef || "A1"}</span>
                    </div>
                    <div className="flex-1 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-slate-300 font-mono flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="text-slate-500 font-bold">fx:</span>
                        <span className="text-amber-300 font-semibold">{selectedCell?.code}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-200">{selectedCell?.rowDesc} - {selectedCell?.metricDesc}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-teal-400 font-bold">Value: {selectedCell?.value}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">Region:</span>
                        <select
                            value={selectedRegionFilter}
                            onChange={(e) => setSelectedRegionFilter(e.target.value)}
                            className="bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-800 focus:outline-none focus:border-teal-500 font-medium"
                        >
                            <option value="ALL">All Regions (14)</option>
                            {RI003_REGIONS.map((reg) => (
                                <option key={reg} value={reg}>
                                    {reg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search code or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded border border-slate-800 focus:outline-none focus:border-teal-500 w-48"
                        />
                        <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content Tab */}
            {viewTab === "json" ? (
                <div className="p-6 bg-slate-950 font-mono text-xs text-teal-400 overflow-auto max-h-[700px] border-b border-slate-800">
                    <pre className="whitespace-pre-wrap">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[750px] relative">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead className="text-[11px] uppercase bg-slate-950 text-slate-300 sticky top-0 z-20 shadow-md border-b border-slate-800">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 border-r border-slate-800 bg-slate-950 sticky left-0 z-30 min-w-[200px]">
                                    Region / Category
                                </th>
                                <th colSpan={3} className="px-3 py-2 text-center border-r border-slate-800 bg-teal-950/40 text-teal-300 font-bold">
                                    Public Enterprise
                                </th>
                                <th colSpan={3} className="px-3 py-2 text-center border-r border-slate-800 bg-blue-950/40 text-blue-300 font-bold">
                                    Private & Coop.
                                </th>
                                <th colSpan={3} className="px-3 py-2 text-center border-r border-slate-800 bg-indigo-950/40 text-indigo-300 font-bold">
                                    Regional Gov.
                                </th>
                                <th colSpan={3} className="px-3 py-2 text-center border-r border-slate-800 bg-purple-950/40 text-purple-300 font-bold">
                                    Banks
                                </th>
                                <th colSpan={3} className="px-3 py-2 text-center border-r border-slate-800 bg-cyan-950/40 text-cyan-300 font-bold">
                                    Others
                                </th>
                                <th colSpan={3} className="px-3 py-2 text-center bg-amber-950/40 text-amber-300 font-bold">
                                    Total
                                </th>
                            </tr>
                            <tr className="border-t border-slate-800 text-[10px]">
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-teal-400">Amount</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Depositors</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Accounts</th>

                                <th className="px-3 py-2 text-right border-r border-slate-800 text-blue-400">Amount</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Depositors</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Accounts</th>

                                <th className="px-3 py-2 text-right border-r border-slate-800 text-indigo-400">Amount</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Depositors</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Accounts</th>

                                <th className="px-3 py-2 text-right border-r border-slate-800 text-purple-400">Amount</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Depositors</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Accounts</th>

                                <th className="px-3 py-2 text-right border-r border-slate-800 text-cyan-400">Amount</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Depositors</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-slate-400">Accounts</th>

                                <th className="px-3 py-2 text-right border-r border-slate-800 text-amber-400">Amount</th>
                                <th className="px-3 py-2 text-right border-r border-slate-800 text-amber-300">Depositors</th>
                                <th className="px-3 py-2 text-right text-amber-300">Accounts</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/60 font-mono">
                            {RI003_REGIONS.map((regName, regIdx) => {
                                if (
                                    selectedRegionFilter !== "ALL" &&
                                    selectedRegionFilter !== regName
                                ) {
                                    return null;
                                }

                                const subRowNames = getRI003SubRows(regIdx + 1);
                                const regionStartCode = 35702 + regIdx * 144;

                                return (
                                    <React.Fragment key={regName}>
                                        {subRowNames.map((subRowLabel, subRowIdx) => {
                                            const rowCodeOffset = regionStartCode + subRowIdx * 18;
                                            const isRegionHeader = subRowIdx === 0;
                                            const subRowTitle = isRegionHeader
                                                ? `${regName} Total`
                                                : subRowLabel.replace("_", "");

                                            if (
                                                searchQuery &&
                                                !regName.toLowerCase().includes(searchQuery.toLowerCase()) &&
                                                !subRowTitle.toLowerCase().includes(searchQuery.toLowerCase())
                                            ) {
                                                const matchCode = Array.from({ length: 18 }).some((_, c) => {
                                                    const code = `RI003_${rowCodeOffset + c}`;
                                                    return code.toLowerCase().includes(searchQuery.toLowerCase());
                                                });
                                                if (!matchCode) return null;
                                            }

                                            return (
                                                <tr
                                                    key={`${regName}-${subRowIdx}`}
                                                    className={cn(
                                                        "transition-colors hover:bg-slate-800/40",
                                                        isRegionHeader
                                                            ? "bg-slate-950/90 font-bold border-t-2 border-slate-700 text-slate-100"
                                                            : subRowIdx % 2 === 0
                                                            ? "bg-slate-900/60"
                                                            : "bg-slate-900/20"
                                                    )}
                                                >
                                                    {/* Row Title */}
                                                    <td className="px-4 py-2 border-r border-slate-800 sticky left-0 z-10 bg-slate-900 text-slate-200 font-sans font-medium whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {isRegionHeader && (
                                                                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                                                            )}
                                                            <span className={isRegionHeader ? "font-bold text-white text-xs" : "text-slate-300 pl-3 text-[11px]"}>
                                                                {subRowTitle}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* 18 Metric Cells */}
                                                    {RI003_METRIC_DESCRIPTIONS.map((metricDesc, colIdx) => {
                                                        const itemCode = `RI003_${rowCodeOffset + colIdx}`;
                                                        const valStr = getItemVal(itemCode);
                                                        const numVal = parseNum(itemCode);
                                                        const cellRef = `C${15 + regIdx * 8 + subRowIdx}`;

                                                        const isSelected = selectedCell?.code === itemCode;
                                                        const isTotalCol = colIdx >= 15;

                                                        return (
                                                            <td
                                                                key={itemCode}
                                                                onClick={() =>
                                                                    setSelectedCell({
                                                                        cellRef,
                                                                        code: itemCode,
                                                                        rowDesc: `${regName} - ${subRowTitle}`,
                                                                        metricDesc,
                                                                        value: valStr || "0"
                                                                    })
                                                                }
                                                                className={cn(
                                                                    "px-3 py-2 text-right border-r border-slate-800/60 cursor-pointer select-none transition-all text-[11px]",
                                                                    isSelected && "ring-2 ring-teal-400 bg-teal-950/50 z-10",
                                                                    isTotalCol && "bg-slate-950/40 font-bold text-amber-300",
                                                                    !isTotalCol && numVal > 0 && "text-slate-200",
                                                                    !isTotalCol && numVal === 0 && "text-slate-600"
                                                                )}
                                                            >
                                                                {valStr
                                                                    ? colIdx % 3 === 0
                                                                        ? formatCurr(numVal)
                                                                        : formatCount(numVal)
                                                                    : "-"}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Footer Summary */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Showing 14 Regions × 8 Sub-rows = 112 Data Rows (2,016 Return Items)</span>
                <span>Template: <strong className="text-teal-400 font-mono">RI003</strong></span>
            </div>
        </div>
    );
}
