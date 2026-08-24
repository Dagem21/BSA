require("@/models/reportTypeSchema");
require("@/models/reportSchema");

import { ReportDto } from "@/dto/report";
import { Types } from "mongoose";

const mongoose = require("mongoose");
const reportSchema = mongoose.model("reports");

export const findReport = async (id: string) => {
    try {
        const report = await reportSchema.findById(id);
        return report;
    } catch (e) {
        return null;
    }
};

export const findReports = async (
    filter?: ReportDto,
    page: number = 1,
    limit: number = 10
) => {
    try {
        const reports = await reportSchema
            .find(filter)
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "reportType"
            });
        const total = await reportSchema.countDocuments(filter);
        return { reports, page, limit, total };
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

export const updateReport = async (id: Types.ObjectId, update: ReportDto) => {
    try {
        const reportUpdated = await reportSchema.updateOne(
            { _id: id },
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
