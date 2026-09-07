import prisma from "@/lib/prisma";

export const findWAADIR001s = async (query?: Object) => {
    try {
        const depositRates = await prisma.wAADIR001.findMany({
            where: query
        });
        return depositRates;
    } catch (e) {
        return null;
    }
};

export const createWAADIR001s = async (depositRates: any) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.wAADIR001.createMany({
                data: depositRates,
                skipDuplicates: true
            });
        });
        return { created: result };
    } catch (e: any) {
        console.log(e.message);
        return { created: false };
    }
};

export const deleteWAADIR001s = async (query?: Object) => {
    try {
        const result = await prisma.wAADIR001.deleteMany({
            where: query
        });
        return result;
    } catch (e) {
        return null;
    }
};
