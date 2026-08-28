import React from "react";
import * as path from "path";
import * as fs from "fs";
import { OL001ExcelView } from "@/components/ReportViews/ol001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "OL001 Report Excel View | National Bank of Ethiopia",
    description: "Collateralized Properties Acquired (OL001) Excel Report Viewer"
};

interface PageProps {
    searchParams?: Promise<{ filename?: string }>;
}

export default async function OL001ReportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const requestedFileName = params?.filename;

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="OL001 Excel Report View" />
            <OL001ExcelView activeFileName={requestedFileName} />
        </div>
    );
}
