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

export function ReportForm() {
    const [frequency, setFrequency] = useState("");
    const { data } = useApiFetch({
        url: "/api/reporttype",
        method: "GET"
    });

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ReportFormValues>({
        resolver: yupResolver(reportSchema)
    });

    const reportType = watch("reportType");
    useEffect(() => {
        setFrequency(
            data?.reportTypes?.find(
                (item: ReportTypeDto) => item._id === reportType
            )?.frequency
        );
    }, [reportType]);

    const onSubmit = async (data: ReportFormValues): Promise<void> => {
        // Standard File extraction
        const rawFile = data.file;
        let fileToUpload: File | null = null;

        if (rawFile instanceof FileList) {
            fileToUpload = rawFile[0];
        } else if (Array.isArray(rawFile)) {
            fileToUpload = rawFile[0];
        } else if (rawFile instanceof File) {
            fileToUpload = rawFile;
        }

        const formData = new FormData();
        formData.append("startDate", data.startDate);
        formData.append("endDate", data.endDate);
        if (fileToUpload) {
            formData.append("file", fileToUpload);
        }

        console.log("Submitting Validated Report:", {
            startDate: data.startDate,
            endDate: data.endDate,
            file: fileToUpload?.name
        });

        // Call your Next.js Server Action or API Route here
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
                        label="Frequency"
                        items={data?.reportTypes?.map(
                            (item: ReportTypeDto) => ({
                                label: item.reportId,
                                value: item._id
                            })
                        )}
                        placeholder="Choose report type"
                        {...register("reportType")}
                    />
                </div>
                <div>
                    <InputGroup
                        label="Frequency"
                        type="text"
                        value={frequency}
                        readOnly={true}
                    />
                </div>
                <div className="flex flex-col gap-4.5 xl:flex-row">
                    {/* Start Date */}
                    <div className="w-full xl:w-1/2">
                        <Controller
                            name="startDate"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <DatePickerOne
                                    label="Start Date"
                                    value={field.value}
                                    onChange={(dateStr: string) =>
                                        field.onChange(dateStr)
                                    }
                                />
                            )}
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
                            defaultValue=""
                            render={({ field }) => (
                                <DatePickerOne
                                    label="End Date"
                                    value={field.value}
                                    onChange={(dateStr: string) =>
                                        field.onChange(dateStr)
                                    }
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
                    disabled={isSubmitting}
                    className="hover:bg-opacity-90 mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Validating & Uploading..."
                        : "Submit Report"}
                </button>
            </form>
        </ShowcaseSection>
    );
}
