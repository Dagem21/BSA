import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportForm } from "./_components/report-form";
import { ReportTable } from "@/components/Tables/report-table";

export const metadata: Metadata = {
    title: "Report History"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="Report History" />

            <div className="space-y-10">
                <ReportTable />
            </div>
        </>
    );
}
