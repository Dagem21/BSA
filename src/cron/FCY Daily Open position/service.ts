// import { findOpenPositions } from "@/dal/other/fcyOpenPositions";

import { createReport } from "@/dal/mongo/reportdal";
import { findOpenPositions } from "@/dal/sql/fcyOpenPositions";
import { ReportDto } from "@/dto/report";
import { OpenPosition } from "@/generated/prisma";
import { populateOpenPositionReport } from "@/utils/services/OP001/OP001";

export const service = async () => {
    try {
        const filter = { businessDate: "2026-08-13T00:00:00.000Z" };
        const openPositions: OpenPosition[] =
            (await findOpenPositions(filter)) || [];

        const { created, fileNameExcel, fileNameJson } =
            await populateOpenPositionReport(openPositions);

        if (!created) {
            return false;
        }

        const newReport: ReportDto = {
            file: fileNameExcel,
            json: fileNameJson,
            startDate: "2026-08-13T00:00:00.000Z",
            endDate: "2026-08-13T00:00:00.000Z",
            reportingDate: "2026-08-13T00:00:00.000Z",
            reportType: "6a7eee686da7fe6f397b46e6",
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
