import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportTypeServiceTable } from "@/components/Tables/report-type-service";

export const metadata: Metadata = {
    title: "Report"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="Report Types" />

            <div className="space-y-10">
                <ReportTypeServiceTable />
            </div>
        </>
    );
}
