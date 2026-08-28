import React from "react";
import { KK001ExcelView } from "@/components/ReportViews/kk001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "KK001 Report Excel View | National Bank of Ethiopia",
    description: "Capital Adequacy Report - Capital Components (KK001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function KK001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="KK001 Excel Report View" />
            <KK001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
