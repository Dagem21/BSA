import { service as opservice } from "./FCY Daily Open position/service";
import { service as adirservice } from "./Monthly Weighted Average Deposit Interest Rates (Conventional Banks)/service";

export const getService = (id: string): Function | null => {
    switch (id) {
        case "6a806fd13ab081444e563ba0":
            return opservice;
        case "6a9ba6a5ad2e8ff2cda9c27a":
            return adirservice;
        default:
            return null;
    }
};
