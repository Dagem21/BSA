import React from "react";
import { NN001ExcelView } from "@/components/ReportViews/nn001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "NN001 Report Excel View | National Bank of Ethiopia",
    description: "Non-Accrual to Accrual Loans (NN001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function NN001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="NN001 Excel Report View" />
            <NN001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
