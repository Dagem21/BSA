import { SystemLogDto } from "@/dto/systemLog";

require("@/models/systemLog");

const mongoose = require("mongoose");
const systemLogSchema = mongoose.model("systemlog");

export const findSystemLogs = async (filter?: SystemLogDto) => {
    try {
        const report = await systemLogSchema.find(filter);
        return report;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const createSystemLog = async (log: SystemLogDto) => {
    try {
        const logCreated = await systemLogSchema.create(log);
        return logCreated;
    } catch (e: any) {
        console.log(e.message);
        return false;
    }
};

export const updateSystemLog = async (id: string, log: SystemLogDto) => {
    try {
        const logUpdated = await systemLogSchema.updateOne({ _id: id }, log);
        return logUpdated;
    } catch (e: any) {
        console.log(e.message);
        return false;
    }
};
