import React from "react";
import { RB001ExcelView } from "@/components/ReportViews/rb001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "RB001 Report Excel View | National Bank of Ethiopia",
    description: "Reserve Base Report (RB001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function RB001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="RB001 Excel Report View" />
            <RB001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
