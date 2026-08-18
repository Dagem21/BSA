import { service as opservice } from "./FCY Daily Open position/service";

export const getService = (id: string): Function | null => {
    console.log(id);
    switch (id) {
        case "6a806fd13ab081444e563ba0":
            return opservice;
        default:
            return null;
    }
};
