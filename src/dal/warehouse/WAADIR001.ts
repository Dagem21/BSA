import { getOraclePool } from "@/lib/oracle";
import oracledb from "oracledb";

export const findWAADIR001sDW = async (query?: any) => {
    let connection;
    try {
        const pool = await getOraclePool();
        connection = await pool.getConnection();

        let baseQuery = `SELECT * FROM whuser.w_conv_avg_deposit_int_rate_f WHERE 1=1`;
        const queryParams: any = {};

        if (query?.BUSINESS_DATE) {
            baseQuery += ` AND business_date = TO_DATE(:BUSINESS_DATE, 'YYYY-MM-DD')`;
            queryParams.BUSINESS_DATE = query.BUSINESS_DATE?.substring(0, 10);
        }

        const deposit_rate = await connection.execute(baseQuery, queryParams, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return deposit_rate;
    } catch (e) {
        return null;
    }
};
