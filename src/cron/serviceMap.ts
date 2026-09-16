import { service as opservice } from "./FCY Daily Open position/service";
import { service as adirservice } from "./Monthly Weighted Average Deposit Interest Rates (Conventional Banks)/service";

export const getService = (id: string): Function | null => {
    switch (id) {
        case "SINGLE CURRENCYOP001":
            return opservice;
        case "WAADIR001":
            return adirservice;
        default:
            return null;
    }
};
