"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

const MR001_COL_SUFFIXES: string[] = [
    "S.No.",
    "Name of Depositor",
    "Demand/Current",
    "Saving",
    "Time/Fixed",
    "Days Left for Maturity",
    "Total per depositor"
];

const COL_LETTERS = ["C", "D", "E", "F", "G"];

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface DynamicItemsList {
    Area: string;
    _areaName: string;
    DynamicItems: ReturnItem[];
}

interface RowItem {
    A?: string;
    B?: string;
    C?: number;
    D?: number;
    E?: number;
    F?: number;
    G?: number;
}

interface MR001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
    DynamicItemsList?: DynamicItemsList[];
}

interface MR001ExcelViewProps {
    initialData?: MR001JsonData;
    activeFileName?: string;
}

export function MR001ExcelView({
    initialData,
    activeFileName
}: MR001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<MR001JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        colSuffix: string;
        value: string;
    } | null>({
        cellRef: "C17",
        code: "",
        rowDesc: "Addis Ababa",
        colSuffix: "Amount",
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
                    "Failed to fetch MR001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "MR001" };
        fetchData({ params: query });
    };

    useEffect(() => {
        if (!initialData || activeFileName) {
            fetchJsonData(activeFileName);
        }
    }, [activeFileName]);

    const returnItemsMap: Record<string, string> = {};
    const returnDynItemsMap: Record<number, RowItem> = {};
    if (reportData?.ReturnItemsList) {
        reportData.ReturnItemsList.forEach((item) => {
            returnItemsMap[item.Code] = item.Value;
        });
    }
    if (reportData?.DynamicItemsList?.[0]?.DynamicItems) {
        reportData.DynamicItemsList[0].DynamicItems.forEach((item) => {
            const cols = ["A", "B", "C", "D", "E", "F", "G"] as const;
            const row = parseInt(item.Code.split(".")?.[0]) - 1;
            const col = parseInt(item.Code.split(".")?.[1]) - 1;
            const colCode = cols[col];

            if (!returnDynItemsMap[row]) returnDynItemsMap[row] = {};
            if (colCode === "A" || colCode === "B") {
                returnDynItemsMap[row][colCode] = item.Value || "";
            } else {
                returnDynItemsMap[row][colCode] = parseFloat(item.Value) || 0;
            }
        });
        returnDynItemsMap[10] = {};
        returnDynItemsMap[10]["A"] = "";
        returnDynItemsMap[10]["B"] = "Sub total top ten (10)";
        returnDynItemsMap[10]["C"] = parseFloat(
            returnItemsMap["Sub total top ten (10)_Demand/Current"]
        );
        returnDynItemsMap[10]["D"] = parseFloat(
            returnItemsMap["Sub total top ten (10)_Saving"]
        );
        returnDynItemsMap[10]["E"] = parseFloat(
            returnItemsMap["Sub total top ten (10)_Time/Fixed"]
        );
        returnDynItemsMap[10]["F"] = parseFloat(returnItemsMap[""]);
        returnDynItemsMap[10]["G"] = parseFloat(
            returnItemsMap["Sub total top ten (10)_Total per depositor "]
        );
    }
    if (reportData?.DynamicItemsList?.[1]?.DynamicItems) {
        reportData.DynamicItemsList[1].DynamicItems.forEach((item) => {
            const cols = ["A", "B", "C", "D", "E", "F", "G"] as const;
            const row = parseInt(item.Code.split(".")?.[0]) - 1 + 11;
            const col = parseInt(item.Code.split(".")?.[1]) - 1;
            const colCode = cols[col];

            if (!returnDynItemsMap[row]) returnDynItemsMap[row] = {};
            if (colCode === "A" || colCode === "B") {
                returnDynItemsMap[row][colCode] = item.Value || "";
            } else {
                returnDynItemsMap[row][colCode] = parseFloat(item.Value) || 0;
            }
        });
        returnDynItemsMap[21] = {};
        returnDynItemsMap[21]["A"] = "";
        returnDynItemsMap[21]["B"] = "Grand total top twenty (20)";
        returnDynItemsMap[21]["C"] = parseFloat(
            returnItemsMap["Grand total top twenty (20)_Demand/Current"]
        );
        returnDynItemsMap[21]["D"] = parseFloat(
            returnItemsMap["Grand total top twenty (20)_Saving"]
        );
        returnDynItemsMap[21]["E"] = parseFloat(
            returnItemsMap["Grand total top twenty (20)_Time/Fixed"]
        );
        returnDynItemsMap[21]["F"] = parseFloat(returnItemsMap[""]);
        returnDynItemsMap[21]["G"] = parseFloat(
            returnItemsMap["Grand total top twenty (20)_Total per depositor"]
        );
    }

    const formatCurrency = (valStr: string) => {
        if (!valStr || valStr === "0" || valStr === "") return "-";
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    let lastRowInd = 0;
    const gridRows = Object.entries(returnDynItemsMap).map(([key, value]) => {
        const row = parseInt(key);
        const rowIndex = lastRowInd + row;
        const rowExcelNum = 16 + rowIndex;
        let rowDesc = "";
        const rowItems = Object.entries(value).map(([key, value], index) => {
            if (key === "B") rowDesc = value;

            return {
                itemCodeNum: 0,
                codeStr: "",
                colSuffix: MR001_COL_SUFFIXES[index],
                val: value,
                colLetter: key,
                cellRef: `${key}${rowExcelNum}`,
                rowIndex,
                colIndex: index
            };
        });
        return {
            rowIndex,
            rowExcelNum,
            code: row.toString(),
            desc: rowDesc,
            rowItems: rowItems
        };
    });

    const filteredRows = gridRows.filter(
        (r) =>
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
                                {reportData?.ReturnKey || "NBE_20_DEP_MR001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-xl font-bold text-dark dark:text-white">
                            Quartely Top Twenty (20) Depositors’ Report
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Institution:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.InstCode}
                            </span>{" "}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Financial Year:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.FinYear}
                            </span>{" "}
                            | Period:{" "}
                            <span className="font-semibold text-dark dark:text-white">
                                {reportData?.StartDate?.split("T")[0]} to{" "}
                                {reportData?.EndDate?.split("T")[0]}
                            </span>
                        </p>
                    </div>

                    {/* File Selector & Mode Switcher */}
                    <div className="flex flex-wrap items-center gap-3">
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
                                Code:{" "}
                                <span className="font-semibold text-primary">
                                    {selectedCell?.code || "-"}
                                </span>{" "}
                                |{" "}
                                {selectedCell
                                    ? `${selectedCell.rowDesc} (${selectedCell.colSuffix})`
                                    : "Click any cell to inspect"}{" "}
                                =
                            </span>
                            <span className="font-mono font-bold text-dark dark:text-white">
                                {selectedCell
                                    ? formatCurrency(selectedCell.value)
                                    : ""}
                            </span>
                        </div>

                        <div className="w-full lg:w-72">
                            <input
                                type="text"
                                placeholder="Search line items or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Interactive Excel Spreadsheet Grid */}
                    <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full border-collapse text-left text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stroke bg-gray-100 text-center font-mono text-[11px] font-semibold text-gray-600 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300">
                                    <th className="w-10 border-r border-stroke py-1.5 dark:border-dark-3"></th>
                                    <th className="w-16 border-r border-stroke py-1.5 dark:border-dark-3">
                                        A
                                    </th>
                                    <th className="min-w-[220px] border-r border-stroke py-1.5 pl-3 text-left dark:border-dark-3">
                                        B
                                    </th>
                                    {COL_LETTERS.map((col) => (
                                        <th
                                            className="min-w-[150px] border-r border-stroke py-1.5 pl-3 text-left dark:border-dark-3"
                                            key={col}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3"></th>
                                    <th
                                        className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"
                                        colSpan={3}
                                    >
                                        Type of Deposit
                                    </th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3"></th>
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">
                                        S.No.
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Name of Depositor
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Demand/Current
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Saving
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Time/Fixed
                                    </th>
                                    <th
                                        className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"
                                        rowSpan={2}
                                    >
                                        Days Left for Maturity
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Total per depositor
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => {
                                    const isHeader = false;
                                    const isTotalRow = [26, 37].includes(
                                        row.rowExcelNum
                                    );
                                    const isMismatchRow = false;

                                    return (
                                        <tr
                                            key={row.rowIndex}
                                            className={cn(
                                                "border-b border-stroke transition dark:border-dark-3",
                                                isHeader &&
                                                    "bg-emerald-500/10 font-bold text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300",
                                                isTotalRow &&
                                                    "bg-orange-100 font-bold text-dark dark:bg-dark-2 dark:text-white",
                                                isMismatchRow &&
                                                    "bg-amber-500/10 font-bold text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
                                                !isHeader &&
                                                    !isTotalRow &&
                                                    !isMismatchRow &&
                                                    "hover:bg-gray-50 dark:hover:bg-dark-2/50"
                                            )}
                                        >
                                            <td className="border-r border-stroke bg-gray-50 p-2 text-center font-mono text-[11px] font-semibold text-gray-500 dark:border-dark-3 dark:bg-dark-2">
                                                {row.rowExcelNum}
                                            </td>

                                            {row.rowItems.map((cell) => {
                                                const isSelected =
                                                    selectedCell?.cellRef ===
                                                    cell.cellRef;

                                                return (
                                                    <td
                                                        key={cell.colIndex}
                                                        onClick={() =>
                                                            setSelectedCell({
                                                                cellRef:
                                                                    cell.cellRef,
                                                                code: cell.codeStr,
                                                                rowDesc:
                                                                    row.desc,
                                                                colSuffix:
                                                                    cell.colSuffix,
                                                                value: cell.val
                                                            })
                                                        }
                                                        className={cn(
                                                            "cursor-pointer border-r border-stroke p-2 text-right font-mono transition dark:border-dark-3",
                                                            isSelected
                                                                ? "bg-emerald-500/20 font-bold text-emerald-900 ring-2 ring-emerald-500 ring-inset dark:text-emerald-200"
                                                                : "text-gray-800 dark:text-gray-200"
                                                        )}
                                                    >
                                                        {cell.colLetter === "A"
                                                            ? cell.val
                                                            : formatCurrency(
                                                                  cell.val
                                                              )}
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
                            Raw JSON Payload (
                            {reportData?.ReturnItemsList?.length || 336} items)
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
