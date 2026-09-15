import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CampaignVisitors } from "@/components/Charts/campaign-visitors";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic Chart",
};

export default async function Page() {
  return (
    <>
      <Breadcrumb pageName="Basic Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <CampaignVisitors />
        </div>
      </div>
    </>
  );
}
