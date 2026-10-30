import { Prisma } from "@/generated/prisma";
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

export const createWAADIR001s = async (
    depositRates: Prisma.WAADIR001CreateManyInput[]
) => {
    try {
        const result = await prisma.wAADIR001.createMany({
            data: depositRates,
            skipDuplicates: true
        });

        return { created: true, data: result };
    } catch (e: any) {
        console.error(e.message);
        return { created: false, error: e.message };
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
