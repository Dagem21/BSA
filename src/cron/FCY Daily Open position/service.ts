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
        yesterday.setUTCDate(yesterday.getUTCDate() - 2);
        yesterday.setUTCHours(0, 0, 0, 0);

        const filter: any = { businessDate: yesterday.toISOString() };

        // const openPositionsDW = await findOpenPositionsDW(filter);
        // let batch = [];

        // const resultSet = openPositionsDW?.resultSet;

        // if (!resultSet) {
        //     return false;
        // }

        // let row;
        // while ((row = await resultSet.getRow())) {
        //     const opData: any = row;
        //     delete opData.id;
        //     batch.push(opData);
        // }

        // if (batch.length > 0) {
        //     await createOpenPositions(batch);
        // }

        // await resultSet.close();

        const openPositions: OpenPosition[] =
            (await findOpenPositions(filter)) || [];

        const { created, fileNameExcel, fileNameJson } =
            await populateOpenPositionReport(
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
