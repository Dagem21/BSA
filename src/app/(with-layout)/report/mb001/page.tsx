import React from "react";
import { MB001ExcelView } from "@/components/ReportViews/mb001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "MB001 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Balance Sheet (MB001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function MB001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="MB001 Excel Report View" />
            <MB001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
