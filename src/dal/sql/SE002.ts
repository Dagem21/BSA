import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const findSE002s = async (query?: Object) => {
    try {
        const se002 = await prisma.sE002.findMany({
            where: query
        });
        return se002;
    } catch (e) {
        return null;
    }
};

export const createSE002s = async (se002: Prisma.SE002CreateManyInput[]) => {
    try {
        const result = await prisma.sE002.createMany({
            data: se002,
            skipDuplicates: true
        });

        return { created: true, data: result };
    } catch (e: any) {
        console.error(e.message);
        return { created: false, error: e.message };
    }
};

export const deleteSE002s = async (query?: Object) => {
    try {
        const result = await prisma.sE002.deleteMany({
            where: query
        });
        return result;
    } catch (e) {
        return null;
    }
};
