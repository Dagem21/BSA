import { findReport, findReports } from "@/dal/mongo/reportdal";
import { ReportDto } from "@/dto/report";
import { verifyUserAuth } from "@/utils/authHelper";
import { writeToLog } from "@/utils/log";
import { NextRequest } from "next/server";
import { authorizeUser } from "@/utils/chechAuthorization";
import { RoleTypes } from "@/types/types";
import { SystemLogDto } from "@/dto/systemLog";
import { findSystemLogs } from "@/dal/mongo/systemLogsdal";

export async function GET(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();
        authorizeUser([RoleTypes.Maker, RoleTypes.Checker, RoleTypes.Admin]);

        const searchParams = request?.nextUrl?.searchParams;

        const reportID = searchParams.get("reportID");
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");
        const reportType = searchParams.get("reportType");
        const createdAt = searchParams.get("createdAt");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (reportID) {
            const report = await findReport(reportID);
            if (report) {
                return new Response(
                    JSON.stringify({
                        message: "Report fetched.",
                        content: report
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
            return new Response(
                JSON.stringify({
                    error: "Fetch failed."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const query: SystemLogDto = {
            reportID: { $in: decodedToken.allowedReports || [] }
        };

        if (decodedToken?.role === RoleTypes.Admin) {
            delete query.reportID;
        }

        if (
            reportType &&
            (decodedToken?.allowedReports?.includes(reportType) ||
                decodedToken?.role === RoleTypes.Admin)
        )
            query.reportID = reportType;

        if (createdAt) {
            const startOfDay = new Date(createdAt);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(createdAt);
            endOfDay.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startOfDay,
                $lt: endOfDay
            };
        } else if (startDate && endDate)
            query.createdAt = {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            };
        else if (startDate) query.createdAt = { $gte: new Date(startDate) };
        else if (endDate) query.createdAt = { $lt: new Date(endDate) };

        const logs = await findSystemLogs(
            query,
            parseInt(page || "1"),
            parseInt(limit || "10")
        );

        if (logs) {
            return new Response(
                JSON.stringify({
                    message: "Logs fetched.",
                    contents: logs
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: "Fetch failed."
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return new Response(
                JSON.stringify({
                    error: "Session expired. Please login again!"
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        writeToLog(error, "Fetch Logs");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
