import { ReportDto } from "@/dto/report";

require("@/models/reportSchema");
const mongoose = require("mongoose");
const reportSchema = mongoose.model("reports");

export const findReports = async (filter?: ReportDto) => {
    try {
        const report = await reportSchema.find(filter).populate({
            path: "reportType"
        });
        return report;
    } catch (e) {
        return null;
    }
};

export const createReport = async (report: ReportDto) => {
    try {
        const reportCreated = await reportSchema.create(report);
        return { created: reportCreated };
    } catch (e: any) {
        return { created: false };
    }
};

export const updateReport = async (id: string, update: ReportDto) => {
    try {
        const reportUpdated = await reportSchema.updateOne(
            { id },
            { $set: update }
        );
        return {
            found: reportUpdated.matchedCount === 1,
            updated: reportUpdated.matchedCount === 1
        };
    } catch (e) {
        return { found: false, updated: false };
    }
};
