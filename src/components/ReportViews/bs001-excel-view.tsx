"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";

const codeIndex = [
    "1_00001",
    "1_00002",
    "1_00003",
    "1_00004",
    "1_00005",
    "1_00006",
    "1_00007",
    "1_00008",
    "1_00009",
    "1_00010",
    "1_00011",
    "1_00012",
    "1_00013",
    "1_00014",
    "1_00015",
    "1_00016",
    "1_00017",
    "1_00018",
    "1_00019",
    "1_00020",
    "1_00021",
    "1_00022",
    "1_00023",
    "1_00024",
    "1_00025",
    "1_00026",
    "1_00027",
    "1_00028",
    "1_00029",
    "1_00030",
    "1_00031",
    "1_00032",
    "1_00033",
    "1_00034",
    "1_00035",
    "1_00036",
    "1_00037",
    "1_00038",
    "1_00039",
    "1_00040",
    "1_00041",
    "1_00042",
    "1_00043",
    "1_00044",
    "1_00045",
    "1_00046",
    "1_00047",
    "1_00048",
    "1_00049",
    "1_00050",
    "1_00051",
    "1_00052",
    "1_00053",
    "1_00054",
    "1_00055",
    "1_00056",
    "1_00057",
    "1_00058",
    "1_00059",
    "1_00060",
    "1_00061",
    "1_00062",
    "1_00063",
    "1_00064",
    "1_00065",
    "1_00066",
    "1_00067",
    "1_00068",
    "1_00069",
    "1_00070",
    "1_00071",
    "1_00072",
    "1_00073",
    "1_00074",
    "1_00075",
    "1_00076",
    "1_00077",
    "1_00078",
    "1_00079",
    "1_00080",
    "1_00081",
    "1_00082",
    "1_00083",
    "1_00084",
    "1_00085",
    "1_00086",
    "1_00087",
    "1_00088",
    "1_00089",
    "1_00090",
    "1_00091",
    "1_00092",
    "1_00093",
    "1_00094",
    "1_00095",
    "1_00096",
    "1_00097",
    "1_00098",
    "1_00099",
    "1_00100",
    "1_00101",
    "1_00102",
    "1_00103",
    "1_00104",
    "1_00105",
    "1_00106",
    "1_00107",
    "1_00108",
    "1_00109",
    "1_00110",
    "1_00111",
    "1_00112",
    "1_00113",
    "1_00114",
    "1_00115",
    "1_00116",
    "1_00117",
    "1_00118",
    "1_00119",
    "1_00120",
    "1_00121",
    "1_00122",
    "1_00123",
    "1_00124",
    "1_00125",
    "1_00126",
    "1_00127",
    "1_00128",
    "1_00129",
    "1_00130",
    "1_00131",
    "1_00132",
    "1_00133",
    "1_00134",
    "1_00135",
    "1_00151",
    "1_00136",
    "1_00137",
    "1_00138",
    "1_00139",
    "1_00140",
    "1_00141",
    "1_00142",
    "1_00143",
    "1_00144",
    "1_00145",
    "1_00146",
    "1_00147",
    "1_00148",
    "1_00149",
    "1_00150"
];

const BS001_COL_SUFFIXES: string[] = ["Amount"];

const BS001_ROW_DESCRIPTIONS: string[] = [
    "ASSETS",
    "Financial Assets (Sum 2 -6)",
    "CASH ON HAND (2.1+2.2)",
    "Foreign currency",
    "Local currency",
    "DEPOSITS WITH BANKS (3.1+3.2+3.3)",
    "Deposits with NBE(sum 3.1.1-3.1.4)",
    "Reserve account ",
    "Payment and settlement  account",
    "Cash issue account",
    "Other ",
    "Domestic banks deposits (3.2.1+3.2.2)",
    "Interest bearing ",
    "Non-interest bearing",
    "Foreign banks deposits(3.3.1+3.3.2)",
    "Interest bearing ",
    "Non-interest bearing",
    "INVESTMENTS (4.1+4.2)",
    "Short-term Investments(sum 4.1.1-4.1.3)",
    "Treasury bills",
    "Discount on short-term securities ",
    "Other short-term securities",
    "Long-term Investments (4.2.1 + 4.2.2)",
    "Securities (sum 4.2.1.1 - 4.2.1.5) ",
    "NBE bills",
    "DBE Bonds",
    "Bonds (sum 4.2.1.3.1-4.2.1.3.3)",
    "Federal government",
    "Regional government",
    "Corporate Bonds",
    "Discount on other long-term securities",
    "Other long-term securities",
    "Equity participation (4.2.2.1 + 4.2.2.2) ",
    "Local (sum 4.2.2.1.1-4.2.2.1.4)",
    "In Affiliated institutions",
    "In banks",
    "In non bank financial institutions",
    "In other sectors",
    "Foreign ",
    "LOANS AND ADVANCES (NET)(5.1-5.2)",
    "Total Loans & Advances (5.1.1+5.1.2+5.1.3)",
    " Inter bank loans (5.1.1.1+5.1.1.2)",
    "Commercial banks",
    "Development bank ",
    "Non-inter bank loans (sum 5.1.2.1-5.1.2.8)",
    "NBE",
    "Federal government",
    "Regional government",
    "Public entreprises",
    "Cooperatives",
    "Private sector",
    "Loans & advances in litigation ",
    "Others ",
    "Non bank Financial Institution",
    "Provisions for loans and advances (5.2.1+5.2.2)",
    "Provisions for performing loans and advances",
    "Specific provisions for loan losses",
    "OTHER FINANCIAL ASSETS (Net)  [(sum 6.1-6.4) -(6.5)]",
    "Sundry debtors",
    "Suspense accounts",
    "Un-cleared effects (6.3.1+6.3.2)",
    "Foreign  ",
    "Local",
    "Other accounts(6.4.1+6.4.2)",
    "Customers’ liabilities for L/C & acceptances as per contra",
    "Other ",
    "Provisions for other financial assets ",
    "NON-FINANCIAL ASSETS (Sum 8-11)",
    "FIXED ASSETS (Net)  (8.1– 8.2) ",
    "Gross fixed assets (sum 8.1.1- 8.1.5)",
    "Premises",
    "Vehicles",
    "Furniture & fittings",
    "Office & other equipments",
    "Other properties ",
    "Accumulated depreciation",
    "SUPPLIES STOCK ACCOUNT",
    "OTHER NON-FINANCIAL ASSETS",
    "INTANGIBLE  ASSET(Net) [(11.1+11.2)-(11.3)]",
    "Software",
    "Other ",
    "Accumulated Amortization",
    "TOTAL ASSETS (1+7)",
    "LIABILITIES & CAPITAL ",
    "LIABILITIES (sum 14-20)",
    "TOTAL DEPOSITS (sum 14.1-14.3)",
    "Demand/current deposits (sum 14.1.1-14.1.14)",
    "Federal  government",
    "Regional government",
    "Public enterprises",
    "Domestic banks",
    "Non-bank financial institutuions",
    "Pension fund",
    "Cooperatives & associations",
    "Private   sector",
    "Foreign banks",
    "N/R - foreign currency account",
    "N/R - transferable birr account",
    "N/ R - non-transferable birr a/c",
    "Resident foreign currency  a/c",
    "FCY retention a/c 'A' & 'B'",
    "Savings deposits (sum 14.2.1-14.2.7)",
    "Government",
    "Public enterprises",
    "Domestic banks",
    "Non-bank financial institutions ",
    "Pension fund",
    "Cooperatives & associations",
    "Private sector",
    "Time/fixed (sum 14.3.1-14.3.7)",
    "Government",
    "Public enterprises",
    "Domestic banks",
    "Non-bank financial institutions ",
    "Pension fund",
    "Cooperatives & associations",
    "Private  sector",
    "BORROWINGS (15.1+15.2)",
    "Local (sum 15.1.1-15.1.3)",
    "Short term (sum 15.1.1.1-15.1.1.3)",
    "NBE",
    "Banks",
    "Non bank",
    "Medium term (sum 15.1.2.1-15.1.2.3)",
    "NBE",
    "Banks",
    "Non bank",
    "Long term (sum 15.1.3.1-15.1.3.3)",
    "NBE",
    "Banks",
    "Non bank",
    "Foreign borrowings(sum 15.2.1-15.2.3)",
    "Short term",
    "Medium term",
    "Long term",
    "DEBT SECURITIES ISSUED ",
    "State dividend payable",
    "SUNDRY CREDITORS",
    "Provision for taxation & other",
    "OTHER ACCOUNTS (sum 20.1-20.3)",
    "L/C margin held ",
    "Bank’s liabilities for L/C & acceptances as per  contra ",
    "Others ",
    "CAPITAL & RESER. A/C (sum 21.1-21.5)",
    "Paid up capital",
    "Shares premium",
    "Legal reserves",
    "General reserves",
    "Retained Earnings",
    "Provisional profit/loss A/C ",
    "Net Worth (21+21.6)",
    "TOTAL LIABILITIES AND NET WORTH (=13+22)"
];

const ROW_CODES = [
    "",
    "1",
    "2",
    "2.1",
    "2.2",
    "3",
    "3.1",
    "3.1.1",
    "3.1.2",
    "3.1.3",
    "3.1.4 ",
    "3.2",
    "3.2.1",
    "3.2.2",
    "3.3",
    "3.3.1",
    "3.3.2",
    "4",
    "4.1",
    "4.1.1",
    "4.1.2",
    "4.1.3",
    "4.2",
    "4.2.1",
    "4.2.1.1",
    "4.2.1.2",
    "4.2.1.3",
    "4.2.1.3.1",
    "4.2.1.3.2",
    "4.2.1.3.3",
    "4.2.1.4",
    "4.2.1.5",
    "4.2.2",
    "4.2.2.1",
    "4.2.2.1.1",
    "4.2.2.1.2",
    "4.2.2.1.3",
    "4.2.2.1.4",
    "4.2.2.2",
    "5",
    "5.1",
    "5.1.1",
    "5.1.1.1",
    "5.1.1.2",
    "5.1.2",
    "5.1.2.1",
    "5.1.2.2",
    "5.1.2.3",
    "5.1.2.4",
    "5.1.2.5",
    "5.1.2.6",
    "5.1.2.7",
    "5.1.2.8",
    "5.1.3",
    "5.2",
    "5.2.1",
    "5.2.2",
    "6",
    "6.1",
    "6.2",
    "6.3",
    "6.3.1",
    "6.3.2",
    "6.4",
    "6.4.1",
    "6.4.2",
    "6.5",
    "7",
    "8",
    "8.1",
    "8.1.1",
    "8.1.2",
    "8.1.3",
    "8.1.4",
    "8.1.5",
    "8.2",
    "9",
    "10",
    "11",
    "11.1",
    "11.2",
    "11.3",
    "12",
    "",
    "13",
    "14",
    "14.1",
    "14.1.1",
    "14.1.2",
    "14.1.3",
    "14.1.4",
    "14.1.5",
    "14.1.6",
    "14.1.7",
    "14.1.8",
    "14.1.9",
    "14.1.10",
    "14.1.11",
    "14.1.12",
    "14.1.13",
    "14.1.14",
    "14.2",
    "14.2.1",
    "14.2.2",
    "14.2.3",
    "14.2.4",
    "14.2.5",
    "14.2.6",
    "14.2.7",
    "14.3",
    "14.3.1",
    "14.3.2",
    "14.3.3",
    "14.3.4",
    "14.3.5",
    "14.3.6",
    "14.3.7",
    "15",
    "15.1",
    "15.1.1",
    "15.1.1.1",
    "15.1.1.2",
    "15.1.1.3",
    "15.1.2",
    "15.1.2.1",
    "15.1.2.2",
    "15.1.2.3",
    "15.1.3",
    "15.1.3.1",
    "15.1.3.2",
    "15.1.3.3",
    "15.2",
    "15.2.1",
    "15.2.2",
    "15.2.3",
    "16",
    "17",
    "18",
    "19",
    "20",
    "20.1",
    "20.2",
    "20.3",
    "21",
    "21.1",
    "21.2",
    "21.3",
    "21.4",
    "21.5",
    "20.6",
    "22",
    ""
];

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface BS001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface BS001ExcelViewProps {
    initialData?: BS001JsonData;
    activeFileName?: string;
}

export function BS001ExcelView({
    initialData,
    activeFileName
}: BS001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(
        activeFileName || ""
    );
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<BS001JsonData | undefined>(
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
        code: "1_00001",
        rowDesc: "ASSETS",
        colSuffix: "Current Month",
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
                    "Failed to fetch BS001 JSON view"
            );
        }
    }, [data, isLoading, errors]);

    const fetchJsonData = async (fileName?: string) => {
        const query = fileName
            ? { filename: encodeURIComponent(fileName) }
            : { type: "BS001" };
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

    const getItemValue = (codeStr: string): string => {
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
    const gridRows = BS001_ROW_DESCRIPTIONS.map((desc, rowIndex) => {
        const code = ROW_CODES[rowIndex] || "";
        const rowExcelNum = 17 + rowIndex;

        if (rowIndex === 0) {
            return {
                rowIndex,
                rowExcelNum,
                code,
                desc,
                rowItems: []
            };
        }

        const rowItems = BS001_COL_SUFFIXES.map((colSuffix, colIndex) => {
            const cellRef = `C${rowExcelNum}`;

            const codeStr = codeIndex[rowIndex - 1];
            const itemCodeNum = codeStr?.split("_")[1];
            const val = getItemValue(codeStr);

            return {
                itemCodeNum,
                codeStr,
                colSuffix,
                val,
                colLetter: "C",
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
                                {reportData?.ReturnKey || "BAL_SHEET_BS001"}
                            </span>
                        </div>
                        <h1 className="mt-2 text-xl font-bold text-dark dark:text-white">
                            Quarterly Balance Sheet
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
                                    <th className="min-w-[220px] border-r border-stroke py-1.5 pl-3 text-left dark:border-dark-3">
                                        C
                                    </th>
                                </tr>

                                <tr className="border-b border-stroke bg-gray-200 font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3"></th>
                                    <th className="border-r border-stroke p-2 text-center dark:border-dark-3">
                                        Code
                                    </th>
                                    <th className="border-r border-stroke p-2 dark:border-dark-3">
                                        Description
                                    </th>
                                    <th className="border-r border-stroke p-2 text-center text-gray-500 dark:border-dark-3">
                                        Current Month
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => {
                                    const isHeader = ["."].includes(row.code);
                                    const isTotalRow = row.code === "1_00167";
                                    const isMismatchRow = row.code === ".";

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
