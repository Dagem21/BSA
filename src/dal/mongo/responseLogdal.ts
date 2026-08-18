import { ResponseLogDto } from "@/dto/responseLog";

require("@/models/reportTypeSchema");
require("@/models/reportSchema");
require("@/models/responseLogSchema");

const mongoose = require("mongoose");
const responseLogSchema = mongoose.model("responselog");

export const findResponseLogs = async (filter?: ResponseLogDto) => {
    try {
        const report = await responseLogSchema.find(filter).populate({
            path: "reportType"
        });
        return report;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const createResponseLog = async (log: ResponseLogDto) => {
    try {
        const reportCreated = await responseLogSchema.create(log);
        return { created: reportCreated };
    } catch (e: any) {
        return { created: false };
    }
};
