import { service as op001service } from "./OP001/service";
import { service as waadirservice } from "./WAADIR001/service";
import { service as se002service } from "./SE002/service";

export const getService = (id: string): Function | null => {
    switch (id) {
        case "SINGLE CURRENCYOP001":
            return op001service;
        case "WAADIR001":
            return waadirservice;
        case "LOAN_SEC&REG_SE002":
            return se002service;
        default:
            return null;
    }
};
