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
