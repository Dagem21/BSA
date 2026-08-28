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

interface AreaItem {
    Area: number;
    _areaName: string;
    DynamicItems: DynamicItem[];
}

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
}

interface OL001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
    DynamicItemsList?: AreaItem[];
}

interface OL001ExcelViewProps {
    initialData?: OL001JsonData;
    activeFileName?: string;
}

const COL_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export function OL001ExcelView({ initialData, activeFileName }: OL001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<OL001JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        colName: string;
        value: string;
    } | null>({
        cellRef: "B16",
        code: "1.1",
        colName: "Name of Borrower",
        value: "-"
    });

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=OL001";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
            }
        } catch (e) {
            console.error("Failed to fetch OL001 JSON view:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            fetchJsonData(activeFileName);
        }
    }, [activeFileName]);

    const formatNum = (valStr: string) => {
        if (!valStr || valStr === "0" || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const getReturnItemValue = (code: string) => {
        const item = reportData?.ReturnItemsList?.find((i) => i.Code === code);
        return item?.Value || "0";
    };

    // Extract dynamic rows
    const areaItems = reportData?.DynamicItemsList || [];
    const borrowerRows = areaItems.map((area, idx) => {
        const map: Record<string, string> = {};
        area.DynamicItems?.forEach((di) => {
            map[di.Code] = di.Value;
        });

        return {
            sNo: idx + 1,
            rowExcelNum: 16 + idx,
            borrowerName: map["1.1"] || "",
            principal: map["1.2"] || "0",
            interest: map["1.3"] || "0",
            collateralType: map["1.4"] || "",
            askedPrice: map["1.5"] || "0",
            highestBid: map["1.6"] || "0",
            avgMarketVal: map["1.7"] || "0",
            dateAcquired: map["1.8"] || "",
            dateReevaluated: map["1.9"] || "",
            expenses: map["1.10"] || "0",
            netMarketVal: map["1.11"] || "0"
        };
    });

    const filteredRows = borrowerRows.filter((r) =>
        r.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.collateralType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Totals from ReturnItemsList
    const totalPrincipal = getReturnItemValue("95_00001");
    const totalInterest = getReturnItemValue("95_00002");
    const totalAskedPrice = getReturnItemValue("95_00003");
    const totalHighestBid = getReturnItemValue("95_00004");
    const totalAvgMarketVal = getReturnItemValue("95_00005");
    const totalExpenses = getReturnItemValue("95_00006");
    const totalNetMarketVal = getReturnItemValue("95_00007");

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
                            <span className="rounded bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                {reportData?.ReturnKey || "COL_ACQ_18M_OL001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Collateralized Properties Acquired Last 18 Months (OL001)
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

                {/* Summary KPI Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Total Acquired Principal
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalPrincipal)}
                        </div>
                        <span className="text-xs text-gray-500">Code: 95_00001</span>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Total Acquired Interest
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalInterest)}
                        </div>
                        <span className="text-xs text-gray-500">Code: 95_00002</span>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Average Market Value
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalAvgMarketVal)}
                        </div>
                        <span className="text-xs text-gray-500">Code: 95_00005</span>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Net Market Value
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(totalNetMarketVal)}
                        </div>
                        <span className="text-xs text-gray-500">Code: 95_00007</span>
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
                                {selectedCell ? selectedCell.colName : "Click cell to inspect"} =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell ? selectedCell.value : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Search borrower or collateral..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Excel Table Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-100 text-center font-mono text-[11px] font-semibold text-gray-600 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300">
                                    <th className="w-10 border-r border-stroke py-1.5 dark:border-dark-3"></th>
                                    {COL_LETTERS.map((letter) => (
                                        <th key={letter} className="min-w-[130px] border-r border-stroke py-1.5 dark:border-dark-3">
                                            {letter}
                                        </th>
                                    ))}
                                </tr>
                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">S.No</th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">Name of Borrower</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Principal (A)</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Interest (A)</th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">Collateral Type</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Asked Price (B)</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Highest Bid (C)</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Avg Mkt Value (D)</th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">Date Acquired</th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">Date Re-eval</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Expenses (E)</th>
                                    <th className="border-r border-stroke p-2 text-right dark:border-dark-3">Net Mkt Value (F)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => (
                                    <tr key={row.sNo} className="border-b border-stroke hover:bg-gray-50 transition dark:border-dark-3 dark:hover:bg-dark-2/50">
                                        <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                            {row.sNo}
                                        </td>

                                        {/* Borrower Name */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `B${row.rowExcelNum}`,
                                                    code: "1.1",
                                                    colName: "Name of Borrower",
                                                    value: row.borrowerName
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 font-medium text-dark cursor-pointer dark:border-dark-3 dark:text-white",
                                                selectedCell?.cellRef === `B${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {row.borrowerName}
                                        </td>

                                        {/* Principal */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `C${row.rowExcelNum}`,
                                                    code: "1.2",
                                                    colName: "Outstanding Balance Principal",
                                                    value: formatNum(row.principal)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `C${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.principal)}
                                        </td>

                                        {/* Interest */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `D${row.rowExcelNum}`,
                                                    code: "1.3",
                                                    colName: "Outstanding Balance Interest",
                                                    value: formatNum(row.interest)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `D${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.interest)}
                                        </td>

                                        {/* Collateral Type */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `E${row.rowExcelNum}`,
                                                    code: "1.4",
                                                    colName: "Type of Collateral",
                                                    value: row.collateralType
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `E${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {row.collateralType}
                                        </td>

                                        {/* Asked Price */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `F${row.rowExcelNum}`,
                                                    code: "1.5",
                                                    colName: "Asked / reserve Price",
                                                    value: formatNum(row.askedPrice)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `F${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.askedPrice)}
                                        </td>

                                        {/* Highest Bid */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `G${row.rowExcelNum}`,
                                                    code: "1.6",
                                                    colName: "Highest offered bid amount",
                                                    value: formatNum(row.highestBid)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `G${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.highestBid)}
                                        </td>

                                        {/* Avg Market Value */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `H${row.rowExcelNum}`,
                                                    code: "1.7",
                                                    colName: "Average Market Value",
                                                    value: formatNum(row.avgMarketVal)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `H${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.avgMarketVal)}
                                        </td>

                                        {/* Date Acquired */}
                                        <td className="border-r border-stroke p-2 text-center font-mono dark:border-dark-3">
                                            {row.dateAcquired || "-"}
                                        </td>

                                        {/* Date Re-evaluated */}
                                        <td className="border-r border-stroke p-2 text-center font-mono dark:border-dark-3">
                                            {row.dateReevaluated || "-"}
                                        </td>

                                        {/* Expenses */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `K${row.rowExcelNum}`,
                                                    code: "1.10",
                                                    colName: "Expenses related to acquisition",
                                                    value: formatNum(row.expenses)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `K${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.expenses)}
                                        </td>

                                        {/* Net Market Value */}
                                        <td
                                            onClick={() =>
                                                setSelectedCell({
                                                    cellRef: `L${row.rowExcelNum}`,
                                                    code: "1.11",
                                                    colName: "Net Market Value",
                                                    value: formatNum(row.netMarketVal)
                                                })
                                            }
                                            className={cn(
                                                "border-r border-stroke p-2 text-right font-mono cursor-pointer dark:border-dark-3",
                                                selectedCell?.cellRef === `L${row.rowExcelNum}` && "ring-2 ring-emerald-500 ring-inset bg-emerald-500/20 font-bold"
                                            )}
                                        >
                                            {formatNum(row.netMarketVal)}
                                        </td>
                                    </tr>
                                ))}

                                {/* Totals Summary Row (Row 166) */}
                                <tr className="border-t-2 border-stroke bg-gray-100 font-bold text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                                    <td className="border-r border-stroke p-2 text-center font-mono text-[11px] text-gray-500 dark:border-dark-3">
                                        166
                                    </td>
                                    <td className="border-r border-stroke p-2 uppercase dark:border-dark-3">
                                        Total
                                    </td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalPrincipal)}
                                    </td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalInterest)}
                                    </td>
                                    <td className="border-r border-stroke p-2 dark:border-dark-3">-</td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalAskedPrice)}
                                    </td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalHighestBid)}
                                    </td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalAvgMarketVal)}
                                    </td>
                                    <td className="border-r border-stroke p-2 text-center dark:border-dark-3">-</td>
                                    <td className="border-r border-stroke p-2 text-center dark:border-dark-3">-</td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalExpenses)}
                                    </td>
                                    <td className="border-r border-stroke p-2 text-right font-mono dark:border-dark-3">
                                        {formatNum(totalNetMarketVal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Raw JSON Viewer Tab */
                <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-dark dark:text-white">
                            Raw JSON Payload ({borrowerRows.length} Dynamic Items)
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
