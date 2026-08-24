"use client";

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReportFormValues, reportSchema } from "@/yup/report";
import useApiFetch from "@/hooks/useAPIFetch";
import { Select } from "@/components/FormElements/select";
import { ReportTypeDto } from "@/dto/reportType";
import { useEffect, useState } from "react";
import { FrequncyTypes, ServiceTypes } from "@/types/types";
import { toast } from "sonner";

export function ReportForm() {
    const [frequency, setFrequency] = useState("");
    const { data } = useApiFetch({
        url: "/api/reporttype",
        method: "GET"
    });

    const {
        data: dataCreate,
        fetchData: fetchDataCreate,
        isLoading: isLoadingCreate,
        errors: errorsCreate
    } = useApiFetch(
        {
            url: "/api/report",
            method: "POST"
        },
        false
    );

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<ReportFormValues>({
        resolver: yupResolver(reportSchema)
    });

    const reportType = watch("reportType");
    const startDate = watch("startDate");

    useEffect(() => {
        setFrequency(
            data?.reportTypes?.find(
                (item: ReportTypeDto) => item._id === reportType
            )?.frequency
        );
    }, [reportType]);

    useEffect(() => {
        if (frequency && startDate) {
            const endDate = new Date(startDate);
            switch (frequency) {
                case FrequncyTypes.Daily:
                    endDate.setDate(endDate.getDate() + 1);
                    break;
                case FrequncyTypes.Weekly:
                    endDate.setDate(endDate.getDate() + 6);
                    break;
                case FrequncyTypes.Monthly:
                    endDate.setMonth(endDate.getMonth() + 1);
                    endDate.setDate(endDate.getDate() - 1);
                    break;
                case FrequncyTypes.Quarterly:
                    endDate.setMonth(endDate.getMonth() + 3);
                    endDate.setDate(endDate.getDate() - 1);
                    break;
                case FrequncyTypes.Yearly:
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    endDate.setDate(endDate.getDate() - 1);
                    break;
                default:
                    break;
            }
            setValue("endDate", endDate);
        }
    }, [frequency, startDate]);

    useEffect(() => {
        if (!isLoadingCreate && dataCreate) {
            toast.success("Report type created.");
            reset();
        } else if (!isLoadingCreate && errorsCreate?.details) {
            toast.error(errorsCreate.details?.response?.data?.error);
        }
    }, [dataCreate, isLoadingCreate, errorsCreate]);

    const onSubmit = async (data: ReportFormValues): Promise<void> => {
        // Standard File extraction
        const rawFile = data.file;
        let fileToUpload: File | null = null;

        if (rawFile instanceof FileList) fileToUpload = rawFile[0];
        else if (Array.isArray(rawFile)) fileToUpload = rawFile[0];
        else if (rawFile instanceof File) fileToUpload = rawFile;

        const formData = new FormData();
        formData.append("reportType", data.reportType);
        formData.append("startDate", data.startDate.toISOString());
        formData.append("endDate", data.endDate.toISOString());
        if (fileToUpload) {
            formData.append("file", fileToUpload);
        }

        fetchDataCreate({
            data: formData
        });
    };

    return (
        <ShowcaseSection title="Report" className="p-6.5!">
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-4.5"
            >
                <div>
                    <Select
                        label="Report Type"
                        items={data?.reportTypes?.map(
                            (item: ReportTypeDto) => ({
                                label: `${item.reportId} (${item.service})`,
                                value: item._id,
                                disabled: item.service !== ServiceTypes.None
                            })
                        )}
                        placeholder="Choose report type"
                        {...register("reportType")}
                    />
                    {errors.reportType && (
                        <span className="mt-1 block text-sm font-medium text-red-500">
                            {errors.reportType.message}
                        </span>
                    )}
                </div>
                <div>
                    <InputGroup
                        label="Frequency"
                        type="text"
                        value={frequency ?? ""}
                        placeholder="Report frequency"
                        readOnly={true}
                    />
                </div>
                <div className="flex flex-col gap-4.5 xl:flex-row">
                    {/* Start Date */}
                    <div className="w-full xl:w-1/2">
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <DatePickerOne
                                        label="Start Date"
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val);
                                        }}
                                    />
                                );
                            }}
                        />
                        {errors.startDate && (
                            <span className="mt-1 block text-sm font-medium text-red-500">
                                {errors.startDate.message}
                            </span>
                        )}
                    </div>

                    {/* End Date */}
                    <div className="w-full xl:w-1/2">
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <DatePickerOne
                                    label="End Date"
                                    value={field?.value}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val);
                                    }}
                                    disabled={true}
                                />
                            )}
                        />
                        {errors.endDate && (
                            <span className="mt-1 block text-sm font-medium text-red-500">
                                {errors.endDate.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* File Attachment */}
                <div>
                    <InputGroup
                        type="file"
                        filestylevariant="style1"
                        label="Attach file"
                        placeholder="Attach file"
                        {...register("file")}
                    />
                    {errors.file && (
                        <span className="mt-1 block text-sm font-medium text-red-500">
                            {errors.file.message as string}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoadingCreate}
                    className="hover:bg-opacity-90 mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoadingCreate
                        ? "Validating & Uploading..."
                        : "Submit Report"}
                </button>
            </form>
        </ShowcaseSection>
    );
}
