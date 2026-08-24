// import { findOpenPositions } from "@/dal/other/fcyOpenPositions";

import { createReport, findReports } from "@/dal/mongo/reportdal";
import { findOpenPositions as findOpenPositionsDW } from "@/dal/warehouse/fcyOpenPositions";
import {
    createOpenPositions,
    findOpenPositions
} from "@/dal/sql/fcyOpenPositions";
import { ReportDto } from "@/dto/report";
import { OpenPosition } from "@/generated/prisma";
import { populateOpenPositionReport } from "@/utils/services/OP001/OP001";
import { SystemLogDto } from "@/dto/systemLog";
import { createSystemLog } from "@/dal/mongo/systemLogsdal";

export const service = async (reportTypeID: string) => {
    try {
        const log: SystemLogDto = {
            reportID: reportTypeID,
            startedAt: new Date().toISOString(),
            status: "Running"
        };

        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 5);
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

        const openPositionsDW = await findOpenPositionsDW(filter);
        let batch: any[] = [];

        const resultSet = openPositionsDW?.rows;

        if (!resultSet) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form data warehouse.";
            await createSystemLog(log);
            return;
        }

        resultSet.forEach((row) => {
            const opData: any = row;
            const date = new Date(opData.BUSINESS_DATE);
            const businessDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            opData.BUSINESS_DATE = businessDate;
            batch.push(opData);
        });

        if (batch.length > 0) {
            await createOpenPositions(batch);
        } else {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form data warehouse.";
            await createSystemLog(log);
            return;
        }

        const openPositions: OpenPosition[] =
            (await findOpenPositions(filter)) || [];

        if (openPositions?.length === 0) {
            log.status = "Failed";
            log.finishedAt = new Date().toISOString();
            log.description = "Data fetch failed form database.";
            await createSystemLog(log);
            return;
        }

        const { created, fileNameExcel, fileNameJson } =
            await populateOpenPositionReport(
                "0000001",
                openPositions,
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
