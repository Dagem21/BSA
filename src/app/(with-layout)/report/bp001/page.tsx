import React from "react";
import { BP001ExcelView } from "@/components/ReportViews/bp001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "BP001 Report Excel View | National Bank of Ethiopia",
    description: "Statement of Profit or Loss (BP001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function BP001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="BP001 Excel Report View" />
            <BP001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
