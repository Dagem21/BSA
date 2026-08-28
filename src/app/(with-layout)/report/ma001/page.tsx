import React from "react";
import { MA001ExcelView } from "@/components/ReportViews/ma001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "MA001 Report Excel View | National Bank of Ethiopia",
    description: "Maturity Analysis of Assets and Liabilities (MA001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function MA001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="MA001 Excel Report View" />
            <MA001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
