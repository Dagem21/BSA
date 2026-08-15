import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InvoiceTable } from "@/components/Tables/invoice-table";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tables"
};

const TablesPage = () => {
    return (
        <>
            <Breadcrumb pageName="Notifications" />

            <div className="space-y-10">
                <InvoiceTable />
            </div>
        </>
    );
};

export default TablesPage;
