import React from "react";
import { FB001ExcelView } from "@/components/ReportViews/fb001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "FB001 Report Excel View | National Bank of Ethiopia",
    description: "Balance Sheet Report (FB001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function FB001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="FB001 Excel Report View" />
            <FB001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
