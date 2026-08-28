import React from "react";
import { REGRL002ExcelView } from "@/components/ReportViews/regrl002-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "REGRL002 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Conventional Loans by Range & Region (REGRL002) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function REGRL002ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="REGRL002 Excel Report View" />
            <REGRL002ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
