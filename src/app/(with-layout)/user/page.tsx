"use client";

import { PlusIcon, TrashIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { MultiSelect } from "@/components/FormElements/MultiSelect";
import { Select } from "@/components/FormElements/select";
import Modal from "@/components/Modal/modal";
import { DownloadIcon, PreviewIcon } from "@/components/Tables/icons";
import { Button } from "@/components/ui-elements/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ReportTypeDto } from "@/dto/reportType";
import { UserDto } from "@/dto/user";
import useApiFetch from "@/hooks/useAPIFetch";
import { UserFormValues, userSchema } from "@/yup/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/user",
        method: "GET"
    });

    const { data: dataReportTypes } = useApiFetch({
        url: "/api/reporttype",
        method: "GET"
    });

    const {
        data: dataCreate,
        fetchData: fetchDataCreate,
        isLoading: isLoadingCreate,
        errors: errorCreate
    } = useApiFetch(
        {
            url: "/api/user",
            method: "POST"
        },
        false
    );

    useEffect(() => {
        if (!isLoadingCreate && dataCreate) {
            setIsPopupOpen(false);
            toast.success("User registered");
            fetchData();
            reset();
        } else if (!isLoading && errorCreate?.details) {
            toast.error(errorCreate.details?.response?.data?.error);
        }
    }, [dataCreate, isLoadingCreate, errorCreate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<UserFormValues>({
        resolver: yupResolver(userSchema),
        defaultValues: {
            email: "",
            role: "",
            allowedReports: []
        }
    });

    const onSubmit = (data: UserFormValues) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(
                ([_, val]) => val !== "" && val !== null
            )
        );

        fetchDataCreate({ data: cleanData });
    };

    return (
        <div className="mx-auto w-full max-w-242.5">
            <Breadcrumb pageName="Users" />

            <Button
                className="mb-2"
                onClick={() => setIsPopupOpen(true)}
                label="Add User"
                variant="primary"
                shape="rounded"
                size="small"
                icon={<PlusIcon />}
            />

            <Table>
                <TableHeader>
                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        <TableHead className="min-w-[155px] xl:pl-7.5">
                            Email
                        </TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Allowed Reports</TableHead>
                        <TableHead className="text-right xl:pr-7.5">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.users?.map((item: UserDto, index: number) => (
                        <TableRow
                            key={index}
                            className="border-[#eee] dark:border-dark-3"
                        >
                            <TableCell className="min-w-[155px] xl:pl-7.5">
                                <p className="font-bold text-dark dark:text-white">
                                    {item.email}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item.role}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p className="text-dark dark:text-white">
                                    {item.allowedReports?.length}
                                </p>
                            </TableCell>

                            <TableCell className="xl:pr-7.5">
                                <div className="flex items-center justify-end gap-x-3.5">
                                    <button className="hover:text-primary">
                                        <span className="sr-only">
                                            View Invoice
                                        </span>
                                        <PreviewIcon />
                                    </button>

                                    <button className="hover:text-primary">
                                        <span className="sr-only">
                                            Delete Invoice
                                        </span>
                                        <TrashIcon />
                                    </button>

                                    <button className="hover:text-primary">
                                        <span className="sr-only">
                                            Download Invoice
                                        </span>
                                        <DownloadIcon />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {data?.users?.length === 0 && (
                <p className="text-center text-sm">No records to display.</p>
            )}

            <Modal
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Add New User"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <InputGroup
                            label="Email"
                            type="text"
                            placeholder="Enter CBE Email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Role"
                            items={[
                                { label: "Maker", value: "Maker" },
                                { label: "Checker", value: "Checker" },
                                { label: "Admin", value: "Admin" }
                            ]}
                            defaultValue="Checker"
                            {...register("role")}
                        />
                        {errors.role && (
                            <p className="text-sm text-red-500">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Controller
                            name="allowedReports"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    label="Allowed Reports"
                                    options={dataReportTypes?.reportTypes?.map(
                                        (reportType: ReportTypeDto) => {
                                            return {
                                                label: reportType.reportId,
                                                value: reportType._id
                                            };
                                        }
                                    )}
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select reports..."
                                />
                            )}
                        />
                        {/* <MultiSelect
                            label="Select Tech Stack"
                            options={dataReportTypes?.reportTypes?.map(
                                (reportType: ReportTypeDto) => {
                                    return {
                                        label: reportType.reportId,
                                        value: reportType._id
                                    };
                                }
                            )}
                            value={[]}
                            onChange={() => {}}
                            placeholder="Choose technologies..."
                        /> */}
                        {/* <MultiSelect
                            selectOptions={[
                                dataReportTypes?.reportTypes?.map(
                                    (reportType: ReportTypeDto) => {
                                        return {
                                            text: reportType.reportId,
                                            value: reportType._id,
                                            selected: false
                                        };
                                    }
                                )
                            ]}
                        /> */}
                        {/* <Select
                            label="Frequency"
                            items={[
                                { label: "Daily", value: "Daily" },
                                { label: "Weekly", value: "Weekly" },
                                { label: "Monthly", value: "Monthly" },
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Yearly", value: "Yearly" }
                            ]}
                            defaultValue="Monthly"
                            {...register("frequency")}
                        /> */}
                        {errors.allowedReports && (
                            <p className="text-sm text-red-500">
                                {errors.allowedReports.message}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="w-full transition sm:flex-1"
                            label={
                                isLoadingCreate ? "Registering..." : "Register"
                            }
                            variant="primary"
                            shape="rounded"
                            size="small"
                        />

                        <button
                            type="button"
                            onClick={() => setIsPopupOpen(false)}
                            className="dark:border-strokedark dark:hover:bg-meta-4 w-full rounded border border-stroke px-4 py-2 font-medium text-black transition hover:bg-gray-100 sm:flex-1 dark:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
