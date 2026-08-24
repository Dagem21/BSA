import { findReports } from "@/dal/mongo/reportdal";
import { ReportDto } from "@/dto/report";
import { getReportStatus } from "@/iib/status";
import { RoleTypes } from "@/types/types";
import { verifyUserAuth } from "@/utils/authHelper";
import { authorizeUser } from "@/utils/chechAuthorization";
import { writeToLog } from "@/utils/log";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await verifyUserAuth();
        authorizeUser([RoleTypes.Maker, RoleTypes.Checker, RoleTypes.Admin]);

        const searchParams = request?.nextUrl?.searchParams;
        const fileName = searchParams.get("fileName");

        if (!fileName) {
            return new Response(
                JSON.stringify({
                    error: "File name missing."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        const { fetched, status, error } = await getReportStatus(fileName);

        if (fetched && status) {
            return new Response(
                JSON.stringify({
                    message: "Report status fetched.",
                    status
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: error || "Fetch failed."
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
        writeToLog(error, "Fetch Report");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
