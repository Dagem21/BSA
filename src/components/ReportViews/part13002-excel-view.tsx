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

interface PART13002JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: any[];
    DynamicItemsList?: DynamicArea[];
}

interface PART13002ExcelViewProps {
    initialData?: PART13002JsonData;
    activeFileName?: string;
}

export function PART13002ExcelView({ initialData, activeFileName }: PART13002ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<PART13002JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        colDesc: string;
        rowIdx: number;
        value: string;
    } | null>({
        cellRef: "A8",
        code: "1.1",
        colDesc: "Name of Counterparty*",
        rowIdx: 1,
        value: ""
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=13002";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch 13002 JSON view:", e);
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
        if (!valStr || valStr === "" || valStr === "0") return isPercent ? "0.00%" : "0.00";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        const formatted = num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return isPercent ? `${formatted}%` : formatted;
    };

    function get13002FlatItemsFromReturnItems(returnItems?: any[]) {
        if (!Array.isArray(returnItems) || returnItems.length < 142) return [];
        const itemMap: Record<string, any> = {};
        returnItems.forEach((it: any) => {
            if (it?.Code) itemMap[it.Code] = it.Value ?? "";
        });

        const flat: any[] = [];
        for (let slot = 1; slot <= 20; slot++) {
            const cCode = `13002_${(21 - slot).toString().padStart(5, "0")}`;
            const cpName = (itemMap[cCode] || "").trim();

            if (cpName && cpName !== "0" && cpName !== "-") {
                const natureCode = `13002_${(41 - slot).toString().padStart(5, "0")}`;
                const totalOutCode = `13002_${(61 - slot).toString().padStart(5, "0")}`;
                const sectorCode = `13002_${(81 - slot).toString().padStart(5, "0")}`;
                const pctCode = `13002_${(101 - slot).toString().padStart(5, "0")}`;
                const statusCode = `13002_${(121 - slot).toString().padStart(5, "0")}`;
                const capitalCode = `13002_${(141 - slot).toString().padStart(5, "0")}`;

                flat.push(
                    { Code: `${slot}.1`, Value: cpName, _description: "Name of Counterparty*", _dataType: "TEXT", _required: true },
                    { Code: `${slot}.2`, Value: itemMap[natureCode] || "-", _description: "Nature of Counterparty", _dataType: "TEXT", _required: true },
                    { Code: `${slot}.3`, Value: "-", _description: "Type of Exposure", _dataType: "TEXT", _required: true },
                    { Code: `${slot}.4`, Value: itemMap[sectorCode] || "-", _description: "Sector of Exposure", _dataType: "TEXT", _required: true },
                    { Code: `${slot}.5`, Value: itemMap[totalOutCode] || "0", _description: "Approved Limit/Facility", _dataType: "NUMERIC", _required: true },
                    { Code: `${slot}.6`, Value: itemMap[totalOutCode] || "0", _description: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A", _dataType: "NUMERIC", _required: false },
                    { Code: `${slot}.7`, Value: "0", _description: "Off-balance Sheet Exposure Amount (e.g. guarantee)_   B", _dataType: "NUMERIC", _required: false },
                    { Code: `${slot}.8`, Value: itemMap[totalOutCode] || "0", _description: "Total Outstanding Balance_     C=A+B", _dataType: "NUMERIC", _required: true },
                    { Code: `${slot}.9`, Value: "-", _description: "Maturity Date", _dataType: "DATE", _required: true },
                    { Code: `${slot}.10`, Value: itemMap[capitalCode] || "0", _description: "Capital", _dataType: "NUMERIC", _required: true },
                    { Code: `${slot}.11`, Value: itemMap[pctCode] || "0", _description: "Exposure Amount (A+B) as Percent of Total Capital", _dataType: "NUMERIC", _required: true },
                    { Code: `${slot}.12`, Value: itemMap[statusCode] || "-", _description: "Status (classification)", _dataType: "TEXT", _required: true },
                    { Code: `${slot}.13`, Value: "-", _description: "Collateral_Type", _dataType: "TEXT", _required: true },
                    { Code: `${slot}.14`, Value: "0", _description: "Collateral_Estimated/Face value", _dataType: "NUMERIC", _required: false }
                );
            }
        }
        return flat;
    }

    const flatItems = (reportData?.DynamicItemsList?.[0]?.DynamicItems && reportData.DynamicItemsList[0].DynamicItems.length > 0)
        ? reportData.DynamicItemsList[0].DynamicItems
        : get13002FlatItemsFromReturnItems(reportData?.ReturnItemsList);

    const rowsCount = Math.floor(flatItems.length / 14);
    const dynamicRows: DynamicItem[][] = [];

    for (let i = 0; i < rowsCount; i++) {
        dynamicRows.push(flatItems.slice(i * 14, i * 14 + 14));
    }

    let totalApprovedLimit = 0;
    let totalOnBalance = 0;
    let totalOffBalance = 0;
    let totalOutstanding = 0;

    dynamicRows.forEach((row) => {
        row.forEach((item, colIdx) => {
            const num = parseFloat(item.Value);
            if (!isNaN(num)) {
                if (colIdx === 4 || item.Code.endsWith(".5")) totalApprovedLimit += num;
                if (colIdx === 5 || item.Code.endsWith(".6")) totalOnBalance += num;
                if (colIdx === 6 || item.Code.endsWith(".7")) totalOffBalance += num;
                if (colIdx === 7 || item.Code.endsWith(".8")) totalOutstanding += num;
            }
        });
    });

    const filteredRows = dynamicRows.filter((row) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return row.some((item) => item.Value.toLowerCase().includes(q) || item._description.toLowerCase().includes(q));
    });

    const headers = [
        { code: "1.1", label: "Name of Counterparty", colLetter: "A" },
        { code: "1.2", label: "Nature of Counterparty", colLetter: "B" },
        { code: "1.3", label: "Type of Exposure", colLetter: "C" },
        { code: "1.4", label: "Sector of Exposure", colLetter: "D" },
        { code: "1.5", label: "Approved Limit/Facility", colLetter: "E" },
        { code: "1.6", label: "On-Balance Exposure (A)", colLetter: "F" },
        { code: "1.7", label: "Off-Balance Exposure (B)", colLetter: "G" },
        { code: "1.8", label: "Total Outstanding (C=A+B)", colLetter: "H" },
        { code: "1.9", label: "Maturity Date", colLetter: "I" },
        { code: "1.10", label: "Capital", colLetter: "J" },
        { code: "1.11", label: "Exposure % of Capital", colLetter: "K" },
        { code: "1.12", label: "Status (Classification)", colLetter: "L" },
        { code: "1.13", label: "Collateral Type", colLetter: "M" },
        { code: "1.14", label: "Collateral Value", colLetter: "N" }
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header Toolbar */}
            <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                Excel Dynamic Report Viewer
                            </span>
                            <span className="rounded bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                {reportData?.ReturnKey || "BSD_LOAN_PART13002"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Monthly Returns on Related Party Transactions List of Related Party Exposures
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution: <span className="font-semibold text-dark dark:text-white">{reportData?.InstCode || "0000001"}</span> | 
                            Financial Year: <span className="font-semibold text-dark dark:text-white">{reportData?.FinYear || 2026}</span> | 
                            Period: <span className="font-semibold text-dark dark:text-white">{reportData?.StartDate?.split("T")[0] || "2026-08-01"} to {reportData?.EndDate?.split("T")[0] || "2026-08-31"}</span>
                        </p>
                    </div>

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
                                <option value="">Select file...</option>
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
                                "rounded-lg px-4 py-2 text-sm font-medium transition",
                                viewTab === "grid"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                            )}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "rounded-lg px-4 py-2 text-sm font-medium transition",
                                viewTab === "json"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                            )}
                        >
                            JSON View
                        </button>

                        <button
                            onClick={handleDownloadExcel}
                            disabled={!currentFileName}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                            ⬇️ Download Excel
                        </button>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                {viewTab === "grid" && !loading && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Approved Limit</p>
                            <h3 className="mt-1 text-xl font-bold text-dark dark:text-white">
                                {totalApprovedLimit.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total On-Balance (A)</p>
                            <h3 className="mt-1 text-xl font-bold text-dark dark:text-white">
                                {totalOnBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Off-Balance (B)</p>
                            <h3 className="mt-1 text-xl font-bold text-dark dark:text-white">
                                {totalOffBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Outstanding (C)</p>
                            <h3 className="mt-1 text-xl font-bold text-dark dark:text-white">
                                {totalOutstanding.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Related Parties</p>
                            <h3 className="mt-1 text-xl font-bold text-dark dark:text-white">
                                {dynamicRows.length}
                            </h3>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="flex min-h-[400px] items-center justify-center rounded-[10px] border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : viewTab === "json" ? (
                <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <pre className="max-h-[600px] overflow-auto rounded-lg bg-gray-50 p-4 text-xs font-mono text-dark dark:bg-dark-2 dark:text-white">
                        {JSON.stringify(reportData, null, 4)}
                    </pre>
                </div>
            ) : (
                <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark flex flex-col min-h-[600px] max-h-[75vh]">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between border-b border-stroke p-4 dark:border-dark-3 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded bg-gray-100 px-3 py-1.5 dark:bg-dark-2">
                                <span className="font-mono text-sm font-bold text-dark dark:text-white min-w-[32px] text-center">
                                    {selectedCell?.cellRef}
                                </span>
                                <span className="h-4 w-px bg-stroke dark:bg-dark-3"></span>
                                <span className="text-sm font-medium italic text-gray-500">fx</span>
                                <span className="h-4 w-px bg-stroke dark:bg-dark-3"></span>
                                <span className="font-mono text-sm text-dark dark:text-white truncate max-w-[200px] sm:max-w-[400px]">
                                    {selectedCell?.value || '""'}
                                </span>
                            </div>
                            <span className="text-xs font-medium text-gray-500 hidden sm:inline-block">
                                [{selectedCell?.code}] {selectedCell?.colDesc} (Row {selectedCell?.rowIdx})
                            </span>
                        </div>
                        <div className="relative w-full max-w-[250px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Filter counterparties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-stroke bg-gray-50 py-1.5 pl-9 pr-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="flex-1 overflow-auto bg-[#F3F4F6] p-4 dark:bg-dark-2 relative">
                        <div className="min-w-[1900px] bg-white dark:bg-gray-dark rounded border border-stroke dark:border-dark-3 overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="flex border-b border-stroke bg-gray-100 dark:border-dark-3 dark:bg-dark-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                <div className="flex h-10 w-12 shrink-0 items-center justify-center border-r border-stroke dark:border-dark-3 bg-gray-200 dark:bg-dark-3">
                                    #
                                </div>
                                {headers.map((h) => (
                                    <div key={h.code} className="flex-1 flex flex-col justify-center px-3 border-r border-stroke dark:border-dark-3 text-center truncate">
                                        <div className="font-mono text-[10px] text-gray-400">{h.colLetter}</div>
                                        <div className="truncate" title={h.label}>{h.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            {filteredRows.length > 0 ? (
                                filteredRows.map((rowItems, idx) => (
                                    <div key={idx} className="flex border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors group">
                                        <div className="flex min-h-[40px] w-12 shrink-0 items-center justify-center border-r border-stroke bg-gray-50 font-mono text-xs text-gray-400 dark:border-dark-3 dark:bg-dark-2">
                                            {8 + idx}
                                        </div>
                                        
                                        {headers.map((h, colIdx) => {
                                            const item = rowItems.find(i => i.Code === h.code || i.Code.endsWith(`.${colIdx + 1}`)) || rowItems[colIdx];
                                            const val = item?.Value || "";
                                            const isNumeric = [4, 5, 6, 7, 9, 10, 13].includes(colIdx);
                                            const isPercent = colIdx === 10;
                                            
                                            const cellRef = `${h.colLetter}${8 + idx}`;
                                            const isSelected = selectedCell?.cellRef === cellRef;

                                            return (
                                                <div 
                                                    key={h.code}
                                                    onClick={() => setSelectedCell({
                                                        cellRef,
                                                        code: item?.Code || `${idx + 1}.${colIdx + 1}`,
                                                        colDesc: h.label,
                                                        rowIdx: 8 + idx,
                                                        value: val
                                                    })}
                                                    className={cn(
                                                        "flex-1 flex items-center px-3 border-r border-stroke dark:border-dark-3 cursor-pointer text-sm overflow-hidden",
                                                        isSelected ? "bg-primary/10 ring-1 ring-inset ring-primary z-10" : "",
                                                        isNumeric ? "justify-end font-mono" : "justify-start"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "truncate",
                                                        !val ? "text-gray-300 dark:text-gray-600" : "text-dark dark:text-white"
                                                    )}>
                                                        {isNumeric ? formatNum(val, isPercent) : (val || "-")}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-32 items-center justify-center text-sm text-gray-500">
                                    No records found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
