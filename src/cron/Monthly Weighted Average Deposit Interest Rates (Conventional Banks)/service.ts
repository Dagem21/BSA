import { createReport, findReports } from "@/dal/mongo/reportdal";
import { ReportDto } from "@/dto/report";
import { WAADIR001 } from "@/generated/prisma";
import { SystemLogDto } from "@/dto/systemLog";
import { createSystemLog } from "@/dal/mongo/systemLogsdal";
import { findWAADIR001sDW } from "@/dal/warehouse/WAADIR001";
import {
    createWAADIR001s,
    deleteWAADIR001s,
    findWAADIR001s
} from "@/dal/sql/WAADIR001";
import { populateWAADIR001Report } from "@/utils/services/WAADIR001/WAADIR001";
import { Decimal } from "@/generated/prisma/runtime/client";

export const service = async (reportTypeID: string) => {
    try {
        const log: SystemLogDto = {
            reportID: reportTypeID,
            startedAt: new Date().toISOString(),
            status: "Running"
        };

        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 11);
        yesterday.setUTCHours(0, 0, 0, 0);

        const filter: any = { BUSINESS_DATE: yesterday.toISOString() };
        console.log(filter);

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

        const depositRatesDW = await findWAADIR001sDW(filter);
        let batch: any[] = [];

        const resultSet = depositRatesDW?.rows;

        if (!resultSet) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form data warehouse.";
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
            drData.WEIGHED_AVERAGE = drData.WEIGHED_AVARAGE;
            delete drData.WEIGHED_AVARAGE;
            batch.push(drData);
        });

        if (batch.length > 0) {
            await deleteWAADIR001s(filter);
            await createWAADIR001s(batch);
        } else {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form data warehouse.";
            await createSystemLog(log);
            return;
        }

        const wAADIR001s: WAADIR001[] = (await findWAADIR001s(filter)) || [];

        if (wAADIR001s?.length === 0) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form database.";
            await createSystemLog(log);
            return;
        }

        const wAADIR001sFormatted: WAADIR001[] = wAADIR001s.map((row) => {
            row.BALANCE = row?.BALANCE
                ? Decimal(parseFloat(row.BALANCE.toString()) / 1000000)
                : row.BALANCE;
            return row;
        });

        const { created, fileNameExcel, fileNameJson } =
            await populateWAADIR001Report(
                "0000001",
                wAADIR001sFormatted,
                yesterday,
                yesterday
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
        console.log(error.message);
    }
};
