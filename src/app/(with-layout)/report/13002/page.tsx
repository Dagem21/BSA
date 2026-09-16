import React, { Suspense } from "react";
import { PART13002ExcelView } from "@/components/ReportViews/part13002-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "13002 Report Excel View | National Bank of Ethiopia",
    description: "Monthly Returns on Related Party Transactions (13002) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

async function ReportContent({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return <PART13002ExcelView activeFileName={requestedFileName} />;
}

export default function PART13002ReportPage(props: PageProps) {
    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="13002 Excel Report View" />
            <Suspense fallback={<div className="p-4 text-center">Loading report...</div>}>
                <ReportContent searchParams={props.searchParams} />
            </Suspense>
        </div>
    );
}
