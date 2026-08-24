"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ReportTypeDto } from "@/dto/reportType";
import useApiFetch from "@/hooks/useAPIFetch";
import { useSession } from "@/hooks/useSession";

export default function Page() {
    const session = useSession();

    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/reporttype",
        method: "GET"
    });

    const profile = {
        name: session?.user?.displayName,
        role: session?.user?.role || "Role not set",
        lastLogin: session?.user?.lastLogin
    };

    return (
        <div className="mx-auto w-full">
            <Breadcrumb pageName="Profile" />

            <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="px-4 pb-2 text-center lg:pb-8 xl:pb-2.5">
                    <div className="mt-4">
                        <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                            {profile.name}
                        </h3>
                        <p className="font-medium">{profile.role}</p>
                        <p className="font-medium">{profile.lastLogin}</p>
                    </div>
                </div>

                <div className="px-4 pb-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                                <TableHead>#</TableHead>
                                <TableHead className="min-w-[155px]">
                                    Report ID
                                </TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead className="max-w-[300px]">
                                    Description
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data?.reportTypes?.map(
                                (item: ReportTypeDto, index: number) => (
                                    <TableRow
                                        key={index}
                                        className="border-[#eee] dark:border-dark-3"
                                    >
                                        <TableCell>
                                            <p className="text-dark dark:text-white">
                                                {index + 1}
                                            </p>
                                        </TableCell>
                                        <TableCell className="min-w-[155px]">
                                            <p className="text-dark dark:text-white">
                                                {item.reportId}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-dark dark:text-white">
                                                {item.frequency}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-dark dark:text-white">
                                                {item.service}
                                            </p>
                                        </TableCell>

                                        <TableCell className="max-w-[300px]">
                                            <p className="text-dark dark:text-white">
                                                {item.description}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
