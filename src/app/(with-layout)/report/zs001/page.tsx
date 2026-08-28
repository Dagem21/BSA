import React from "react";
import { ZS001ExcelView } from "@/components/ReportViews/zs001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "ZS001 Report Excel View | National Bank of Ethiopia",
    description: "Liquidity Requirement Report (ZS001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function ZS001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="ZS001 Excel Report View" />
            <ZS001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
