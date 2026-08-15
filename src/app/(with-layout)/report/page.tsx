import type { Metadata } from "next";

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
                    <ReportForm />
                </div>
            </div>
        </>
    );
}
