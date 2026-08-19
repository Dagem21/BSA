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
        return { created: result };
    } catch (e: any) {
        console.log(e.message);
        return { created: false };
    }
};
