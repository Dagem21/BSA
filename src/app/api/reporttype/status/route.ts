import { findReportType } from "@/dal/mongo/reportTypedal";
import { ReportTypeDto } from "@/dto/reportType";
import { verifyUserAuth } from "@/utils/authHelper";
import { writeToLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";
import { FrequncyTypes, RoleTypes } from "@/types/types";
import { checkFirstDays } from "@/utils/checkDate";
import { findReports } from "@/dal/mongo/reportdal";
import { ReportDto } from "@/dto/report";

export async function GET(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();

        const searchParams = request?.nextUrl?.searchParams;
        const reportingDate = searchParams.get("reportingDate");

        const date = reportingDate ? new Date(reportingDate) : new Date();
        const reportDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        const firstDays = checkFirstDays(reportDate);

        const frequencies: FrequncyTypes[] = [FrequncyTypes.Daily];
        if (firstDays.isFirstDayOfWeek) frequencies.push(FrequncyTypes.Weekly);
        if (firstDays.isFirstDayOfMonth)
            frequencies.push(FrequncyTypes.Monthly);
        if (firstDays.isFirstDayOfQuarter)
            frequencies.push(FrequncyTypes.Quarterly);
        if (firstDays.isFirstDayOfYear) frequencies.push(FrequncyTypes.Yearly);

        const filter: ReportTypeDto = {
            frequency: { $in: frequencies }
        };

        if (decodedToken.role !== RoleTypes.Admin)
            filter._id = { $in: decodedToken?.allowedReports };

        const reportTypes = await findReportType(filter);

        // Date bounds setup
        const start = new Date(reportDate);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(reportDate);
        end.setUTCHours(23, 59, 59, 999);

        // Parallel execution to avoid N+1 sequential loop delays
        const reportTypeService = await Promise.all(
            reportTypes.map(async (reportType: any) => {
                // Safely convert Mongoose document to clean JS object
                const plainReportType =
                    typeof reportType.toJSON === "function"
                        ? reportType.toJSON()
                        : (reportType._doc ?? { ...reportType });

                const reportQuery: ReportDto = {
                    reportType: plainReportType._id,
                    reportingDate: { $gte: start, $lte: end }
                };

                const reports = await findReports(reportQuery, 1, 1);

                return {
                    ...plainReportType,
                    report: reports?.reports?.[0] ?? null
                };
            })
        );

        return NextResponse.json(
            {
                message: "Fetched report types.",
                reportTypes: reportTypeService
            },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { error: "Session expired. Please login again!" },
                { status: 401 }
            );
        }
        writeToLog(error, "Get Report Types");
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
