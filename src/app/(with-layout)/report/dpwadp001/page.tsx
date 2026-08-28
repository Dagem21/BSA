import React from "react";
import { DPWADP001ExcelView } from "@/components/ReportViews/dpwadp001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "DPWADP001 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Weighted Average Deposit Profit Rates (Interest-Free Banks) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function DPWADP001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="DPWADP001 Excel Report View" />
            <DPWADP001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
