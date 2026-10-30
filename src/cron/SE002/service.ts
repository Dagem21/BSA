import { createReport, findReports } from "@/dal/mongo/reportdal";
import { ReportDto } from "@/dto/report";
import { SE002 } from "@/generated/prisma";
import { SystemLogDto } from "@/dto/systemLog";
import { createSystemLog } from "@/dal/mongo/systemLogsdal";
import { Decimal } from "@/generated/prisma/runtime/client";
import { findSE002DW } from "@/dal/warehouse/SE002";
import { createSE002s, deleteSE002s, findSE002s } from "@/dal/sql/SE002";
import { populateSE002Report } from "@/utils/services/Auto/SE002/SE002";

export const service = async (
    reportTypeID: string,
    reportID: string,
    reportDate?: Date
) => {
    const log: SystemLogDto = {
        reportID: reportTypeID,
        startedAt: new Date().toISOString(),
        status: "Running"
    };
    try {
        const yesterday = reportDate || new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        yesterday.setUTCHours(0, 0, 0, 0);

        const filter: any = { BUSINESS_DATE: yesterday.toISOString() };

        const pendingReport = await findReports({
            reportType: reportTypeID,
            startDate: yesterday.toISOString(),
            status: { $in: ["Pending", "Approved", "Submitted"] }
        });

        if (pendingReport?.total > 0) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Report already generated for today.";
            await createSystemLog(log);
            return;
        }

        const se002DW = await findSE002DW(filter);
        let batch: any[] = [];

        const resultSet = se002DW?.rows;

        if (!resultSet) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description =
                "Data fetch failed form data warehouse. No rows returned.";
            await createSystemLog(log);
            return;
        }

        resultSet.forEach((row) => {
            const drData: any = row;
            const date = new Date(drData.BUSINESS_DATE);
            const businessDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            drData.BUSINESS_DATE = businessDate;
            batch.push(drData);
        });

        if (batch.length > 0) {
            await deleteSE002s(filter);
            const { created, error } = await createSE002s(batch);
            if (!created || error) {
                log.status = "Failed";
                log.finishedAt = new Date().toISOString();
                log.description = error || "Failed to save to local database.";
                await createSystemLog(log);
                return;
            }
        } else {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description =
                "Data fetch failed form data warehouse. Result set empty.";
            await createSystemLog(log);
            return;
        }

        const se002s: SE002[] = (await findSE002s(filter)) || [];

        if (se002s?.length === 0) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form local database.";
            await createSystemLog(log);
            return;
        }

        const se002sFormatted: SE002[] = se002s.map((row) => {
            row.AMOUNT = row?.AMOUNT
                ? Decimal(parseFloat(row.AMOUNT.toString()) / 1000000)
                : row.AMOUNT;
            return row;
        });

        const { created, fileNameExcel, fileNameJson } =
            await populateSE002Report(
                "0000001",
                se002sFormatted,
                yesterday,
                yesterday,
                reportID
            );

        if (!created) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Report generation failed.";
            await createSystemLog(log);
            return;
        }

        const reportingDate = new Date();
        reportingDate.setUTCHours(0, 0, 0, 0);

        const newReport: ReportDto = {
            file: fileNameExcel,
            json: fileNameJson,
            startDate: yesterday.toISOString(),
            endDate: yesterday.toISOString(),
            reportingDate: reportingDate.toISOString(),
            reportType: reportTypeID,
            status: "Pending",
            createdBy: "system"
        };

        const { created: reportCreated } = await createReport(newReport);
        if (reportCreated) {
            log.status = "Success";
            log.finishedAt = new Date().toISOString();
            log.description = "Report generated.";
            await createSystemLog(log);
            return true;
        }
    } catch (error: any) {
        log.status = "Failed";
        log.finishedAt = new Date().toISOString();
        log.description = error.message || "Unknown error.";
        await createSystemLog(log);
    }
};
