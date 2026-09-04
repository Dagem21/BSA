"use client";

import React, { useState, useEffect } from "react";
import { REGRL002_REGIONS, REGRL002_SUB_ROWS, REGRL002_RANGES, REGRL002_METRICS } from "@/utils/services/REGRL002/jsonFormat";
import { cn } from "@/lib/utils";

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface REGRL002JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface REGRL002ExcelViewProps {
    initialData?: REGRL002JsonData;
    activeFileName?: string;
}

export function REGRL002ExcelView({ initialData, activeFileName }: REGRL002ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [activeRegion, setActiveRegion] = useState<string>("Addis Ababa");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<REGRL002JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        colName: string;
        value: string;
    } | null>({
        cellRef: "C17",
        code: "RL002_48782",
        rowDesc: "Addis Ababa",
        colName: "<= 100,000 (Amount)",
        value: "0"
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=REGRL002";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch REGRL002 JSON view:", e);
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

    const returnItemsMap: Record<string, string> = {};
    if (reportData?.ReturnItemsList) {
        reportData.ReturnItemsList.forEach((item) => {
            returnItemsMap[item.Code] = item.Value;
        });
    }

    const getItemValue = (code: string) => {
        return returnItemsMap[code] || "0";
    };

    const formatNum = (valStr: string) => {
        if (valStr === undefined || valStr === null || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Metric Summary Cards (Addis Ababa Totals)
    const addisAbabaTotalAmount = getItemValue("RL002_48803");
    const addisAbabaTotalBorrowers = getItemValue("RL002_48804");
    const addisAbabaTotalAccounts = getItemValue("RL002_48805");

    // Grid Construction for active region
    let codeCounter = 48782;
    const allGridRows: Array<{
        regionName: string;
        subRowName: string;
        rowExcelNum: number;
        rowItems: Array<{
            codeStr: string;
            rangeStr: string;
            metricStr: string;
            val: string;
            cellRef: string;
            colIndex: number;
        }>;
    }> = [];

    REGRL002_REGIONS.forEach((regName, regIndex) => {
        const startExcelRow = 17 + regIndex * 6;
        REGRL002_SUB_ROWS.forEach((subRow, subIndex) => {
            const excelRow = startExcelRow + subIndex;
            let colCounter = 0;
            const rowItems: Array<any> = [];

            REGRL002_RANGES.forEach((rangeStr) => {
                REGRL002_METRICS.forEach((metricStr) => {
                    const codeStr = `RL002_${codeCounter}`;
                    const val = getItemValue(codeStr);
                    codeCounter++;

                    // Col C is 3
                    let colLetter = "";
                    let c = colCounter % 24 + 3;
                    let cIndex = colCounter - 48782;
                    let colNum = 3 + (cIndex % 24);
                    let tempC = colNum;
                    while (tempC > 0) {
                        let mod = (tempC - 1) % 26;
                        colLetter = String.fromCharCode(65 + mod) + colLetter;
                        tempC = Math.floor((tempC - mod) / 26);
                    }
                    const cellRef = `${colLetter}${excelRow}`;

                    rowItems.push({
                        codeStr,
                        rangeStr,
                        metricStr,
                        val,
                        cellRef,
                        colIndex: colCounter
                    });
                });
            });

            allGridRows.push({
                regionName: regName,
                subRowName: subRow,
                rowExcelNum: excelRow,
                rowItems
            });
        });
    });

    const activeRegionRows = allGridRows.filter((r) => r.regionName === activeRegion);
    const filteredRows = activeRegionRows.filter(
        (r) =>
            r.subRowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.regionName.toLowerCase().includes(searchQuery.toLowerCase())
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
                                {reportData?.ReturnKey || "LOAN_RAN & REGRL002"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Monthly Conventional Loans by Range & Region (REGRL002)
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
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 transition"
                            title="Download Excel file generated from JSON"
                        >
                            📥 Download Excel
                        </button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Addis Ababa Total Loan Amount
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(addisAbabaTotalAmount)}
                        </div>
                        <span className="text-xs text-gray-500">Code: RL002_48803</span>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Addis Ababa Total Borrowers
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(addisAbabaTotalBorrowers)}
                        </div>
                        <span className="text-xs text-gray-500">Code: RL002_48804</span>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Addis Ababa Total Accounts
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(addisAbabaTotalAccounts)}
                        </div>
                        <span className="text-xs text-gray-500">Code: RL002_48805</span>
                    </div>
                </div>
            </div>

            {viewTab === "grid" ? (
                <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    {/* Region Selector Tabs */}
                    <div className="mb-4 flex items-center gap-1.5 overflow-x-auto border-b border-stroke pb-2 dark:border-dark-3">
                        <span className="mr-2 text-xs font-bold uppercase text-gray-500">Regions:</span>
                        {REGRL002_REGIONS.map((reg) => (
                            <button
                                key={reg}
                                onClick={() => setActiveRegion(reg)}
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition",
                                    activeRegion === reg
                                        ? "bg-primary text-white shadow"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-2 dark:text-gray-300 dark:hover:bg-dark-3"
                                )}
                            >
                                {reg}
                            </button>
                        ))}
                    </div>

                    {/* Excel Formula Bar & Search Filter */}
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 items-center gap-2 rounded-md border border-stroke bg-gray-50 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-2">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {selectedCell ? selectedCell.cellRef : "Cell"}
                            </span>
                            <span className="text-gray-400">fx</span>
                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                Code: <span className="font-semibold text-primary">{selectedCell?.code || "-"}</span> |{" "}
                                {selectedCell ? `${selectedCell.rowDesc} - ${selectedCell.colName}` : "Click any cell to inspect"} =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell ? formatNum(selectedCell.value) : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Filter sub-rows..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Excel Spreadsheet Table Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">Row</th>
                                    <th className="min-w-[180px] border-r border-stroke p-2 dark:border-dark-3">Region / Sub-Type</th>
                                    {REGRL002_RANGES.map((range, i) => (
                                        <th key={i} colSpan={3} className="border-r border-stroke p-2 text-center border-b dark:border-dark-3">
                                            {range}
                                        </th>
                                    ))}
                                </tr>
                                <tr className="border-b border-stroke bg-gray-100 font-medium text-gray-600 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300">
                                    <th className="border-r border-stroke p-1 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-1 dark:border-dark-3"></th>
                                    {REGRL002_RANGES.map((_, i) => (
                                        <React.Fragment key={i}>
                                            <th className="border-r border-stroke p-1 text-right text-[11px] font-mono dark:border-dark-3">Amount</th>
                                            <th className="border-r border-stroke p-1 text-right text-[11px] font-mono dark:border-dark-3">Borrowers</th>
                                            <th className="border-r border-stroke p-1 text-right text-[11px] font-mono dark:border-dark-3">Accounts</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, rIdx) => {
                                    const isRegionHeader = row.subRowName === "";

                                    return (
                                        <tr
                                            key={rIdx}
                                            className={cn(
                                                "border-b border-stroke transition dark:border-dark-3",
                                                isRegionHeader
                                                    ? "bg-emerald-500/10 font-bold text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200"
                                                    : "hover:bg-gray-50 dark:hover:bg-dark-2/50"
                                            )}
                                        >
                                            <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                                {row.rowExcelNum}
                                            </td>

                                            <td className="border-r border-stroke p-2 font-medium text-dark dark:border-dark-3 dark:text-white">
                                                {isRegionHeader ? `${row.regionName} (Total)` : row.subRowName}
                                            </td>

                                            {row.rowItems.map((cell) => {
                                                const isSelected = selectedCell?.cellRef === cell.cellRef;

                                                return (
                                                    <td
                                                        key={cell.codeStr}
                                                        onClick={() =>
                                                            setSelectedCell({
                                                                cellRef: cell.cellRef,
                                                                code: cell.codeStr,
                                                                rowDesc: isRegionHeader ? row.regionName : `${row.regionName} (${row.subRowName})`,
                                                                colName: `${cell.rangeStr} (${cell.metricStr.trim()})`,
                                                                value: cell.val
                                                            })
                                                        }
                                                        className={cn(
                                                            "cursor-pointer border-r border-stroke p-2 text-right font-mono transition dark:border-dark-3",
                                                            isSelected
                                                                ? "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold text-emerald-900 dark:text-emerald-200"
                                                                : "text-gray-800 dark:text-gray-200"
                                                        )}
                                                    >
                                                        {formatNum(cell.val)}
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
                            Raw JSON Payload ({reportData?.ReturnItemsList?.length || 2016} items)
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
