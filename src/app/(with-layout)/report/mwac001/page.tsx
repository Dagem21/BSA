import React from "react";
import { MWAC001ExcelView } from "@/components/ReportViews/mwac001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "MWAC001 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Weighted Average Lending Interest Rates (MWAC001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function MWAC001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="MWAC001 Excel Report View" />
            <MWAC001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
