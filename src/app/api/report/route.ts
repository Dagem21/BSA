import { findReport, findReports, updateReport } from "@/dal/mongo/reportdal";
import { ReportDto } from "@/dto/report";
import { verifyUserAuth } from "@/utils/authHelper";
import { writeToLog } from "@/utils/log";
import { readFile } from "node:fs/promises";
import { after, NextRequest } from "next/server";
import * as path from "path";
import mongoose from "mongoose";
import { postReport } from "@/iib/submission";
import { ResponseLogDto } from "@/dto/responseLog";
import { createResponseLog } from "@/dal/mongo/responseLogdal";
import { findOpenPositions } from "@/dal/sql/fcyOpenPositions";
import { service } from "@/cron/FCY Daily Open position/service";

export async function GET() {
    try {
        const decodedToken = await verifyUserAuth();

        const query: ReportDto = {
            reportType: { $in: decodedToken.allowedReports || [] }
        };
        const reports = await findReports(query);
        if (reports) {
            return new Response(
                JSON.stringify({
                    message: "Reports fetched.",
                    reports
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
        writeToLog(error, "Fetch Report");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST() {
    try {
        await service();
        const positions = await findOpenPositions();
        return new Response(
            JSON.stringify({
                message: "Fetched.",
                positions
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error: any) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();
        const body = await request.json();
        if (!body) {
            return new Response(
                JSON.stringify({ error: "Missing required inputs." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        let { reportId, status } = body;
        if (!reportId || !status) {
            return new Response(
                JSON.stringify({ error: "Missing required inputs." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const updateQuery: ReportDto = {
            status,
            updatedBy: decodedToken.id
        };
        if (status === "Approved") {
            updateQuery.approvedBy = decodedToken.id;
        }
        const report = await findReport(reportId);
        if (!report) {
            return new Response(
                JSON.stringify({ error: "Report not found." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        const { updated } = await updateReport(
            new mongoose.Types.ObjectId(reportId),
            updateQuery
        );
        if (updated) {
            if (status === "Approved") {
                after(async () => {
                    try {
                        const rootDir = process.cwd();
                        const jsonFile = path.join(
                            rootDir,
                            "reports",
                            "json",
                            report?.json
                        );

                        const fileContent = await readFile(jsonFile, "utf8");
                        const jsonObject = JSON.parse(fileContent);

                        const { response, submitted } =
                            await postReport(jsonObject);

                        const updateSubmitQuery: ReportDto = {
                            response: response
                        };
                        if (submitted) updateSubmitQuery.status = "Submitted";

                        const responseLog: ResponseLogDto = {
                            reportID: reportId,
                            json: report?.json,
                            status: submitted ? "Success" : "Failed",
                            response: response
                        };

                        await createResponseLog(responseLog);

                        await updateReport(
                            new mongoose.Types.ObjectId(reportId),
                            updateSubmitQuery
                        );
                    } catch (error) {
                        console.error("Background task failed:", error);
                    }
                });
            }
            return new Response(
                JSON.stringify({
                    error: "Report updated."
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        } else {
            return new Response(
                JSON.stringify({
                    error: "Report updated failed."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
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
        writeToLog(error, "Update Report");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
