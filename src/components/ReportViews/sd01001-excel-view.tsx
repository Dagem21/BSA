"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

const SD01001_COL_SUFFIXES: string[] = [
    "Current Quarter \nNumber of Depositors",
    "Current Quarter \nAmount of Deposits"
];

const SD01001_ROW_DESCRIPTIONS: string[] = [
    "Total deposits",
    "Total uninsured deposits (Sum 2.1 to 2.9):",
    "Deposits of financial institutions kept in the bank",
    "Deposits of Federal Government and its Agencies",
    "Deposits of the current external auditors (including its partners) of the bank",
    "Deposits held as collateral by the bank for the loan granted to the depositors",
    "Deposits of Influential Shareholders, Directors, Chief Executive Officer, and Senior Executive Officers of the bank",
    "Deposits of family members of Influential Shareholders, Directors, Chief Executive Officer, and senior Executive Officers of the bank",
    "Deposits of legal entities owned by Influential Shareholders, Directors, Chief Executive Officer, and Senior Executive Officers of the bank",
    "Deposits of legal entity owned by family members of Influential shareholders, Directors, Chief Executive Officer, and Senior Executive Officers",
    "Deposits frozen by the court decision",
    "Total insured deposits (No.1 minus No.2)",
    "Total insured deposits having balances ≤ Birr 100,000 (Sum 3.1.1 and 3.1.2)",
    "Total insured conventional deposits having balances ≤ Birr 100,000",
    "Total insured interest-free deposits having balances ≤ Birr 100,000",
    "Total insured deposits having balances > Birr 100,000 (Sum 3.2.1 and 3.2.2)",
    "Total insured conventional deposits having balances > Birr 100,000",
    "Total insured interest-free deposits having balances > Birr 100,000"
];

const ROW_CODES = [
    "1",
    "2",
    "2.1",
    "2.2",
    "2.3",
    "2.4",
    "2.5",
    "2.6",
    "2.7",
    "2.8",
    "2.9",
    "3",
    "3.1",
    "3.1.1",
    "3.1.2",
    "3.2",
    "3.2.1",
    "3.2.2"
];

const COL_LETTERS = ["C", "D"];

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface SD01001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface SD01001ExcelViewProps {
    initialData?: SD01001JsonData;
    activeFileName?: string;
}

export function SD01001ExcelView({
    initialData,
    activeFileName
}: SD01001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<SD01001JsonData | undefined>(
        initialData
    );

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        rowDesc: string;
        colSuffix: string;
        value: string;
    } | null>({
        cellRef: "C16",
        code: "",
        rowDesc: "",
        colSuffix: "",
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
                    "Failed to fetch SD01001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "SD01001" };
        fetchData({ params: query });
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

    const getItemValue = (identifier: string): string => {
        if (returnItemsMap[identifier] !== undefined) {
            return returnItemsMap[identifier];
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
    const gridRows = SD01001_ROW_DESCRIPTIONS.map((desc, rowIndex) => {
        const code = ROW_CODES[rowIndex] || "";
        const rowExcelNum = 15 + rowIndex;
        const rowItems = SD01001_COL_SUFFIXES.map((colSuffix, colIndex) => {
            const colLetter = COL_LETTERS[colIndex];
            const cellRef = `${colLetter}${rowExcelNum}`;

            const itemCodeNum = codeCounter++;
            const identifier = `SD01001_${itemCodeNum.toString().padStart(5, "0")}`;
            const val = getItemValue(identifier);

            return {
                itemCodeNum,
                identifier,
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
                                {reportData?.ReturnKey || "BD_L&A_SD01001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-xl font-bold text-dark dark:text-white">
                            Loan and Advances Portfolio Report
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
                                    <th className="min-w-[200px] border-r border-stroke py-1.5 pl-3 text-left dark:border-dark-3">
                                        C
                                    </th>
                                    <th className="min-w-[200px] border-r border-stroke py-1.5 pl-3 text-left dark:border-dark-3">
                                        D
                                    </th>
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">
                                        S.No.
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">
                                        {SD01001_COL_SUFFIXES[0]}
                                    </th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">
                                        {SD01001_COL_SUFFIXES[1]}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => {
                                    const isHeader = [""].includes(row.code);
                                    const isTotalRow = row.code === "";
                                    const isMismatchRow = row.code === "";

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
                                                                code: cell.identifier,
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
