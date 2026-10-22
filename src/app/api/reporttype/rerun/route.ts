import { findReportType } from "@/dal/mongo/reportTypedal";
import { ReportTypeDto } from "@/dto/reportType";
import { verifyUserAuth } from "@/utils/authHelper";
import { writeToLog } from "@/utils/log";
import { after, NextRequest, NextResponse } from "next/server";
import { FrequncyTypes, RoleTypes, ServiceTypes } from "@/types/types";
import { checkFirstDays } from "@/utils/checkDate";
import { getService } from "@/cron/serviceMap";

export async function POST(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();

        const searchParams = request?.nextUrl?.searchParams;
        const reportingDate = searchParams.get("reportingDate");
        const reportID = searchParams.get("reportID");

        if (!reportingDate || !reportID) {
            return NextResponse.json(
                { error: "Missing report ID or reporting date!" },
                { status: 400 }
            );
        }

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

        if (
            !decodedToken?.allowedReports?.includes(reportID) &&
            decodedToken?.role !== RoleTypes.Admin
        ) {
            return NextResponse.json(
                { error: "You do not have permission for this report!" },
                { status: 403 }
            );
        }

        const reportType: ReportTypeDto | null = await findReportType(reportID);
        if (!reportType) {
            return NextResponse.json(
                { error: "Report type not found!" },
                { status: 400 }
            );
        }

        if (reportType?.service === ServiceTypes.None) {
            return NextResponse.json(
                { error: "Service is disabled for this report!" },
                { status: 400 }
            );
        }

        after(async () => {
            try {
                const service = getService(reportType?.reportId || "");
                if (service)
                    await service(
                        reportType._id?.toString(),
                        reportType.reportId
                    );
            } catch (error) {
                writeToLog(
                    `${
                        "Background task failed for: " +
                        reportType.reportId +
                        "\nError: " +
                        error
                    }`,
                    "Rerun service"
                );
                console.error(
                    "Background task failed for:",
                    reportType.reportId,
                    "\nError:",
                    error
                );
            }
        });

        return NextResponse.json(
            {
                message: "Service initiated."
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
        writeToLog(error, "Rerun service");
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
