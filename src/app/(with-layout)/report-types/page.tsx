import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportForm } from "./_components/report-form";
import { ReportTypeTable } from "@/components/Tables/report-type-table";

export const metadata: Metadata = {
    title: "Report"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="Report Types" />

            <div className="space-y-10">
                <ReportTypeTable />
            </div>
        </>
    );
}
