import * as Icons from "../icons";

export const NAV_DATA = [
    {
        label: "MAIN MENU",
        items: [
            {
                title: "Dashboard",
                url: "/",
                icon: Icons.HomeIcon,
                items: []
            },
            {
                title: "Report",
                url: "/report",
                icon: Icons.ReportIcon,
                items: []
            },
            {
                title: "History",
                url: "/history",
                icon: Icons.HistoryIcon,
                items: []
            },
            {
                title: "Services",
                url: "/service",
                icon: Icons.ServiceIcon,
                items: []
            },
            {
                title: "Profile",
                url: "/profile",
                icon: Icons.User,
                items: []
            }
        ]
    }
];

export const NAV_DATA_ADMIN = [
    {
        label: "MAIN MENU",
        items: [
            {
                title: "Dashboard",
                url: "/",
                icon: Icons.HomeIcon,
                items: []
            },
            {
                title: "Users",
                url: "/user",
                icon: Icons.UsersGroupIcon,
                items: []
            },
            {
                title: "Report Types",
                url: "/report-types",
                icon: Icons.ReportIcon,
                items: []
            },
            {
                title: "Services",
                url: "/service",
                icon: Icons.ServiceIcon,
                items: []
            },
            {
                title: "Profile",
                url: "/profile",
                icon: Icons.User,
                items: []
            }
        ]
    }
];

export const getSideBarItems = (role: string) => {
    switch (role) {
        case "Admin":
            return NAV_DATA_ADMIN;
        case "Maker":
            return NAV_DATA;
        case "Checker":
            return NAV_DATA;
        default:
            return [];
    }
};
