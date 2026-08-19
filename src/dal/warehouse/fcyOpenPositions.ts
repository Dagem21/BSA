import { getOraclePool } from "@/lib/oracle";
import oracledb from "oracledb";

export const findOpenPositions = async (query?: any) => {
    let connection;
    try {
        const pool = await getOraclePool();
        connection = await pool.getConnection();

        let baseQuery = `SELECT * FROM whuser.w_nbe_open_position_cbe_f WHERE 1=1`;
        const queryParams: any = {};

        if (query?.BUSINESS_DATE) {
            baseQuery += ` AND business_date = TO_DATE(:BUSINESS_DATE, 'YYYY-MM-DD')`;
            queryParams.BUSINESS_DATE = query.BUSINESS_DATE?.substring(0, 10);
        }

        const positions = await connection.execute(baseQuery, queryParams, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return positions;
    } catch (e) {
        return null;
    }
};
