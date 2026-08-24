"use client";

import { PlusIcon } from "@/assets/icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { PencilSquareIcon, PreviewIcon } from "./icons";
import useApiFetch from "@/hooks/useAPIFetch";
import { ReportTypeDto } from "@/dto/reportType";
import { useEffect, useState } from "react";
import Modal from "../Modal/modal";
import { Button } from "../ui-elements/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    ReportTypeFormValues,
    reportTypeSchema,
    ReportTypeUpdateFormValues,
    reportTypeUpdateSchema
} from "@/yup/reportType";
import InputGroup from "../FormElements/InputGroup";
import { toast } from "sonner";
import { Select } from "../FormElements/select";
import { FrequncyTypes, ServiceTypes } from "@/types/types";

export function ReportTypeTable() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenView, setIsPopupOpenView] = useState(false);
    const [isPopupOpenUpdate, setIsPopupOpenUpdate] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ReportTypeDto | null>(
        null
    );

    const { data, fetchData, isLoading } = useApiFetch({
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
            url: "/api/reporttype",
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
            url: "/api/reporttype",
            method: "PUT"
        },
        false
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ReportTypeFormValues>({
        resolver: yupResolver(reportTypeSchema),
        defaultValues: {
            reportId: "",
            description: "",
            frequency: FrequncyTypes.Monthly,
            service: ServiceTypes.Manual
        }
    });

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        setValues: setValuesUpdate,
        formState: { errors: errorsUpdate },
        reset: reserUpdate
    } = useForm<ReportTypeUpdateFormValues>({
        resolver: yupResolver(reportTypeUpdateSchema),
        defaultValues: {}
    });

    useEffect(() => {
        if (!isLoadingCreate && dataCreate) {
            setIsPopupOpen(false);
            toast.success("Report type created.");
            fetchData();
            reset();
        } else if (!isLoadingCreate && errorCreate?.details) {
            toast.error(errorCreate.details?.response?.data?.error);
        }
    }, [dataCreate, isLoadingCreate, errorCreate]);

    useEffect(() => {
        if (!isLoadingUpdate && dataUpdate) {
            setIsPopupOpenUpdate(false);
            toast.success("Report type updated.");
            fetchData();
            reserUpdate();
        } else if (!isLoadingUpdate && errorUpdate?.details) {
            toast.error(errorUpdate.details?.response?.data?.error);
        }
    }, [dataCreate, isLoadingUpdate, errorUpdate]);

    const onSubmit = (data: ReportTypeFormValues) => {
        const cleanData = Object.fromEntries(
            Object.entries(data)
                .map(([key, val]) => [
                    key,
                    typeof val === "string" ? val.trim() : val
                ])
                .filter(
                    ([_, val]) =>
                        val !== "" && val !== null && val !== undefined
                )
        );

        fetchDataCreate({ data: cleanData });
    };

    const onSubmitUpdate = (data: ReportTypeUpdateFormValues) => {
        const cleanData = Object.fromEntries(
            Object.entries(data)
                .map(([key, val]) => [
                    key,
                    typeof val === "string" ? val.trim() : val
                ])
                .filter(
                    ([_, val]) =>
                        val !== "" && val !== null && val !== undefined
                )
        );

        fetchDataUpdate({ data: cleanData });
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 sm:p-7.5 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <Button
                className="mb-2"
                onClick={() => setIsPopupOpen(true)}
                label="New Report Type"
                variant="primary"
                shape="rounded"
                size="small"
                icon={<PlusIcon />}
            />
            <Table>
                <TableHeader>
                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        <TableHead className="min-w-[155px] xl:pl-7.5">
                            Report ID
                        </TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right xl:pr-7.5">
                            Actions
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
                                <TableCell className="min-w-[155px] xl:pl-7.5">
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

                                <TableCell>
                                    <p className="text-dark dark:text-white">
                                        {item.description}
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
                                                setValuesUpdate({
                                                    id: item._id,
                                                    reportId: item.reportId,
                                                    service: item.service,
                                                    frequency: item.frequency,
                                                    description:
                                                        item.description
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
                        )
                    )}
                </TableBody>
            </Table>
            {data?.reportTypes?.length === 0 && (
                <p className="text-center text-sm">No records to display.</p>
            )}
            <Modal
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="New Report Type"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <InputGroup
                            label="Report ID"
                            type="text"
                            placeholder="Enter Report ID"
                            {...register("reportId")}
                        />
                        {errors.reportId && (
                            <p className="text-sm text-red-500">
                                {errors.reportId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Service"
                            items={Object.values(ServiceTypes).map(
                                (service) => ({
                                    label: service,
                                    value: service
                                })
                            )}
                            defaultValue="Manual"
                            {...register("service")}
                        />
                        {errors.service && (
                            <p className="text-sm text-red-500">
                                {errors.service.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Frequency"
                            items={Object.values(FrequncyTypes).map(
                                (frequency) => ({
                                    label: frequency,
                                    value: frequency
                                })
                            )}
                            defaultValue="Monthly"
                            {...register("frequency")}
                        />
                        {errors.frequency && (
                            <p className="text-sm text-red-500">
                                {errors.frequency.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputGroup
                            label="Description"
                            type="text"
                            placeholder="Enter Description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="w-full transition sm:flex-1"
                            label={isLoadingCreate ? "Saving..." : "Submit"}
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
                title="Report Type Details"
            >
                <div className="flex flex-col gap-2">
                    <div>
                        <label className="text-sm">Report ID: </label>
                        <p className="font-medium">{selectedItem?.reportId}</p>
                    </div>
                    <div className="flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="text-sm">Service: </label>
                            <p className="font-medium">
                                {selectedItem?.service}
                            </p>
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="text-sm">Frequency: </label>
                            <p className="font-medium">
                                {selectedItem?.frequency}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm">Description: </label>
                        <p className="text-sm font-normal">
                            {selectedItem?.description}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPopupOpenView(false)}
                        className="dark:border-strokedark dark:hover:bg-meta-4 w-full rounded border border-stroke px-4 py-2 font-medium text-black transition hover:bg-gray-100 sm:flex-1 dark:text-white"
                    >
                        Close
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isPopupOpenUpdate}
                onClose={() => {
                    setIsPopupOpenUpdate(false);
                    setSelectedItem(null);
                }}
                title="Update Report Type"
            >
                <form
                    onSubmit={handleSubmitUpdate(onSubmitUpdate)}
                    className="space-y-4"
                >
                    <div>
                        <InputGroup
                            label="Report ID"
                            type="text"
                            placeholder="Enter Report ID"
                            {...registerUpdate("reportId")}
                        />
                        {errorsUpdate.reportId && (
                            <p className="text-sm text-red-500">
                                {errorsUpdate.reportId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Service"
                            items={Object.values(ServiceTypes).map(
                                (service) => ({
                                    label: service,
                                    value: service
                                })
                            )}
                            defaultValue="Manual"
                            {...registerUpdate("service")}
                        />
                        {errorsUpdate.service && (
                            <p className="text-sm text-red-500">
                                {errorsUpdate.service.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Select
                            label="Frequency"
                            items={Object.values(FrequncyTypes).map(
                                (frequency) => ({
                                    label: frequency,
                                    value: frequency
                                })
                            )}
                            defaultValue="Monthly"
                            {...registerUpdate("frequency")}
                        />
                        {errorsUpdate.frequency && (
                            <p className="text-sm text-red-500">
                                {errorsUpdate.frequency.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputGroup
                            label="Description"
                            type="text"
                            placeholder="Enter Description"
                            {...registerUpdate("description")}
                        />
                        {errorsUpdate.description && (
                            <p className="text-sm text-red-500">
                                {errorsUpdate.description.message}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="w-full transition sm:flex-1"
                            label={isLoadingCreate ? "Updating..." : "Update"}
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
    );
}
