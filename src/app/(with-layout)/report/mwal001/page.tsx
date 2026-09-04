import React from "react";
import { MWAL001ExcelView } from "@/components/ReportViews/mwal001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "MWAL001 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Weighted Average Lending Profit Rates (MWAL001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function MWAL001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="MWAL001 Excel Report View" />
            <MWAL001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
