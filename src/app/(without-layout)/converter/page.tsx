"use client";

import { useState } from "react";

export default function StandaloneConverterPage() {
    const [reportType, setReportType] = useState<string>("LOAN_CLA&PROV_LP001");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedJson, setConvertedJson] = useState<any | null>(null);
    const [downloadName, setDownloadName] = useState<string>("report.json");
    const [copied, setCopied] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleConvert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select an Excel (.xlsx) file first.");
            return;
        }

        setLoading(true);
        setError(null);
        setConvertedJson(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("reportType", reportType);

            const res = await fetch("/api/quick-convert", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to convert file.");
            }

            setConvertedJson(data.jsonPayload);
            setDownloadName(data.filename || `${reportType}.json`);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!convertedJson) return;
        const jsonStr = JSON.stringify(convertedJson, null, 4);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        if (!convertedJson) return;
        const jsonStr = JSON.stringify(convertedJson, null, 4);
        navigator.clipboard.writeText(jsonStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="border-b border-slate-800 pb-6 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                        Standalone Utility Tool
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        BSA Excel-to-JSON Converter
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm md:text-base">
                        Upload regulatory Excel template files and instantly generate standardized JSON outputs ready for submission.
                    </p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleConvert} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-sm">
                    
                    {/* Report Type Select */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                            1. Select Report Type
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition cursor-pointer"
                        >
                            <option value="LOAN_CLA&PROV_LP001">
                                LOAN_CLA&PROV_LP001 — Loan Classification & Provisioning (LP001)
                            </option>
                            <option value="COL_SOL_18M_LL001">
                                COL_SOL_18M_LL001 — Foreclosed & Sold Properties (LL001)
                            </option>
                            <option value="NPL&PRO_NL001">
                                NPL&PRO_NL001 — Non-Performing Loans & Provisions (NL001)
                            </option>
                            <option value="CDby Range and RegCM002">
                                CDby Range and RegCM002 — Deposits by Range (CM002)
                            </option>
                            <option value="DIFIF002">
                                DIFIF002 — Interest Free Deposits by Sector (IF002)
                            </option>
                            <option value="M_LCPLC001">
                                M_LCPLC001 — Letter of Credit (LC001)
                            </option>
                            <option value="LCMWAC001">
                                LCMWAC001 — Lending Interest Rates & Cost of Funds (LCMWAC001)
                            </option>
                            <option value="DIR RANGERD002">
                                DIR RANGERD002 — Interest Free Deposits by Range (RD002)
                            </option>
                            <option value="LOAN_SEC & REGRS002">
                                LOAN_SEC & REGRS002 — Conventional Loans by Sector (RS002)
                            </option>
                            <option value="IFB_LON_S & RZZ002">
                                IFB_LON_S & RZZ002 — Interest Free Loans by Sector (ZZ002)
                            </option>
                            <option value="WAADIR001">
                                WAADIR001 — Deposit Interest Rates (WAADIR001)
                            </option>
                            <option value="DigitalLendingDL001">
                                DigitalLendingDL001 — Quarterly Digital Lending Report (DL001)
                            </option>
                            <option value="INT_LON_R&R_EE002">
                                INT_LON_R&R_EE002 — Quarterly Interest Free Loans by Range and Region (EE002)
                            </option>
                            <option value="INT_LON_S&R_SR002">
                                INT_LON_S&R_SR002 — Quarterly Interest Free Loans by Sector and Region (SR002)
                            </option>
                            <option value="TOP_20_BOR_TB001">
                                TOP_20_BOR_TB001 — Quarterly Top Twenty (20) Borrowers' Report (TB001)
                            </option>
                            <option value="TOP_20_NPLs_TN001">
                                TOP_20_NPLs_TN001 — Quarterly Top Twenty (20) NPLs Report (TN001)
                            </option>
                        </select>
                    </div>

                    {/* File Upload Dropzone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                            2. Select Excel File (.xlsx)
                        </label>
                        <div className="relative border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl p-8 text-center transition bg-slate-900/50 group cursor-pointer">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="space-y-2">
                                <svg
                                    className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-400 transition"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-slate-300">
                                    {file ? (
                                        <span className="text-blue-400 font-semibold">{file.name}</span>
                                    ) : (
                                        "Click or drag and drop your Excel file here"
                                    )}
                                </p>
                                <p className="text-xs text-slate-500">Supports .xlsx files</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-6 rounded-lg font-semibold text-white shadow-lg transition flex items-center justify-center space-x-2 ${
                            loading
                                ? "bg-slate-700 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                <span>Converting Excel to JSON...</span>
                            </>
                        ) : (
                            <span>⚡ Convert to JSON</span>
                        )}
                    </button>
                </form>

                {/* Output Section */}
                {convertedJson && (
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 md:p-8 space-y-4 shadow-xl">
                        
                        {/* Header & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                    <span className="text-emerald-400">✓</span>
                                    <span>Generated JSON Output</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    ReturnKey: <code className="text-blue-400">{convertedJson.ReturnKey}</code> | ReturnItems: <code className="text-blue-400">{convertedJson.ReturnItemsList?.length || 0}</code>
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition"
                                >
                                    {copied ? "✓ Copied!" : "📋 Copy JSON"}
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center space-x-1.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>Download JSON</span>
                                </button>
                            </div>
                        </div>

                        {/* JSON Code Box */}
                        <div className="relative bg-slate-950 rounded-lg border border-slate-800 p-4 max-h-[500px] overflow-auto text-xs font-mono text-emerald-400 leading-relaxed shadow-inner">
                            <pre>{JSON.stringify(convertedJson, null, 4)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
