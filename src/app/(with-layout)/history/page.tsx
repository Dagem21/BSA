import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportTable } from "@/components/Tables/report-table";

export const metadata: Metadata = {
    title: "Report History"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="Report History" />

            <div className="space-y-10">
                <Suspense fallback={<div className="p-4 text-center">Loading report history...</div>}>
                    <ReportTable />
                </Suspense>
            </div>
        </>
    );
}
