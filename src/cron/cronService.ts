"use server";

import { findReportType } from "@/dal/mongo/reportTypedal";
import { ReportTypeDto } from "@/dto/reportType";
import { FrequncyTypes, ServiceTypes } from "@/types/types";
import { checkFirstDays } from "@/utils/checkDate";
import { getService } from "./serviceMap";
import { SystemLogDto } from "@/dto/systemLog";
import { createSystemLog, updateSystemLog } from "@/dal/mongo/systemLogsdal";

const startService = async () => {
    const log: SystemLogDto = {
        startedAt: new Date().toISOString(),
        status: "Running",
        description: "Daily service initiated."
    };

    const created: any = await createSystemLog(log);

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
        if (service) await service(reportType._id?.toString());
    });

    await updateSystemLog(created?._id?.toString(), {
        finishedAt: new Date().toISOString(),
        status: "Success",
        description: "Daily service completed."
    });
};

export const cronService = async () => {
    // cron.schedule("* * * * *", async () => {
    console.log("Cron started running at : ", new Date().toString());
    await startService();
    console.log("Cron finished at : ", new Date().toString());
    // });
};
