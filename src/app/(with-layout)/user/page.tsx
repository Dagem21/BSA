"use client";

import { PencilSquareIcon, PlusIcon, TrashIcon } from "@/assets/icons";
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
import {
    UserFormValues,
    userSchema,
    UserUpdateFormValues,
    userUpdateSchema
} from "@/yup/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenView, setIsPopupOpenView] = useState(false);
    const [isPopupOpenUpdate, setIsPopupOpenUpdate] = useState(false);

    const [selectedItem, setSelectedItem] = useState<UserDto | null>(null);

    const { data, fetchData, isLoading } = useApiFetch({
        url: "/api/user",
        method: "GET"
    });

    const {
        data: dataEmail,
        fetchData: fetchDataEmail,
        isLoading: isLoadingEmail,
        errors: errorsEmail
    } = useApiFetch(
        {
            url: "/api/user/email",
            method: "GET"
        },
        false
    );

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

    const {
        data: dataUpdate,
        fetchData: fetchDataUpdate,
        isLoading: isLoadingUpdate,
        errors: errorUpdate
    } = useApiFetch(
        {
            url: "/api/user",
            method: "PUT"
        },
        false
    );

    useEffect(() => {
        if (!isLoadingCreate && dataCreate) {
            setIsPopupOpen(false);
            toast.success("User registered");
            fetchData();
            reset();
        } else if (!isLoadingCreate && errorCreate?.details) {
            toast.error(errorCreate.details?.response?.data?.error);
        }
    }, [dataCreate, isLoadingCreate, errorCreate]);

    useEffect(() => {
        if (!isLoadingUpdate && dataUpdate) {
            setIsPopupOpenUpdate(false);
            toast.success("User updated");
            fetchData();
            resetUpdate();
        } else if (!isLoadingUpdate && errorUpdate?.details) {
            toast.error(errorUpdate.details?.response?.data?.error);
        }
    }, [dataUpdate, isLoadingUpdate, errorUpdate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset,
        watch
    } = useForm<UserFormValues>({
        resolver: yupResolver(userSchema),
        defaultValues: {
            email: "",
            role: "",
            allowedReports: []
        }
    });

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        control: controlUpdate,
        setValues,
        reset: resetUpdate
    } = useForm<UserUpdateFormValues>({
        resolver: yupResolver(userUpdateSchema)
    });

    const email = watch("email");
    useEffect(() => {
        setValue("name", "");
    }, [email]);
    useEffect(() => {
        if (!isLoadingEmail && dataEmail)
            setValue("name", dataEmail?.user?.name);
        else if (!isLoadingEmail && errorsEmail?.details)
            toast.error(errorsEmail.details?.response?.data?.error);
    }, [isLoadingEmail, dataEmail, errorsEmail]);

    const onSubmit = (data: UserFormValues) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(
                ([_, val]) => val !== "" && val !== null
            )
        );

        fetchDataCreate({ data: cleanData });
    };

    const onSubmitUpdate = (data: UserUpdateFormValues) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(
                ([_, val]) => val !== "" && val !== null
            )
        );

        fetchDataUpdate({ data: cleanData });
    };

    return (
        <div className="mx-auto w-full">
            <Breadcrumb pageName="Users" />

            <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 sm:p-7.5 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
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
                                        <button
                                            className="hover:text-primary"
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsPopupOpenView(true);
                                            }}
                                        >
                                            <span className="sr-only">
                                                View
                                            </span>
                                            <PreviewIcon />
                                        </button>

                                        <button
                                            className="hover:text-primary"
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsPopupOpenUpdate(true);
                                                setValues({
                                                    id: item._id,
                                                    allowedReports:
                                                        item.allowedReports?.map(
                                                            (
                                                                reportType: ReportTypeDto
                                                            ) => reportType._id
                                                        ),
                                                    role: item.role
                                                });
                                            }}
                                        >
                                            <span className="sr-only">
                                                Update
                                            </span>
                                            <PencilSquareIcon />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {data?.users?.length === 0 && (
                    <p className="text-center text-sm">
                        No records to display.
                    </p>
                )}

                <Modal
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    title="Add New User"
                >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <div className="flex items-end">
                                <div className="flex-1">
                                    <InputGroup
                                        label="Email"
                                        type="text"
                                        placeholder="Enter CBE Email"
                                        {...register("email")}
                                    />
                                </div>
                                <div>
                                    <Button
                                        className="w-full transition sm:flex-1"
                                        label={
                                            isLoadingEmail
                                                ? "Searching..."
                                                : "Find"
                                        }
                                        variant="primary"
                                        shape="rounded"
                                        size="small"
                                        disabled={email === ""}
                                        onClick={() => {
                                            fetchDataEmail({
                                                params: { email }
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <InputGroup
                                label="Name"
                                type="text"
                                placeholder="Employee name"
                                {...register("name")}
                                disabled
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
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
                                    isLoadingCreate
                                        ? "Registering..."
                                        : "Register"
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

                <Modal
                    isOpen={isPopupOpenView}
                    onClose={() => {
                        setIsPopupOpenView(false);
                        setSelectedItem(null);
                    }}
                    title="User Details"
                >
                    <div className="flex flex-col gap-2">
                        <div>
                            <label className="text-sm">Email: </label>
                            <p className="font-medium">{selectedItem?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm">Role: </label>
                            <p className="font-medium">{selectedItem?.role}</p>
                        </div>
                        <div>
                            <label className="text-sm">Reports: </label>
                            <div className="flex flex-col gap-2 py-2">
                                {selectedItem?.allowedReports?.map(
                                    (reportType: ReportTypeDto) => {
                                        return (
                                            <div
                                                key={reportType._id}
                                                className="border-s-2 border-primary ps-2"
                                            >
                                                <p className="text-sm font-bold">
                                                    {reportType.reportId}
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {reportType.description}
                                                </p>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={isPopupOpenUpdate}
                    onClose={() => setIsPopupOpenUpdate(false)}
                    title="Update User"
                >
                    <form
                        onSubmit={handleSubmitUpdate(onSubmitUpdate)}
                        className="space-y-4"
                    >
                        <div>
                            <div className="flex-1">
                                <InputGroup
                                    label="Email"
                                    type="text"
                                    defaultValue={selectedItem?.email}
                                    disabled
                                />
                            </div>
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
                                {...registerUpdate("role")}
                            />
                            {errorsUpdate.role && (
                                <p className="text-sm text-red-500">
                                    {errorsUpdate.role.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="allowedReports"
                                control={controlUpdate}
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
                            {errorsUpdate.allowedReports && (
                                <p className="text-sm text-red-500">
                                    {errorsUpdate.allowedReports.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Button
                                className="w-full transition sm:flex-1"
                                label={
                                    isLoadingUpdate ? "Updating..." : "Update"
                                }
                                variant="primary"
                                shape="rounded"
                                size="small"
                            />

                            <button
                                type="button"
                                onClick={() => setIsPopupOpenUpdate(false)}
                                className="dark:border-strokedark dark:hover:bg-meta-4 w-full rounded border border-stroke px-4 py-2 font-medium text-black transition hover:bg-gray-100 sm:flex-1 dark:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
