"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

interface BP001JsonData {
    ReturnKey?: string;
    InstCode?: string;
    FinYear?: number;
    StartDate?: string;
    EndDate?: string;
    ReturnItemsList?: ReturnItem[];
}

interface BP001ExcelViewProps {
    initialData?: BP001JsonData;
    activeFileName?: string;
}

export function BP001ExcelView({ initialData, activeFileName }: BP001ExcelViewProps) {
    const [viewTab, setViewTab] = useState<"grid" | "json">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentFileName, setCurrentFileName] = useState<string>(activeFileName || "");
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [reportData, setReportData] = useState<BP001JsonData | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    const [selectedCell, setSelectedCell] = useState<{
        cellRef: string;
        code: string;
        colName: string;
        value: string;
    } | null>(null);

    const fetchJsonData = async (fileName?: string) => {
        try {
            setLoading(true);
            const query = fileName ? `?filename=${encodeURIComponent(fileName)}` : "?type=BP001";
            const res = await fetch(`/api/report/json-view${query}`);
            if (res.ok) {
                const json = await res.json();
                setReportData(json.data);
                if (json.fileName) setCurrentFileName(json.fileName);
                if (json.availableFiles) setAvailableFiles(json.availableFiles);
                
                if (json.data?.ReturnItemsList?.[0]) {
                    const firstItem = json.data.ReturnItemsList[0];
                    setSelectedCell({
                        cellRef: `C14`,
                        code: firstItem.Code,
                        colName: firstItem._description,
                        value: firstItem.Value || "0"
                    });
                }
            }
        } catch (e) {
            console.error("Failed to fetch BP001 JSON view:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            fetchJsonData(activeFileName);
        } else if (initialData?.ReturnItemsList?.[0]) {
            const firstItem = initialData.ReturnItemsList[0];
            setSelectedCell({
                cellRef: `C14`,
                code: firstItem.Code,
                colName: firstItem._description,
                value: firstItem.Value || "0"
            });
        }
    }, [activeFileName, initialData]);

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
            console.error(err);
            alert("Failed to download Excel file.");
        }
    };

    const handleCellClick = (code: string, rowNum: number, value: string, desc: string) => {
        setSelectedCell({
            cellRef: `C${rowNum}`,
            code,
            colName: desc,
            value: value || "0"
        });
    };

    const formatNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null || val === "") return "";
        const num = Number(val);
        if (isNaN(num)) return val.toString();
        return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);
    };

    const items = reportData?.ReturnItemsList || [];
    const filteredItems = items.filter(
        (it) =>
            it._description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            it.Code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full bg-white shadow-sm border border-stroke rounded-xl overflow-hidden flex flex-col dark:bg-boxdark dark:border-strokedark max-h-[85vh]">
            {/* Header / Controls */}
            <div className="px-5 py-4 border-b border-stroke dark:border-strokedark bg-gray-50/50 dark:bg-meta-4/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-black dark:text-white">BP001 Statement of Profit or Loss</h2>
                        {currentFileName && (
                            <p className="text-xs text-body font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                {currentFileName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="text-sm bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
                        value={currentFileName}
                        onChange={(e) => fetchJsonData(e.target.value)}
                        disabled={loading}
                    >
                        <option value="" disabled>Select a report...</option>
                        {availableFiles.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>

                    <div className="flex bg-stroke/50 dark:bg-strokedark/50 p-1 rounded-lg">
                        <button
                            onClick={() => setViewTab("grid")}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                viewTab === "grid"
                                    ? "bg-white text-primary shadow-sm dark:bg-boxdark dark:text-white"
                                    : "text-body hover:text-black dark:hover:text-white"
                            )}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewTab("json")}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                viewTab === "json"
                                    ? "bg-white text-primary shadow-sm dark:bg-boxdark dark:text-white"
                                    : "text-body hover:text-black dark:hover:text-white"
                            )}
                        >
                            JSON View
                        </button>
                    </div>

                    <button
                        onClick={handleDownloadExcel}
                        disabled={!currentFileName}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        title="Download Excel"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[400px]">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="text-body font-medium">Loading report data...</p>
                </div>
            ) : !reportData ? (
                <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[400px] text-center">
                    <svg className="w-16 h-16 text-body/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Data Available</h3>
                    <p className="text-body max-w-md">Select a report from the dropdown above or check if the JSON file exists.</p>
                </div>
            ) : viewTab === "json" ? (
                <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-meta-4/10">
                    <pre className="text-xs sm:text-sm font-mono text-black dark:text-white bg-white dark:bg-boxdark p-4 rounded-xl border border-stroke dark:border-strokedark shadow-sm overflow-x-auto">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Left Panel: Search & Hierarchy */}
                    <div className="w-full md:w-80 border-r border-stroke dark:border-strokedark bg-gray-50/30 dark:bg-meta-4/10 flex flex-col shrink-0">
                        <div className="p-4 border-b border-stroke dark:border-strokedark shrink-0">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search fields or codes..."
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg outline-none focus:border-primary transition-colors text-black dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredItems.length === 0 ? (
                                <p className="text-sm text-center text-body py-8">No fields match your search.</p>
                            ) : (
                                <div className="space-y-1">
                                    {filteredItems.map((item, idx) => {
                                        const isSelected = selectedCell?.code === item.Code;
                                        const rowNum = 14 + items.findIndex(i => i.Code === item.Code);
                                        const hasValue = item.Value && Number(item.Value) > 0;
                                        
                                        return (
                                            <button
                                                key={item.Code}
                                                onClick={() => handleCellClick(item.Code, rowNum, item.Value, item._description)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group flex items-start gap-2",
                                                    isSelected
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-body hover:bg-gray-100 dark:hover:bg-meta-4 hover:text-black dark:hover:text-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "mt-0.5 shrink-0 w-2 h-2 rounded-full",
                                                    hasValue ? "bg-success" : "bg-stroke dark:bg-strokedark"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1 gap-2">
                                                        <span className="font-mono text-xs opacity-70 shrink-0">{item.Code}</span>
                                                        <span className="text-xs font-mono font-medium truncate">
                                                            {formatNumber(item.Value)}
                                                        </span>
                                                    </div>
                                                    <div className="line-clamp-2 leading-tight">
                                                        {item._description}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Excel Grid Viewer */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-boxdark min-w-0 overflow-hidden relative">
                        {/* Formula Bar */}
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20 shrink-0">
                            <div className="w-16 text-center font-mono text-sm font-semibold text-black dark:text-white bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded py-1 shrink-0">
                                {selectedCell?.cellRef || ""}
                            </div>
                            <div className="font-bold text-gray-400 shrink-0 px-1">fx</div>
                            <div className="flex-1 font-mono text-sm bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded px-3 py-1 text-black dark:text-white truncate">
                                {selectedCell?.value || ""}
                            </div>
                        </div>

                        {/* Minimalist Grid Rendering */}
                        <div className="flex-1 overflow-auto bg-[#f8f9fa] dark:bg-boxdark p-4 md:p-8">
                            <div className="max-w-4xl mx-auto bg-white dark:bg-meta-4 shadow-sm border border-stroke dark:border-strokedark rounded-xl overflow-hidden">
                                
                                {/* Metadata Header */}
                                <div className="grid grid-cols-12 border-b border-stroke dark:border-strokedark bg-gray-50/50 dark:bg-meta-4/50 text-sm">
                                    <div className="col-span-12 p-4 text-center border-b border-stroke dark:border-strokedark">
                                        <h3 className="font-bold text-lg text-black dark:text-white">NATIONAL BANK OF ETHIOPIA</h3>
                                        <p className="text-body font-medium">Statement of Profit or Loss (BP001)</p>
                                    </div>
                                    <div className="col-span-12 p-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="grid grid-cols-3 mb-1"><span className="text-body">Institution Code:</span><span className="col-span-2 font-mono font-medium text-black dark:text-white">{reportData.InstCode}</span></div>
                                            <div className="grid grid-cols-3 mb-1"><span className="text-body">Financial Year:</span><span className="col-span-2 font-mono font-medium text-black dark:text-white">{reportData.FinYear}</span></div>
                                        </div>
                                        <div>
                                            <div className="grid grid-cols-3 mb-1"><span className="text-body">Start Date:</span><span className="col-span-2 font-mono text-black dark:text-white">{reportData.StartDate?.split('T')[0]}</span></div>
                                            <div className="grid grid-cols-3 mb-1"><span className="text-body">End Date:</span><span className="col-span-2 font-mono text-black dark:text-white">{reportData.EndDate?.split('T')[0]}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="grid grid-cols-12 bg-gray-100 dark:bg-meta-4 border-b-2 border-stroke dark:border-strokedark sticky top-0 z-10 text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                                    <div className="col-span-1 p-3 border-r border-stroke dark:border-strokedark text-center">Row</div>
                                    <div className="col-span-8 p-3 border-r border-stroke dark:border-strokedark">Description</div>
                                    <div className="col-span-3 p-3 text-right">Value (ETB)</div>
                                </div>

                                {/* Table Body */}
                                <div>
                                    {items.map((item, idx) => {
                                        const isSelected = selectedCell?.code === item.Code;
                                        const rowNum = 14 + idx;
                                        const isMainCategory = item._description.toLowerCase() === 'income_amount' || item._description.toLowerCase() === 'expenses_amount';
                                        
                                        return (
                                            <div 
                                                key={item.Code}
                                                onClick={() => handleCellClick(item.Code, rowNum, item.Value, item._description)}
                                                className={cn(
                                                    "grid grid-cols-12 border-b border-stroke dark:border-strokedark text-sm cursor-pointer transition-colors",
                                                    isSelected ? "bg-primary/5 dark:bg-primary/20" : "hover:bg-gray-50 dark:hover:bg-meta-4/50",
                                                    isMainCategory ? "font-bold bg-gray-50/50 dark:bg-meta-4/20" : ""
                                                )}
                                            >
                                                <div className="col-span-1 p-3 border-r border-stroke dark:border-strokedark text-center text-body/70 font-mono">
                                                    {rowNum}
                                                </div>
                                                <div className="col-span-8 p-3 border-r border-stroke dark:border-strokedark text-black dark:text-white flex items-center">
                                                    <span className={cn(
                                                        "inline-block w-full truncate",
                                                        isMainCategory ? "" : "pl-4"
                                                    )}>
                                                        {item._description}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 p-3 text-right font-mono text-black dark:text-white">
                                                    {formatNumber(item.Value)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
