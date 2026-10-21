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

export const createOpenPositions = async (openPositions: any) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.openPosition.createMany({
                data: openPositions,
                skipDuplicates: true
            });
        });
        console.log(result);
        return { created: result };
    } catch (e: any) {
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
