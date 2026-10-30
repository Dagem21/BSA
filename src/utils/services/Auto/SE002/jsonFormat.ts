import { SE002 } from "@/generated/prisma";

export const jsonFormat = (
    returnKey: string,
    instCode: string,
    finYear: number,
    startDate: string,
    endDate: string,
    rawData: SE002[]
) => {
    const dynamicItems: Array<any> = [];
    for (let i = 0; i < rawData.length; i++) {
        const element = rawData[i];
        // console.log(element);
    }
};
