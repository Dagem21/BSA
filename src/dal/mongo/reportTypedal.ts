require("@/models/userSchema");
require("@/models/reportTypeSchema");

import { ReportTypeDto } from "@/dto/reportType";
const mongoose = require("mongoose");
const reportTypeSchema = mongoose.model("reporttypes");

export const findReportType = async (filter?: ReportTypeDto) => {
    try {
        const reportType = await reportTypeSchema.find(filter);
        return reportType;
    } catch (e) {
        return null;
    }
};

export const createReportType = async (reportType: ReportTypeDto) => {
    try {
        const reportTypeCreated = await reportTypeSchema.create(reportType);
        return { created: reportTypeCreated };
    } catch (e) {
        return { created: false };
    }
};

export const updateReportType = async (
    id: string | null,
    update: ReportTypeDto
) => {
    try {
        const reportTypeUpdated = await reportTypeSchema.updateOne(
            { id },
            { $set: update }
        );
        return {
            found: reportTypeUpdated.matchedCount === 1,
            updated: reportTypeUpdated.matchedCount === 1
        };
    } catch (e) {
        return { found: false, updated: false };
    }
};
