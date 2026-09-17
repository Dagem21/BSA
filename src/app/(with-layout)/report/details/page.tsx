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
import { PART13002ExcelView } from "@/components/ReportViews/part13002-excel-view";
import { DPWADP001ExcelView } from "@/components/ReportViews/dpwadp001-excel-view";
import { FB001ExcelView } from "@/components/ReportViews/fb001-excel-view";
import { KK001ExcelView } from "@/components/ReportViews/kk001-excel-view";
import { MA001ExcelView } from "@/components/ReportViews/ma001-excel-view";
import { MB001ExcelView } from "@/components/ReportViews/mb001-excel-view";
import { MD002ExcelView } from "@/components/ReportViews/md002-excel-view";
import { MK001ExcelView } from "@/components/ReportViews/mk001-excel-view";
import { MWAC001ExcelView } from "@/components/ReportViews/mwac001-excel-view";
import { MWAL001ExcelView } from "@/components/ReportViews/mwal001-excel-view";
import { NN001ExcelView } from "@/components/ReportViews/nn001-excel-view";
import { OL001ExcelView } from "@/components/ReportViews/ol001-excel-view";
import { RB001ExcelView } from "@/components/ReportViews/rb001-excel-view";
import { REGRL002ExcelView } from "@/components/ReportViews/regrl002-excel-view";
import { SRRYY001ExcelView } from "@/components/ReportViews/srryy001-excel-view";
import { ZS001ExcelView } from "@/components/ReportViews/zs001-excel-view";

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
            case "BD_L&A_BD001":
                return <BD001ExcelView activeFileName={report.json} />;
            case "INT_FRE_SP_BP001":
                return <BP001ExcelView activeFileName={report.json} />;
            case "DPWADP001":
                return <DPWADP001ExcelView activeFileName={report.json} />;
            case "LOA_PORT_EP001":
                return <EP001ExcelView activeFileName={report.json} />;
            case "INT_FRE_BS_FB001":
                return <FB001ExcelView activeFileName={report.json} />;
            case "M_CC-On & OffKK001":
                return <KK001ExcelView activeFileName={report.json} />;
            case "LOA_ADV_OUT_LA001":
                return <LA001ExcelView activeFileName={report.json} />;
            case "BOR_TEN_PER_LB002":
                return <LB002ExcelView activeFileName={report.json} />;
            case "NBE_MAT_ANL_MA001":
                return <MA001ExcelView activeFileName={report.json} />;
            case "MB001MB001":
                return <MB001ExcelView activeFileName={report.json} />;
            case "CDby Sector and RegMD002":
                return <MD002ExcelView activeFileName={report.json} />;
            case "Key Balance SheetMK001":
                return <MK001ExcelView activeFileName={report.json} />;
            case "LCMWAC001":
                return <MWAC001ExcelView activeFileName={report.json} />;
            case "IFBLCMWAL001":
                return <MWAL001ExcelView activeFileName={report.json} />;
            case "NACNN001":
                return <NN001ExcelView activeFileName={report.json} />;
            case "COL_ACQ_18M_OL001":
                return <OL001ExcelView activeFileName={report.json} />;
            case "SINGLE CURRENCYOP001":
                return <OP001ExcelView activeFileName={report.json} />;
            case "BSD_LOAN_PART13002":
                return <PART13002ExcelView activeFileName={report.json} />;
            case "Reserve BaseRB001":
                return <RB001ExcelView activeFileName={report.json} />;
            case "LOAN_RAN & REGRL002":
                return <REGRL002ExcelView activeFileName={report.json} />;
            case "IFB_LON_R & RWW002":
                return <RWW002ExcelView activeFileName={report.json} />;
            case "SRRYY001":
                return <SRRYY001ExcelView activeFileName={report.json} />;
            case "WAADIR001":
                return <WAADIR001ExcelView activeFileName={report.json} />;
            case "LSR-Statutory ZS001":
                return <ZS001ExcelView activeFileName={report.json} />;
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
