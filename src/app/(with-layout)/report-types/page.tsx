import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportTypeTable } from "@/components/Tables/report-type-table";

export const metadata: Metadata = {
    title: "Report"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="Report Types" />

            <div className="space-y-10">
                <Suspense fallback={<div className="p-4 text-center">Loading report types...</div>}>
                    <ReportTypeTable />
                </Suspense>
            </div>
        </>
    );
}
