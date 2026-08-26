import prisma from "@/lib/prisma";

export interface NN001RecordInput {
    RETURN_KEY: string;
    INST_CODE: string;
    FIN_YEAR: number;
    START_DATE: Date;
    END_DATE: Date;
    LOANS_ADVANCE_AMOUNT?: number;
    COLLATERAL_VALUE?: number;
    LOANS_ADVANCE_PCT_CAPITAL?: number;
    RETURN_ITEMS?: any;
    DYNAMIC_ITEMS?: any;
    dynamicAreas?: Array<{
        AREA: number;
        AREA_NAME: string;
        rows: Array<{
            rowIndex: number;
            counterpartyName?: string;
            loanType?: string;
            sector?: string;
            loanAmount?: number;
            recategorizationDate?: string;
            status?: string;
            collateralType?: string;
            collateralValue?: number;
            pctCapital?: number;
        }>;
    }>;
}

export const createNN001Record = async (recordData: NN001RecordInput) => {
    try {
        const { dynamicAreas, ...mainRecord } = recordData;

        const created = await prisma.nN001.create({
            data: {
                ...mainRecord,
                dynamicAreas: dynamicAreas?.length
                    ? {
                          create: dynamicAreas.map((area) => ({
                              AREA: area.AREA,
                              AREA_NAME: area.AREA_NAME,
                              rows: {
                                  create: area.rows.map((row) => ({
                                      rowIndex: row.rowIndex,
                                      counterpartyName: row.counterpartyName,
                                      loanType: row.loanType,
                                      sector: row.sector,
                                      loanAmount: row.loanAmount,
                                      recategorizationDate: row.recategorizationDate,
                                      status: row.status,
                                      collateralType: row.collateralType,
                                      collateralValue: row.collateralValue,
                                      pctCapital: row.pctCapital
                                  }))
                              }
                          }))
                      }
                    : undefined
            },
            include: {
                dynamicAreas: {
                    include: {
                        rows: true
                    }
                }
            }
        });

        return { created: true, record: created };
    } catch (e: any) {
        console.error("Error saving NN001 record to MySQL:", e.message);
        return { created: false, error: e.message };
    }
};
