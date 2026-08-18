import oracledb from "oracledb";

const globalForOracle = globalThis as unknown as {
    oraclePool: oracledb.Pool | undefined;
};

export async function getOraclePool() {
    if (!globalForOracle.oraclePool) {
        globalForOracle.oraclePool = await oracledb.createPool({
            user: process.env.DWUSER,
            password: process.env.DWPASSWORD,
            connectString: process.env.DWCONNECTION,
            poolMin: 2, // Minimum connections to keep open
            poolMax: 10, // Maximum parallel connections allowed
            poolIncrement: 1
        });
        console.log("Oracle connection pool initialized.");
    }

    return globalForOracle.oraclePool;
}
