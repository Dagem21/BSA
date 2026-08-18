import cron from "node-cron";

import { findReportType } from "@/dal/mongo/reportTypedal";
import { ReportTypeDto } from "@/dto/reportType";
import { FrequncyTypes, ServiceTypes } from "@/types/types";
import { checkFirstDays } from "@/utils/checkDate";
import { getService } from "./serviceMap";

const startService = async () => {
    const currentDate = new Date();
    const firstDays = checkFirstDays(currentDate);

    const frequencies: FrequncyTypes[] = [FrequncyTypes.Daily];
    if (firstDays.isFirstDayOfWeek) frequencies.push(FrequncyTypes.Weekly);
    if (firstDays.isFirstDayOfMonth) frequencies.push(FrequncyTypes.Monthly);
    if (firstDays.isFirstDayOfQuarter)
        frequencies.push(FrequncyTypes.Quarterly);
    if (firstDays.isFirstDayOfYear) frequencies.push(FrequncyTypes.Yearly);

    const filter: ReportTypeDto = {
        frequency: { $in: frequencies },
        service: ServiceTypes.Auto
    };

    const reportTypesToRun = await findReportType(filter);

    reportTypesToRun.forEach(async (reportType: ReportTypeDto) => {
        if (!reportType._id) return;
        const service = getService(reportType._id?.toString());
        console.log(service);
        if (service) await service(reportType._id);
    });
};

export const cronService = () => {
    cron.schedule("* * * * *", async () => {
        console.log("Cron started running at : ", new Date().toString());
        await startService();
        console.log("Cron finished at : ", new Date().toString());
    });
};
