// import { findOpenPositions } from "@/dal/other/fcyOpenPositions";

import { createReport } from "@/dal/mongo/reportdal";
import { findOpenPositions as findOpenPositionsDW } from "@/dal/warehouse/fcyOpenPositions";
import {
    createOpenPositions,
    findOpenPositions
} from "@/dal/sql/fcyOpenPositions";
import { ReportDto } from "@/dto/report";
import { OpenPosition } from "@/generated/prisma";
import { populateOpenPositionReport } from "@/utils/services/OP001/OP001";

export const service = async (reportTypeID: string) => {
    try {
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 3);
        yesterday.setUTCHours(0, 0, 0, 0);

        const filter: any = { BUSINESS_DATE: yesterday.toISOString() };

        const openPositionsDW = await findOpenPositionsDW(filter);
        let batch: any[] = [];

        const resultSet = openPositionsDW?.rows;

        if (!resultSet) {
            return false;
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
        }

        const openPositions: OpenPosition[] =
            (await findOpenPositions(filter)) || [];

        if (openPositions?.length === 0) {
            console.log("no record");
            return false;
        }

        const { created, fileNameExcel, fileNameJson } =
            await populateOpenPositionReport(
                "0000001",
                openPositions,
                yesterday,
                yesterday
            );

        if (!created) {
            return false;
        }

        const newReport: ReportDto = {
            file: fileNameExcel,
            json: fileNameJson,
            startDate: yesterday.toISOString(),
            endDate: yesterday.toISOString(),
            reportingDate: new Date().toISOString(),
            reportType: reportTypeID,
            status: "Pending",
            createdBy: "system"
        };

        const { created: reportCreated } = await createReport(newReport);
        if (reportCreated) {
            return true;
        }
    } catch (error: any) {
        console.log(error.message);
    }
};
