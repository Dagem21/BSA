import React from "react";
import { MK001ExcelView } from "@/components/ReportViews/mk001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "MK001 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Key Balance Sheet (MK001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function MK001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="MK001 Excel Report View" />
            <MK001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
