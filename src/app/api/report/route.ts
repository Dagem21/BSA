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

export async function POST(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();
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
        require("@/models/reportTypeSchema");
        const ReportTypeModel =
            mongoose.models.reporttypes ||
            mongoose.model("reporttypes");
        const reportTypeDoc = await ReportTypeModel.findById(
            validatedReport.reportType
        );
        const reportIdStr = reportTypeDoc?.reportId || "";
        const fileName = generateFileName(reportIdStr);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (!buffer || buffer.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "The uploaded file is empty (0 bytes). Please upload a valid Excel file."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const uploadDir = path.join(process.cwd(), "reports", "excel");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.name).toLowerCase();
        const excelFile = `${fileName}${ext}`;
        const jsonFile = `${fileName}.json`;
        const filePath = path.join(uploadDir, excelFile);
        await writeFile(filePath, buffer);

        // Trigger template validation and report processing based on report type
        try {
            // 1. Strict Template Verification
            let validationResult;
            if (
                reportIdStr.toUpperCase().includes("NN001") ||
                reportIdStr.toUpperCase().includes("NACNN001") ||
                reportIdStr.toUpperCase().includes("OL001") ||
                reportIdStr.toUpperCase().includes("COL_ACQ_18M_OL001") ||
                reportIdStr.toUpperCase().includes("MA001") ||
                reportIdStr.toUpperCase().includes("NBE_MAT_ANL_MA001")
            ) {
                const { validateNN001Template } = await import("@/utils/fileValidation");
                validationResult = await validateNN001Template(file, reportIdStr);
            } else {
                validationResult = { isValid: true } as any;
            }
            if (!validationResult.isValid) {
                return new Response(
                    JSON.stringify({
                        error: validationResult.errorMessage || "This is not the exact template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            const jsonFilePath = path.join(
                process.cwd(),
                "reports",
                "json",
                jsonFile
            );

            const startDateStr = validatedReport.startDate.toISOString();
            const endDateStr = validatedReport.endDate.toISOString();

            // 2. Process NN001 Report Format
            if (
                reportIdStr.toUpperCase().includes("NN001") ||
                reportIdStr.toUpperCase().includes("NACNN001")
            ) {
                const { processNN001Report } = await import(
                    "@/utils/services/NN001/NN001"
                );
                const procRes = await processNN001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process NN001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // Process FB001 Report Format
            else if (reportIdStr.toUpperCase().includes("FB001")) {
                const { processFB001Report } = await import(
                    "@/utils/services/FB001/FB001"
                );
                const procRes: any = await processFB001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process FB001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // Process BP001 / DP001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("BP001") ||
                reportIdStr.toUpperCase().includes("DP001") ||
                reportIdStr.toUpperCase().includes("INT_FRE_SP")
            ) {
                const { processBP001Report } = await import(
                    "@/utils/services/BP001/BP001"
                );
                const procRes: any = await processBP001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process BP001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // Process MWAL001 Report Format
            else if (reportIdStr.toUpperCase().includes("MWAL001")) {
                const { processMWAL001Report } = await import(
                    "@/utils/services/MWAL001/MWAL001"
                );
                const procRes: any = await processMWAL001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process MWAL001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // Process MWAC001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("MWAC001") ||
                reportIdStr.toUpperCase().includes("LCMWAC001") ||
                reportIdStr.toUpperCase().includes("WALIR")
            ) {
                const { processMWAC001Report } = await import(
                    "@/utils/services/MWAC001/MWAC001"
                );
                const procRes: any = await processMWAC001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process MWAC001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // Process LB002 Report Format
            else if (
                reportIdStr.toUpperCase().includes("LB002") ||
                reportIdStr.toUpperCase().includes("BOR_TEN_PER_LB002")
            ) {
                const { processLB002Report } = await import(
                    "@/utils/services/LB002/LB002"
                );
                const procRes: any = await processLB002Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process LB002 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 3. Process ZS001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("ZS001") ||
                reportIdStr.toUpperCase().includes("LSR")
            ) {
                const { processZS001Report } = await import(
                    "@/utils/services/ZS001/ZS001"
                );
                const procRes: any = await processZS001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process ZS001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 4. Process OL001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("OL001") ||
                reportIdStr.toUpperCase().includes("COL_ACQ_18M_OL001")
            ) {
                const { processOL001Report } = await import(
                    "@/utils/services/OL001/OL001"
                );
                const procRes = await processOL001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process OL001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 5. Process MA001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("MA001") ||
                reportIdStr.toUpperCase().includes("NBE_MAT_ANL_MA001")
            ) {
                const { processMA001Report } = await import(
                    "@/utils/services/MA001/MA001"
                );
                const procRes = await processMA001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process MA001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 6. Process MK001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("MK001") ||
                reportIdStr.toUpperCase().includes("KEY BALANCE SHEET")
            ) {
                const { processMK001Report } = await import(
                    "@/utils/services/MK001/MK001"
                );
                const procRes: any = await processMK001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process MK001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 7. Process MB001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("MB001") ||
                reportIdStr.toUpperCase().includes("MB001MB001")
            ) {
                const { processMB001Report } = await import(
                    "@/utils/services/MB001/MB001"
                );
                const procRes: any = await processMB001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process MB001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 8. Process SRRYY001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("SRR") ||
                reportIdStr.toUpperCase().includes("SRRYY001")
            ) {
                const { processSRRYY001Report } = await import(
                    "@/utils/services/SRRYY001/SRRYY001"
                );
                const procRes = await processSRRYY001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process SRRYY001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 9. Process RB001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("RB001") ||
                reportIdStr.toUpperCase().includes("RESERVE BASE")
            ) {
                const { processRB001Report } = await import(
                    "@/utils/services/RB001/RB001"
                );
                const procRes: any = await processRB001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process RB001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 10. Process ZS001 Report Format (Duplicate block check)
            else if (
                reportIdStr.toUpperCase().includes("ZS001") ||
                reportIdStr.toUpperCase().includes("LSR")
            ) {
                const { processZS001Report } = await import(
                    "@/utils/services/ZS001/ZS001"
                );
                const procRes: any = await processZS001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process ZS001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 11. Process KK001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("KK001") ||
                reportIdStr.toUpperCase().includes("M_CC")
            ) {
                const { processKK001Report } = await import(
                    "@/utils/services/KK001/KK001"
                );
                const procRes: any = await processKK001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process KK001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 12. Process REGRL002 Report Format
            else if (
                reportIdStr.toUpperCase().includes("RL002") ||
                reportIdStr.toUpperCase().includes("REGRL002") ||
                reportIdStr.toUpperCase().includes("LOAN_RAN")
            ) {
                const { processREGRL002Report } = await import(
                    "@/utils/services/REGRL002/REGRL002"
                );
                const procRes = await processREGRL002Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process REGRL002 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 13. Process MD002 Report Format
            else if (
                reportIdStr.toUpperCase().includes("MD002") ||
                reportIdStr.toUpperCase().includes("CDBY") ||
                reportIdStr.toUpperCase().includes("SECTOR AND REG")
            ) {
                const { processMD002Report } = await import(
                    "@/utils/services/MD002/MD002"
                );
                const procRes = await processMD002Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process MD002 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
            // 14. Process DPWADP001 Report Format
            else if (
                reportIdStr.toUpperCase().includes("DPWADP001") ||
                reportIdStr.toUpperCase().includes("DPW")
            ) {
                const { processDPWADP001Report } = await import(
                    "@/utils/services/DPWADP001/DPWADP001"
                );
                const procRes: any = await processDPWADP001Report(
                    decodedToken?.instCode || "0000001",
                    filePath,
                    startDateStr,
                    endDateStr,
                    filePath,
                    jsonFilePath
                );
                if (!procRes.success) {
                    return new Response(
                        JSON.stringify({
                            error: procRes.error || "Failed to process DPWADP001 template file."
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
        } catch (procErr: any) {
            console.error("Error processing report template format:", procErr);
            return new Response(
                JSON.stringify({
                    error: procErr.message || "Failed to process uploaded Excel template."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
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
