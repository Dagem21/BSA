"use client";

import React, { useState, useEffect } from "react";
import { MA001_ROW_DESCRIPTIONS, MA001_COL_SUFFIXES } from "@/utils/services/MA001/jsonFormat";
import { cn } from "@/lib/utils";

const ROW_CODES = [
    "1",
    "1.1",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.16",
    "1.16",
    "1.2",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "1.3",
    "2",
    "2.1",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.1.4",
    "2.1.5",
    "2.2",
    "2.2.1",
    "2.2.2",
    "2.2.3",
    "2.3",
    "2.4",
    "2.5"
];

const COL_LETTERS = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface MA001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface MA001ExcelViewProps {
    initialData?: MA001JsonData;
    activeFileName?: string;
}

export function MA001ExcelView({ initialData, activeFileName }: MA001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<MA001JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        colSuffix: string;
        value: string;
    } | null>({
        cellRef: "C16",
        code: "20_00001",
        rowDesc: "ASSETS",
        colSuffix: "Amount",
        value: "0"
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=MA001";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch MA001 JSON view:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData || activeFileName) {
            fetchJsonData(activeFileName);
        }
    }, [activeFileName]);

    const returnItemsMap: Record<string, string> = {};
    if (reportData?.ReturnItemsList) {
        reportData.ReturnItemsList.forEach((item) => {
            returnItemsMap[item.Code] = item.Value;
        });
    }

    const getItemValue = (itemCodeNum: number): string => {
        const codeStr = `20_${itemCodeNum.toString().padStart(5, "0")}`;
        if (returnItemsMap[codeStr] !== undefined) {
            return returnItemsMap[codeStr];
        }
        return "0";
    };

    const formatCurrency = (valStr: string) => {
        if (!valStr || valStr === "0" || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Calculate totals for KPI cards
    const totalAssets = getItemValue(168); // 20_00168 (TOTAL_Total under ASSETS)
    const totalLiabilities = getItemValue(312); // 20_00312 (TOTAL_Total under LIABILITIES)
    const netMismatch = getItemValue(324); // 20_00324 (NET Mismatch_Total)
    const cumulativeMismatch = getItemValue(336); // 20_00336 (Cumulative Mismatch_Total)

    let codeCounter = 1;
    const gridRows = MA001_ROW_DESCRIPTIONS.map((desc, rowIndex) => {
        const code = ROW_CODES[rowIndex] || "";
        const rowExcelNum = 16 + rowIndex;
        const rowItems = MA001_COL_SUFFIXES.map((colSuffix, colIndex) => {
            const itemCodeNum = codeCounter++;
            const codeStr = `20_${itemCodeNum.toString().padStart(5, "0")}`;
            const val = getItemValue(itemCodeNum);
            const colLetter = COL_LETTERS[colIndex];
            const cellRef = `${colLetter}${rowExcelNum}`;

            return {
                itemCodeNum,
                codeStr,
                colSuffix,
                val,
                colLetter,
                cellRef,
                rowIndex,
                colIndex
            };
        });

        return {
            rowIndex,
            rowExcelNum,
            code,
            desc,
            rowItems
        };
    });

    const filteredRows = gridRows.filter((r) =>
        r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase())
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
                                {reportData?.ReturnKey || "NBE_MAT_ANL_MA001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Maturity Analysis of Assets & Liabilities (MA001)
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution: <span className="font-semibold text-dark dark:text-white">{reportData?.InstCode || "0000001"}</span> | 
                            Financial Year: <span className="font-semibold text-dark dark:text-white">{reportData?.FinYear || 2026}</span> | 
                            Period: <span className="font-semibold text-dark dark:text-white">{reportData?.StartDate?.split("T")[0] || "2026-04-01"} to {reportData?.EndDate?.split("T")[0] || "2026-06-30"}</span>
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
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Total Assets
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatCurrency(totalAssets)}
                        </div>
                        <span className="text-xs text-gray-500">Row 1.3 Total</span>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Total Liabilities
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatCurrency(totalLiabilities)}
                        </div>
                        <span className="text-xs text-gray-500">Row 2.3 Total</span>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Net Mismatch
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatCurrency(netMismatch)}
                        </div>
                        <span className="text-xs text-gray-500">Row 2.4 Total (Assets - Liabilities)</span>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Cumulative Mismatch
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatCurrency(cumulativeMismatch)}
                        </div>
                        <span className="text-xs text-gray-500">Row 2.5 Total</span>
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
                                {selectedCell ? `${selectedCell.rowDesc} (${selectedCell.colSuffix})` : "Click any cell to inspect"} =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell ? formatCurrency(selectedCell.value) : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Search line items or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Excel Spreadsheet Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-100 text-center font-mono text-[11px] font-semibold text-gray-600 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300">
                                    <th className="w-10 border-r border-stroke py-1.5 dark:border-dark-3"></th>
                                    <th className="w-16 border-r border-stroke py-1.5 dark:border-dark-3">A</th>
                                    <th className="min-w-[220px] border-r border-stroke py-1.5 text-left pl-3 dark:border-dark-3">B</th>
                                    {COL_LETTERS.map((letter) => (
                                        <th key={letter} className="min-w-[120px] border-r border-stroke py-1.5 dark:border-dark-3">
                                            {letter}
                                        </th>
                                    ))}
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">#</th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">Code</th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">Time Bands</th>
                                    {MA001_COL_SUFFIXES.map((suffix, i) => (
                                        <th key={i} className="border-r border-stroke p-2 text-right dark:border-dark-3">
                                            {suffix}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => {
                                    const isAssetsHeader = row.code === "1";
                                    const isLiabilitiesHeader = row.code === "2";
                                    const isSectionHeader = isAssetsHeader || isLiabilitiesHeader;
                                    const isTotalRow = row.code === "1.3" || row.code === "2.3";
                                    const isMismatchRow = row.code === "2.4" || row.code === "2.5";

                                    return (
                                        <tr
                                            key={row.rowIndex}
                                            className={cn(
                                                "border-b border-stroke transition dark:border-dark-3",
                                                isAssetsHeader && "bg-emerald-500/10 font-bold text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300",
                                                isLiabilitiesHeader && "bg-blue-500/10 font-bold text-blue-900 dark:bg-blue-500/20 dark:text-blue-300",
                                                isTotalRow && "bg-gray-100 font-bold dark:bg-dark-2 text-dark dark:text-white",
                                                isMismatchRow && "bg-amber-500/10 font-bold text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
                                                !isSectionHeader && !isTotalRow && !isMismatchRow && "hover:bg-gray-50 dark:hover:bg-dark-2/50"
                                            )}
                                        >
                                            <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                                {row.rowExcelNum}
                                            </td>

                                            <td className="border-r border-stroke p-2 text-center font-mono font-medium text-gray-700 dark:border-dark-3 dark:text-gray-300">
                                                {row.code}
                                            </td>

                                            <td className="border-r border-stroke p-2 font-medium text-dark dark:border-dark-3 dark:text-white">
                                                {row.desc}
                                            </td>

                                            {row.rowItems.map((cell) => {
                                                const isSelected = selectedCell?.cellRef === cell.cellRef;

                                                return (
                                                    <td
                                                        key={cell.colIndex}
                                                        onClick={() =>
                                                            setSelectedCell({
                                                                cellRef: cell.cellRef,
                                                                code: cell.codeStr,
                                                                rowDesc: row.desc,
                                                                colSuffix: cell.colSuffix,
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
                                                        {formatCurrency(cell.val)}
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
                            Raw JSON Payload ({reportData?.ReturnItemsList?.length || 336} items)
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
