"use client";

import React, { useEffect } from "react";
import { BP001ExcelView } from "@/components/ReportViews/bp001-excel-view";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useApiFetch from "@/hooks/useAPIFetch";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { ReportTypeDto } from "@/dto/reportType";
import { OP001ExcelView } from "@/components/ReportViews/op001-excel-view";
import { LB002ExcelView } from "@/components/ReportViews/lb002-excel-view";
import { BD001ExcelView } from "@/components/ReportViews/bd001-excel-view";
import { EP001ExcelView } from "@/components/ReportViews/ep001-excel-view";
import { LA001ExcelView } from "@/components/ReportViews/la001-excel-view";
import { RWW002ExcelView } from "@/components/ReportViews/rww002-excel-view";
import { WAADIR001ExcelView } from "@/components/ReportViews/waadir001-excel-view";

export default function Details() {
    const searchParams = useSearchParams();
    const reportID = searchParams.get("reportid");

    const { data: dataReportTypes, isLoading: isLoadingReportTypes } =
        useApiFetch({
            url: "/api/reporttype",
            method: "GET"
        });

    const { data, fetchData, isLoading, errors } = useApiFetch(
        {
            url: "/api/report",
            method: "GET"
        },
        false
    );

    useEffect(() => {
        if (reportID) {
            fetchData({
                params: { reportID }
            });
        }
    }, [reportID]);

    useEffect(() => {
        if (!isLoading && errors?.details) {
            toast.error(errors.details?.response?.data?.error);
        }
    }, [isLoading, errors]);

    const loadView = (report: any) => {
        const reportType = dataReportTypes?.reportTypes?.find(
            (rt: ReportTypeDto) => rt._id === report.reportType
        );
        const reportTypeName = reportType?.reportId;

        switch (reportTypeName) {
            case "SINGLE CURRENCYOP001":
                return <OP001ExcelView activeFileName={report.json} />;
            case "WAADIR001":
                return <WAADIR001ExcelView activeFileName={report.json} />;
            case "BOR_TEN_PER_LB002":
                return <LB002ExcelView activeFileName={report.json} />;
            case "BD_L&A_BD001":
                return <BD001ExcelView activeFileName={report.json} />;
            case "LOA_PORT_EP001":
                return <EP001ExcelView activeFileName={report.json} />;
            case "LOA_ADV_OUT_LA001":
                return <LA001ExcelView activeFileName={report.json} />;
            case "IFB_LON_R & RWW002":
                return <RWW002ExcelView activeFileName={report.json} />;
            default:
                return <></>;
        }
    };

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
            <Breadcrumb pageName="Report View" />
            {!isLoading &&
                !isLoadingReportTypes &&
                dataReportTypes &&
                data &&
                loadView(data.content)}
        </div>
    );
}
