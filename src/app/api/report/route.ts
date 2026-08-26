import {
    createReport,
    findReport,
    findReports,
    updateReport
} from "@/dal/mongo/reportdal";
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
import { ReportFormValues, reportSchema } from "@/yup/report";
import { generateFileName } from "@/utils/generateFileName";
import * as fs from "fs";
import { writeFile } from "fs/promises";
import { authorizeUser } from "@/utils/chechAuthorization";
import { RoleTypes } from "@/types/types";

export async function GET(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();
        authorizeUser([RoleTypes.Maker, RoleTypes.Checker, RoleTypes.Admin]);

        const searchParams = request?.nextUrl?.searchParams;
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");
        const reportType = searchParams.get("reportType");
        const reportingDate = searchParams.get("reportingDate");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query: ReportDto = {
            reportType: { $in: decodedToken.allowedReports || [] }
        };

        if (reportType && decodedToken?.allowedReports?.includes(reportType))
            query.reportType = reportType;

        if (reportingDate) {
            const start = new Date(reportingDate);
            start.setUTCHours(0, 0, 0, 0);

            const end = new Date(reportingDate);
            end.setUTCHours(23, 59, 59, 999);

            query.reportingDate = { $gte: start, $lte: end };
        }
        if (startDate && endDate)
            query.startDate = {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            };
        else if (startDate) query.startDate = { $gte: new Date(startDate) };
        if (endDate) query.startDate = { $lt: new Date(endDate) };

        const reports = await findReports(
            query,
            parseInt(page || "1"),
            parseInt(limit || "10")
        );

        if (reports) {
            return new Response(
                JSON.stringify({
                    message: "Reports fetched.",
                    contents: reports
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

export async function POST(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();
        authorizeUser([RoleTypes.Maker]);

        const formData = await request.formData();

        const reportType = formData.get("reportType") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const file = formData.get("file") as File;

        const reportRecieved: ReportFormValues = {
            reportType: reportType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            file: file
        };

        const validatedReport = await reportSchema.validate(reportRecieved);
        const fileName = generateFileName();

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "reports", "excel");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.name).toLowerCase();
        const excelFile = `${fileName}${ext}`;
        const jsonFile = `${fileName}.json`;
        const filePath = path.join(uploadDir, excelFile);
        await writeFile(filePath, buffer);

        // Trigger processing for ZS001 report format
        try {
            require("@/models/reportTypeSchema");
            const ReportTypeModel =
                mongoose.models.reporttypes || mongoose.model("reporttypes");
            const reportTypeDoc = await ReportTypeModel.findById(
                validatedReport.reportType
            );

            const reportIdStr = reportTypeDoc?.reportId || "";
            if (
                reportIdStr.toUpperCase().includes("ZS001") ||
                reportIdStr.toUpperCase().includes("LSR")
            ) {
                const { processZS001Report } =
                    await import("@/utils/services/ZS001/ZS001");
                const jsonFilePath = path.join(
                    process.cwd(),
                    "reports",
                    "json",
                    jsonFile
                );
                await processZS001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    validatedReport.startDate,
                    validatedReport.endDate,
                    filePath,
                    jsonFilePath
                );
            }
        } catch (procErr) {
            console.error("Error processing ZS001 report format:", procErr);
        }

        const newReport: ReportDto = {
            file: excelFile,
            json: jsonFile,
            reportingDate: new Date().toISOString(),
            status: "Pending",
            reportType: validatedReport.reportType,
            startDate: validatedReport.startDate.toISOString(),
            endDate: validatedReport.endDate.toISOString(),
            createdBy: decodedToken.id
        };

        const result = await createReport(newReport);

        if (result.created) {
            return new Response(
                JSON.stringify({
                    message: "Report created."
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: "Report not created."
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
        authorizeUser([RoleTypes.Checker]);

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
        let { reportId, status, rejectionReason } = body;
        if (
            !reportId ||
            !status ||
            (status === "Rejected" && !rejectionReason)
        ) {
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

        if (status === "Approved") updateQuery.approvedBy = decodedToken.id;
        else if (status === "Rejected") updateQuery.response = rejectionReason;

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
                        else updateSubmitQuery.status = "Failed";

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
