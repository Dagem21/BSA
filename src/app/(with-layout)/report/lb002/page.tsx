import React from "react";
import { LB002ExcelView } from "@/components/ReportViews/lb002-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "LB002 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Return on Large Exposures (LB002) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function LB002ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="LB002 Excel Report View" />
            <LB002ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
