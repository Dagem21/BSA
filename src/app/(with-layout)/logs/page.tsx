import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ServiceLogTable } from "@/components/Tables/service-log-table";

export const metadata: Metadata = {
    title: "Serivce Logs"
};

export default function FormElementsPage() {
    return (
        <>
            <Breadcrumb pageName="Service Logs History" />

            <div className="space-y-10">
                <Suspense
                    fallback={
                        <div className="p-4 text-center">Loading logs...</div>
                    }
                >
                    <ServiceLogTable />
                </Suspense>
            </div>
        </>
    );
}
