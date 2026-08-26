import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma";
import type { PoolConfig } from "mariadb";

declare global {
    var prismaAdapter: PrismaMariaDb | undefined;
    var prisma: PrismaClient | undefined;
}

const getAdapter = () => {
    if (!globalThis.prismaAdapter) {
        const rawUrl =
            process.env.DATABASE_URL ||
            "mysql://root:1234qweAsd%40%23@localhost:3306/bsa";

        let dbConfig: PoolConfig;

        try {
            const parsed = new URL(rawUrl);
            dbConfig = {
                host: parsed.hostname || "localhost",
                port: parsed.port ? parseInt(parsed.port, 10) : 3306,
                user: decodeURIComponent(parsed.username || "root"),
                password: decodeURIComponent(parsed.password || ""),
                database: parsed.pathname.replace(/^\//, "") || "bsa",
                connectionLimit: 20,
                connectTimeout: 10000,
                acquireTimeout: 10000
            };
        } catch (e) {
            dbConfig = {
                host: "localhost",
                port: 3306,
                user: "root",
                password: "1234qweAsd@#",
                database: "bsa",
                connectionLimit: 20,
                connectTimeout: 10000,
                acquireTimeout: 10000
            };
        }

        globalThis.prismaAdapter = new PrismaMariaDb(dbConfig);
    }
    return globalThis.prismaAdapter;
};

const prismaClientSingleton = () => {
    const adapter = getAdapter();
    return new PrismaClient({ adapter });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
