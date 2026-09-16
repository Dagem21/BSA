import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportForm } from "./_components/report-form";

export const metadata: Metadata = {
    title: "Report"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="New Report" />

            <div className="flex items-center justify-center">
                <div className="w-full sm:w-lg">
                    <Suspense fallback={<div className="p-4 text-center">Loading report form...</div>}>
                        <ReportForm />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
