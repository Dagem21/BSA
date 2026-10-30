import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const findOpenPositions = async (query?: Object) => {
    try {
        const positions = await prisma.openPosition.findMany({
            where: query
        });
        return positions;
    } catch (e) {
        return null;
    }
};

export const createOpenPositions = async (
    openPositions: Prisma.OpenPositionCreateManyInput[]
) => {
    try {
        const result = await prisma.openPosition.createMany({
            data: openPositions,
            skipDuplicates: true
        });

        return { created: true, data: result };
    } catch (e: any) {
        console.error(e.message);
        return { created: false, error: e.message };
    }
};

export const deleteOpenPositions = async (query?: Object) => {
    try {
        const result = await prisma.openPosition.deleteMany({
            where: query
        });
        return result;
    } catch (e) {
        return null;
    }
};
