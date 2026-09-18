"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";
import { DS003_REGIONS, DS003_SUB_ROWS, DS003_METRIC_DESCRIPTIONS } from "@/utils/services/DS003/jsonFormat";

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface DS003JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface DS003ExcelViewProps {
    initialData?: DS003JsonData;
    activeFileName?: string;
}

export function DS003ExcelView({
    initialData,
    activeFileName
}: DS003ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<DS003JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        metricDesc: string;
        value: string;
    } | null>({
        cellRef: "C14",
        code: "DS003_33152",
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
                    "Failed to fetch DS003 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "DS003" };
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
                a.download = `${reportData.ReturnKey || "DS003"}_export.xlsx`;
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

    const getItemValue = (codeStr: string): string => {
        if (returnItemsMap[codeStr] !== undefined) {
            return returnItemsMap[codeStr];
        }
        return "0";
    };

    const formatNum = (valStr: string, isInteger: boolean = false) => {
        if (!valStr || valStr === "0" || valStr === "") return "-";
        const num = parseFloat(valStr.replace(/,/g, ""));
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: isInteger ? 0 : 2,
            maximumFractionDigits: isInteger ? 0 : 2
        });
    };

    // Calculate Summary Cards
    const addisTotalAmt = getItemValue("DS003_33167");
    const addisTotalDep = getItemValue("DS003_33168");
    const addisTotalAcc = getItemValue("DS003_33169");

    let totalDepositAmtAll = 0;
    let codeStart = 33152;

    DS003_REGIONS.forEach((_, regIdx) => {
        const headTotalAmtCode = `DS003_${codeStart + regIdx * 108 + 15}`;
        const amtVal = parseFloat((getItemValue(headTotalAmtCode) || "0").replace(/,/g, ""));
        if (!isNaN(amtVal)) totalDepositAmtAll += amtVal;
    });

    // Build Table Grid Data
    let globalCodeCounter = 33152;
    let excelRowIndex = 14;

    const tableRows: Array<{
        region: string;
        subRowLabel: string;
        isHeadRow: boolean;
        excelRow: number;
        items: Array<{
            code: string;
            val: string;
            colLetter: string;
            cellRef: string;
            desc: string;
            isInteger: boolean;
        }>;
    }> = [];

    DS003_REGIONS.forEach((regName) => {
        DS003_SUB_ROWS.forEach((subRow) => {
            const isHeadRow = subRow === "";
            const subRowLabel = isHeadRow ? regName : `${regName} (${subRow.replace("_", "")})`;

            const items: Array<{
                code: string;
                val: string;
                colLetter: string;
                cellRef: string;
                desc: string;
                isInteger: boolean;
            }> = [];

            DS003_METRIC_DESCRIPTIONS.forEach((metricDesc, colIdx) => {
                const codeStr = `DS003_${globalCodeCounter}`;
                globalCodeCounter++;

                const val = getItemValue(codeStr);
                const colLetter = String.fromCharCode(67 + colIdx); // Col C starts at 67
                const cellRef = `${colLetter}${excelRowIndex}`;
                const isInteger = colIdx % 3 !== 0;

                items.push({
                    code: codeStr,
                    val,
                    colLetter,
                    cellRef,
                    desc: metricDesc,
                    isInteger
                });
            });

            tableRows.push({
                region: regName,
                subRowLabel,
                isHeadRow,
                excelRow: excelRowIndex,
                items
            });

            excelRowIndex++;
        });
    });

    const filteredRows = tableRows.filter((r) => {
        const matchesRegion = selectedRegionFilter === "ALL" || r.region === selectedRegionFilter;
        const matchesQuery = r.subRowLabel.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRegion && matchesQuery;
    });

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
                                {reportData?.ReturnKey || "DEP_SEC&REG_DS003"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-dark dark:text-white">
                            Deposit by Sector and Region (DS003)
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.InstCode || "0000001"}
                            </span>{" "}
                            | Financial Year:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.FinYear || 2026}
                            </span>{" "}
                            | Period:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.StartDate?.split("T")[0] ||
                                    "2026-04-01"}{" "}
                                to{" "}
                                {reportData?.EndDate?.split("T")[0] ||
                                    "2026-06-30"}
                            </span>
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
                                className="rounded-lg border border-stroke bg-gray-50 px-3 py-2 text-xs font-medium text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
                        <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                            Total Deposit (All Regions)
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(String(totalDepositAmtAll))}
                        </div>
                        <span className="text-xs text-gray-500">
                            Sum of Regional Totals
                        </span>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
                        <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                            Addis Ababa Total Amount
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(addisTotalAmt)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Code: DS003_33167
                        </span>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-500/30">
                        <span className="text-xs font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                            Addis Ababa # of Depositors
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(addisTotalDep, true)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Code: DS003_33168
                        </span>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/30">
                        <span className="text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                            Addis Ababa # of Accounts
                        </span>
                        <div className="mt-1 text-xl font-bold text-dark dark:text-white">
                            {formatNum(addisTotalAcc, true)}
                        </div>
                        <span className="text-xs text-gray-500">
                            Code: DS003_33169
                        </span>
                    </div>
                </div>
            </div>

            {viewTab === "grid" ? (
                <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                    {/* Excel Formula Bar, Region Filter & Search */}
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 items-center gap-2 rounded-md border border-stroke bg-gray-50 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-2">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {selectedCell ? selectedCell.cellRef : "Cell"}
                            </span>
                            <span className="text-gray-400">fx</span>
                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                Code:{" "}
                                <span className="font-semibold text-primary">
                                    {selectedCell?.code || "-"}
                                </span>{" "}
                                |{" "}
                                {selectedCell
                                    ? `${selectedCell.rowDesc} - ${selectedCell.metricDesc}`
                                    : "Click any cell to inspect"}{" "}
                                =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell
                                    ? formatNum(selectedCell.value)
                                    : ""}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <select
                                value={selectedRegionFilter}
                                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                                className="rounded-md border border-stroke bg-transparent px-3 py-2 text-xs font-medium text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            >
                                <option value="ALL">🌍 All Regions (14)</option>
                                {DS003_REGIONS.map((reg) => (
                                    <option key={reg} value={reg}>
                                        📍 {reg}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Search sub-row labels..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full lg:w-64 rounded-md border border-stroke bg-transparent px-3 py-2 text-xs text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Excel Spreadsheet Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-100 text-center font-mono text-[11px] font-semibold text-gray-600 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300">
                                    <th className="w-10 border-r border-stroke py-1.5 dark:border-dark-3"></th>
                                    <th className="min-w-[180px] border-r border-stroke py-1.5 text-left pl-3 dark:border-dark-3">
                                        B
                                    </th>
                                    {["C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"].map((letter) => (
                                        <th key={letter} className="min-w-[110px] border-r border-stroke py-1.5 dark:border-dark-3">
                                            {letter}
                                        </th>
                                    ))}
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3" rowSpan={2}>
                                        #
                                    </th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3" rowSpan={2}>
                                        Region / Category
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3" colSpan={3}>
                                        Pub. Enterprise
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3" colSpan={3}>
                                        Private &amp; Coop.
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3" colSpan={3}>
                                        Regional Gov.
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3" colSpan={3}>
                                        Banks
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3" colSpan={3}>
                                        Others
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3" colSpan={3}>
                                        Total
                                    </th>
                                </tr>

                                <tr className="border-b border-stroke bg-gray-150 font-semibold text-dark text-right text-[11px] dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                                    {[1,2,3,4,5,6].map((secIdx) => (
                                        <React.Fragment key={secIdx}>
                                            <th className="border-r border-stroke p-1.5 dark:border-dark-3">Amount</th>
                                            <th className="border-r border-stroke p-1.5 dark:border-dark-3">Depositors</th>
                                            <th className="border-r border-stroke p-1.5 dark:border-dark-3">Accounts</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => (
                                    <tr
                                        key={`${row.region}_${row.excelRow}`}
                                        className={cn(
                                            "border-b border-stroke transition dark:border-dark-3",
                                            row.isHeadRow
                                                ? "bg-emerald-500/10 font-bold text-dark dark:bg-emerald-500/20 dark:text-white"
                                                : "hover:bg-gray-50 dark:hover:bg-dark-2/50"
                                        )}
                                    >
                                        <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                            {row.excelRow}
                                        </td>

                                        <td className="border-r border-stroke p-2 font-medium text-dark dark:border-dark-3 dark:text-white">
                                            {row.subRowLabel}
                                        </td>

                                        {row.items.map((item) => {
                                            const isSelected = selectedCell?.code === item.code;

                                            return (
                                                <td
                                                    key={item.code}
                                                    onClick={() =>
                                                        setSelectedCell({
                                                            cellRef: item.cellRef,
                                                            code: item.code,
                                                            rowDesc: row.subRowLabel,
                                                            metricDesc: item.desc,
                                                            value: item.val
                                                        })
                                                    }
                                                    className={cn(
                                                        "cursor-pointer border-r border-stroke p-2 text-right font-mono transition dark:border-dark-3",
                                                        isSelected
                                                            ? "bg-emerald-500/20 font-bold text-emerald-900 ring-2 ring-emerald-500 ring-inset dark:text-emerald-200"
                                                            : "text-gray-800 dark:text-gray-200"
                                                    )}
                                                >
                                                    {formatNum(item.val, item.isInteger)}
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
                            Raw JSON Payload (
                            {reportData?.ReturnItemsList?.length || 1512} items)
                        </h2>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    JSON.stringify(reportData, null, 4)
                                );
                            }}
                            className="hover:bg-opacity-90 rounded bg-primary px-3 py-1.5 text-xs font-medium text-white transition"
                        >
                            📋 Copy JSON
                        </button>
                    </div>
                    <pre className="max-h-[600px] overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-emerald-400">
                        {JSON.stringify(reportData, null, 4)}
                    </pre>
                </div>
            )}
        </div>
    );
}
