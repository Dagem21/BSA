import { SystemLogDto } from "@/dto/systemLog";

require("@/models/systemLog");

const mongoose = require("mongoose");
const systemLogSchema = mongoose.model("systemlog");

export const findSystemLogs = async (
    filter?: SystemLogDto,
    page: number = 1,
    limit: number = 10
) => {
    try {
        const logs = await systemLogSchema
            .find(filter)
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "reportID"
            });
        const total = await systemLogSchema.countDocuments(filter);
        return { logs, page, limit, total };
    } catch (e) {
        return null;
    }
};

export const createSystemLog = async (log: SystemLogDto) => {
    try {
        const logCreated = await systemLogSchema.create(log);
        return logCreated;
    } catch (e: any) {
        return false;
    }
};

export const updateSystemLog = async (id: string, log: SystemLogDto) => {
    try {
        const logUpdated = await systemLogSchema.updateOne({ _id: id }, log);
        return logUpdated;
    } catch (e: any) {
        return false;
    }
};
