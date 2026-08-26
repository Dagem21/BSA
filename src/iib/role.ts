import { RoleTypes } from "@/types/types";

export const ROLE_ROUTES: Record<string, RoleTypes[]> = {
    "/": [RoleTypes.Admin, RoleTypes.Checker, RoleTypes.Maker],
    "/calender": [RoleTypes.Admin, RoleTypes.Checker, RoleTypes.Maker],
    "/profile": [RoleTypes.Admin, RoleTypes.Checker, RoleTypes.Maker],
    "/service": [RoleTypes.Admin, RoleTypes.Checker, RoleTypes.Maker],
    "/history": [RoleTypes.Admin, RoleTypes.Checker, RoleTypes.Maker],
    "/report-types": [RoleTypes.Admin],
    "/report": [RoleTypes.Maker],
    "/user": [RoleTypes.Admin]
};
