import React from "react";
import { SRRYY001ExcelView } from "@/components/ReportViews/srryy001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "SRRYY001 Report Excel View | National Bank of Ethiopia",
    description: "Statutory Reserve Requirement Report (SRRYY001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function SRRYY001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="SRRYY001 Excel Report View" />
            <SRRYY001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
