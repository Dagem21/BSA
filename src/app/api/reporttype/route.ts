import * as yup from "yup";
import {
    createReportType,
    findReportType,
    updateReportType
} from "@/dal/mongo/reportTypedal";
import { ReportTypeDto } from "@/dto/reportType";
import { verifyUserAuth } from "@/utils/authHelper";
import { writeToLog } from "@/utils/log";
import { reportTypeSchema, reportTypeUpdateSchema } from "@/yup/reportType";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const decodedToken = await verifyUserAuth();

        const filter: any = {};
        if (decodedToken?.role !== "Admin" && decodedToken?.allowedReports?.length > 0) {
            filter._id = { $in: decodedToken?.allowedReports };
        }

        const reportTypes = await findReportType(filter);
        if (reportTypes) {
            return new Response(
                JSON.stringify({
                    message: "Report type fetched.",
                    reportTypes
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
        writeToLog(error, "Create Report Type");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST(request: NextRequest) {
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
        let reportType = body;

        const validatedReportType = await reportTypeSchema.validate(
            reportType,
            {
                abortEarly: false
            }
        );
        const reportTypeFormatted: ReportTypeDto = {
            reportId: validatedReportType.reportId,
            description: validatedReportType.description,
            frequency: validatedReportType.frequency,
            service: validatedReportType.service,
            createdBy: decodedToken?.id
        };

        const { created } = await createReportType(reportTypeFormatted);
        if (created) {
            return new Response(
                JSON.stringify({
                    error: "Report type created."
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: "Report type not created."
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
        if (yup.ValidationError.isError(error)) {
            return new Response(
                JSON.stringify({
                    error: "Validation failed for inputs!",
                    details: error.errors
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        writeToLog(error, "Create Report Type");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await verifyUserAuth();
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
        let reportType = body;

        const validatedReportType = await reportTypeUpdateSchema.validate(
            reportType,
            {
                abortEarly: false
            }
        );

        const reportTypeFormatted: ReportTypeDto = Object.fromEntries(
            Object.entries({
                reportId: validatedReportType.reportId,
                description: validatedReportType.description,
                frequency: validatedReportType.frequency,
                service: validatedReportType.service
            }).filter(([_, value]) => value !== null)
        ) as ReportTypeDto;

        const { updated } = await updateReportType(
            validatedReportType.id,
            reportTypeFormatted
        );
        if (updated) {
            return new Response(
                JSON.stringify({
                    error: "Report type updated."
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: "Report type not updated."
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
        if (yup.ValidationError.isError(error)) {
            return new Response(
                JSON.stringify({
                    error: "Validation failed for inputs!",
                    details: error.errors
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        writeToLog(error, "Create Report Type");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
