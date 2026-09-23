"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

const NE001_COL_SUFFIXES: string[] = [
    "I. By Economic Sector",
    "Substandard Term loan",
    "Substandard O/D",
    "Doubtful Term loan",
    "Doubtful O/D",
    "Loss Term loan",
    "Loss O/D",
    "Total"
];

const NE001_ROW_DESCRIPTIONS: string[] = [
    "Agriculture",
    "Manufacturing",
    "Domestic Trade and Service",
    "International Trade & Service (4.1+4.2)",
    "Import",
    "Export",
    "Hotel and tourism",
    "Transport and communication",
    "Building & Construction",
    "Mines, power and water resource",
    "Consumer loans",
    "Inter-bank loans",
    "Loans to non-bank FIs",
    "Insider loans",
    "Other loans",
    "Total (Economic Sector)",
    "II. NPLs by Branch (Largest six branches by Amount)"
];

const ROW_CODES = [
    "1",
    "2",
    "3",
    "4",
    "4.1",
    "4.2",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "",
    ""
];

const COL_LETTERS = ["C", "D", "E", "F", "G", "H", "I"];

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
    B?: string;
    C?: number;
    D?: number;
    E?: number;
    F?: number;
    G?: number;
    H?: number;
    I?: number;
}

interface NE001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
    DynamicItemsList?: DynamicItemsList[];
}

interface NE001ExcelViewProps {
    initialData?: NE001JsonData;
    activeFileName?: string;
}

export function NE001ExcelView({
    initialData,
    activeFileName
}: NE001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<NE001JsonData | undefined>(
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
                    "Failed to fetch NE001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "NE001" };
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
            const cols = ["B", "C", "D", "E", "F", "G", "H", "I"] as const;
            const row = parseInt(item.Code.split(".")?.[0]) - 1;
            const col = parseInt(item.Code.split(".")?.[1]) - 1;
            const colCode = cols[col];

            if (!returnDynItemsMap[row]) returnDynItemsMap[row] = {};
            if (colCode === "B") {
                returnDynItemsMap[row][colCode] = item.Value || "";
            } else {
                returnDynItemsMap[row][colCode] = parseFloat(item.Value) || 0;
            }
        });
    }

    const getItemValue = (itemCodeNum: number): string => {
        const codeStr = `92_${itemCodeNum.toString().padStart(5, "0")}`;
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

    let codeCounter = 1;
    let lastRowInd = 0;
    const gridRows = NE001_ROW_DESCRIPTIONS.map((desc, rowIndex) => {
        lastRowInd = rowIndex;
        const code = ROW_CODES[rowIndex] || "";
        const rowExcelNum = 16 + rowIndex;
        const rowItems = NE001_COL_SUFFIXES.slice(1).map(
            (colSuffix, colIndex) => {
                const colLetter = COL_LETTERS[colIndex];
                const cellRef = `${colLetter}${rowExcelNum}`;

                const itemCodeNum = codeCounter++;
                const codeStr = `92_${itemCodeNum.toString().padStart(5, "0")}`;
                const val = getItemValue(itemCodeNum);

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
            }
        );

        return {
            rowIndex,
            rowExcelNum,
            code,
            desc,
            rowItems
        };
    }).concat(
        Object.entries(returnDynItemsMap).map(([key, value]) => {
            const row = parseInt(key);
            const rowIndex = lastRowInd + row + 1;
            const rowExcelNum = 16 + rowIndex;
            let rowDesc = "";
            const rowItems = Object.entries(value)
                .map(([key, value], index) => {
                    if (key === "B") rowDesc = value;

                    return {
                        itemCodeNum: 0,
                        codeStr: "",
                        colSuffix: NE001_COL_SUFFIXES[index],
                        val: value,
                        colLetter: key,
                        cellRef: `${key}${rowExcelNum}`,
                        rowIndex,
                        colIndex: index
                    };
                })
                .filter((item) => item.colLetter !== "B");
            return {
                rowIndex,
                rowExcelNum,
                code: (row + 1 < 7 ? row + 1 : "").toString(),
                desc: rowDesc,
                rowItems: rowItems
            };
        })
    );

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
                                {reportData?.ReturnKey || "BD_L&A_NE001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-xl font-bold text-dark dark:text-white">
                            BSD Quarterly NPLs Report by Economic Sector and
                            Branch
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
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">
                                        S.No.
                                    </th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3"></th>
                                    <th
                                        className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"
                                        colSpan={2}
                                    >
                                        Substandard
                                    </th>
                                    <th
                                        className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"
                                        colSpan={2}
                                    >
                                        Doubtful
                                    </th>
                                    <th
                                        className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"
                                        colSpan={2}
                                    >
                                        Loss
                                    </th>
                                    <th
                                        className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"
                                        colSpan={1}
                                    >
                                        Total
                                    </th>
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        I. By Economic Sector
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Term loan
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        O/D
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Term loan
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        O/D
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Term loan
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        O/D
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => {
                                    const isHeader = false;
                                    const isTotalRow = [19, 31, 39].includes(
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

                                            <td className="border-r border-stroke p-2 text-center font-mono font-medium text-gray-700 dark:border-dark-3 dark:text-gray-300">
                                                {row.code}
                                            </td>

                                            <td className="border-r border-stroke p-2 font-medium text-dark dark:border-dark-3 dark:text-white">
                                                {row.desc}
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
                                                        {formatCurrency(
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
