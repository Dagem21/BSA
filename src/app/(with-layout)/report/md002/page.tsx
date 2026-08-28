import React from "react";
import { MD002ExcelView } from "@/components/ReportViews/md002-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "MD002 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Report on Deposits by Sector & Region (MD002) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function MD002ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="MD002 Excel Report View" />
            <MD002ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
