"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

type InputGroupProps = {
    className?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    active?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    name?: string;
    defaultValue?: string;
    readOnly?: boolean;
};

const DatePickerOne = ({
    label,
    value,
    onChange,
    ...props
}: InputGroupProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fpRef = useRef<flatpickr.Instance | null>(null);

    useEffect(() => {
        if (!inputRef.current) return;

        fpRef.current = flatpickr(inputRef.current, {
            mode: "single",
            static: true,
            monthSelectorType: "static",
            dateFormat: "M j, Y", // Renders directly in one input
            onChange: (_, dateStr) => {
                if (onChange && inputRef.current) {
                    const event = {
                        target: {
                            name: props.name,
                            value: dateStr
                        }
                    } as React.ChangeEvent<HTMLInputElement>;
                    onChange(event);
                }
            }
        });

        return () => {
            fpRef.current?.destroy();
        };
    }, []);

    return (
        <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                {label || "Choose Date"}
            </label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="YYYY-MM-DD"
                    className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal transition outline-none focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                    value={value ?? ""}
                    onChange={onChange}
                    {...props}
                />

                <div className="pointer-events-none absolute inset-0 right-5 left-auto flex items-center">
                    <Calendar className="size-5 text-[#9CA3AF]" />
                </div>
            </div>
        </div>
    );
};

export default DatePickerOne;
