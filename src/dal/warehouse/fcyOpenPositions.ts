import { getOraclePool } from "@/lib/oracle";
import oracledb from "oracledb";

export const findOpenPositions = async (query?: any) => {
    let connection;
    try {
        const pool = await getOraclePool();
        connection = await pool.getConnection();

        let baseQuery = `SELECT * FROM beneficiaries WHERE 1=1`;
        const queryParams: any = {};

        if (query?.businessDate) {
            baseQuery += ` AND businessDate = :businessDate`;
            queryParams.businessDate = query?.businessDate;
        }

        const positions = await connection.execute(baseQuery, queryParams, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return positions;
    } catch (e) {
        return null;
    }
};
