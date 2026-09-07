"use client";

import React, { useState, useEffect } from "react";
import { ZS001_ROW_DESCRIPTIONS, ZS001_COL_SUFFIXES } from "@/utils/services/ZS001/jsonFormat";
import { cn } from "@/lib/utils";

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface ZS001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface ZS001ExcelViewProps {
    initialData?: ZS001JsonData;
    activeFileName?: string;
}

export function ZS001ExcelView({ initialData, activeFileName }: ZS001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<ZS001JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        colSuffix: string;
        value: string;
    } | null>({
        cellRef: "D17",
        code: "109_00001",
        rowDesc: "Net current liabilities",
        colSuffix: "Thu",
        value: "0"
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=ZS001";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch ZS001 JSON view:", e);
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
        try {
            if (currentFileName) {
                const excelName = currentFileName.endsWith(".json")
                    ? currentFileName.replace(/\.json$/, ".xlsx")
                    : currentFileName;
                const res = await fetch(`/api/report/download?filename=${encodeURIComponent(excelName)}`);
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
                a.download = `${reportData.ReturnKey || "ZS001"}_export.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
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

    const getItemValue = (itemCodeNum: number): string => {
        const codeStr = `109_${itemCodeNum.toString().padStart(5, "0")}`;
        if (returnItemsMap[codeStr] !== undefined) {
            return returnItemsMap[codeStr];
        }
        return "0";
    };

    const formatNum = (valStr: string) => {
        if (!valStr || valStr === "0" || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Excel Rows for the 9 categories:
    // Row 17: Net current liabilities
    // Row 20: Cash - local and foreign currency
    // Row 21: Deposits with NBE
    // Row 22: Deposits with other local & foreign banks
    // Row 23: Treasury bills
    // Row 24: Net due from Domestic banks*
    // Row 25: Net due from Foreign banks*
    // Row 26: Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6)
    // Row 27: Excess/deficit (2.7-1.2)
    const excelRowNumbers = [17, 20, 21, 22, 23, 24, 25, 26, 27];

    // Calculate totals for KPI cards (Weekly Average column = Col Index 7)
    const netCurrentLiabAvg = getItemValue(8);   // 109_00008
    const totalLiquidAssetsAvg = getItemValue(64); // 109_00064
    const excessDeficitAvg = getItemValue(72);     // 109_00072
    const nbeDepositsAvg = getItemValue(24);       // 109_00024

    let codeCounter = 1;
    const gridRows = ZS001_ROW_DESCRIPTIONS.map((desc, rowIndex) => {
        const rowExcelNum = excelRowNumbers[rowIndex];
        const rowItems = ZS001_COL_SUFFIXES.map((colSuffix, colIndex) => {
            const itemCodeNum = codeCounter++;
            const codeStr = `109_${itemCodeNum.toString().padStart(5, "0")}`;
            const val = getItemValue(itemCodeNum);

            // Col D is 4
            let colLetter = "";
            let c = colIndex + 4;
            while (c > 0) {
                let mod = (c - 1) % 26;
                colLetter = String.fromCharCode(65 + mod) + colLetter;
                c = Math.floor((c - mod) / 26);
            }
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
            desc,
            rowItems
        };
    });

    const filteredRows = gridRows.filter((r) =>
        r.desc.toLowerCase().includes(searchQuery.toLowerCase())
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
                                {reportData?.ReturnKey || "LSR-Statutory ZS001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Liquidity Requirement Report (ZS001)
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution: <span className="font-semibold text-dark dark:text-white">{reportData?.InstCode || "0000001"}</span> | 
                            Financial Year: <span className="font-semibold text-dark dark:text-white">{reportData?.FinYear || 2026}</span> | 
                            Period: <span className="font-semibold text-dark dark:text-white">{reportData?.StartDate?.split("T")[0] || "2026-08-20"} to {reportData?.EndDate?.split("T")[0] || "2026-08-26"}</span>
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
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                            ⬇️ Download Excel
                        </button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Net Current Liabilities
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(netCurrentLiabAvg)}
                        </div>
                        <span className="text-xs text-gray-500">Weekly Avg (Row 1)</span>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Total Liquid Assets
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalLiquidAssetsAvg)}
                        </div>
                        <span className="text-xs text-gray-500">Weekly Avg (Row 8)</span>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Deposits with NBE
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(nbeDepositsAvg)}
                        </div>
                        <span className="text-xs text-gray-500">Weekly Avg (Row 3)</span>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Excess / Deficit
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(excessDeficitAvg)}
                        </div>
                        <span className="text-xs text-gray-500">Weekly Avg (Row 9)</span>
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
                                {selectedCell ? formatNum(selectedCell.value) : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Search category rows..."
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
                                    <th className="w-12 border-r border-stroke py-1.5 dark:border-dark-3">B</th>
                                    <th className="min-w-[280px] border-r border-stroke py-1.5 text-left pl-3 dark:border-dark-3">C</th>
                                    {ZS001_COL_SUFFIXES.map((_, i) => {
                                        let colLetter = "";
                                        let c = i + 4; // Col D is 4
                                        while (c > 0) {
                                            let mod = (c - 1) % 26;
                                            colLetter = String.fromCharCode(65 + mod) + colLetter;
                                            c = Math.floor((c - mod) / 26);
                                        }
                                        return (
                                            <th key={i} className="min-w-[120px] border-r border-stroke py-1.5 dark:border-dark-3">
                                                {colLetter}
                                            </th>
                                        );
                                    })}
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">#</th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">Code</th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">Descriptions</th>
                                    {ZS001_COL_SUFFIXES.map((suffix, i) => (
                                        <th key={i} className="border-r border-stroke p-2 text-right dark:border-dark-3">
                                            {suffix}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => (
                                    <tr
                                        key={row.rowIndex}
                                        className={cn(
                                            "border-b border-stroke transition dark:border-dark-3",
                                            (row.rowIndex === 0 || row.rowIndex === 7 || row.rowIndex === 8)
                                                ? "bg-emerald-500/10 font-bold dark:bg-emerald-500/20 text-dark dark:text-white"
                                                : "hover:bg-gray-50 dark:hover:bg-dark-2/50"
                                        )}
                                    >
                                        <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                            {row.rowExcelNum}
                                        </td>

                                        <td className="border-r border-stroke p-2 text-center font-mono font-medium text-gray-700 dark:border-dark-3 dark:text-gray-300">
                                            {row.rowIndex + 1}
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
                                                    {formatNum(cell.val)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Raw JSON Viewer Tab */
                <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-dark dark:text-white">
                            Raw JSON Payload ({reportData?.ReturnItemsList?.length || 72} items)
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
