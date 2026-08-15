import { service as opservice } from "./FCY Daily Open position/service";

export const getService = (id: string): Function | null => {
    switch (id) {
        case "6a806fd13ab081444e563ba0":
            return opservice;
        case "6a7eee686da7fe6f397b46e6":
            return opservice;
        default:
            return null;
    }
};
