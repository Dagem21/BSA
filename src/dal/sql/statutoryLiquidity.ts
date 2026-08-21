import prisma from "@/lib/prisma";

export const createStatutoryLiquidityRecords = async (records: any[]) => {
    try {
        await prisma.statutoryLiquidity.createMany({
            data: records,
            skipDuplicates: true
        });
        return { created: true };
    } catch (e: any) {
        console.error("Error saving StatutoryLiquidity records:", e.message);
        return { created: false, error: e.message };
    }
};

export const createZS001Record = async (record: any) => {
    try {
        const created = await prisma.zS001.create({
            data: record
        });
        return { created: true, record: created };
    } catch (e: any) {
        console.error("Error saving ZS001 record:", e.message);
        return { created: false, error: e.message };
    }
};
