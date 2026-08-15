"use client";

import React, { useState, useRef, useEffect, useId } from "react";

export interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (selectedValues: string[]) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select options...",
    label,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const instanceId = useId();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on search query
    const filteredOptions = options?.filter((option) =>
        option?.label?.toLowerCase().includes(search?.toLowerCase())
    );

    const handleSelect = (val: string) => {
        if (value.includes(val)) {
            onChange(value?.filter((item) => item !== val));
        } else {
            onChange([...value, val]);
        }
        setSearch("");
    };

    const handleRemove = (val: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value?.filter((item) => item !== val));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && search === "" && value.length > 0) {
            onChange(value?.slice(0, -1));
        }
    };

    const handleSelectAll = () => {
        if (value?.length === options?.length) {
            onChange([]);
        } else {
            onChange(options.map((opt) => opt.value));
        }
    };

    return (
        <div className="w-full" ref={containerRef}>
            <label className="block text-body-sm font-medium text-dark dark:text-white">
                {label}
            </label>

            <div className="relative mt-1">
                {/* Input Wrapper */}
                <div
                    onClick={() => {
                        if (!disabled) {
                            setIsOpen(true);
                            inputRef.current?.focus();
                        }
                    }}
                    className={`dark:bg-boxdark flex min-h-[50px] w-full flex-wrap items-center gap-2 rounded-lg border bg-white px-4 py-2.5 transition ${
                        disabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-text"
                    } ${
                        isOpen
                            ? "border-primary shadow-sm"
                            : "dark:border-strokedark border-stroke"
                    }`}
                >
                    {/* Selected Pills */}
                    {value.map((val) => {
                        const selectedOpt = options.find(
                            (opt) => opt.value === val
                        );
                        return (
                            <span
                                key={val}
                                className="dark:bg-meta-4 flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-black dark:text-white"
                            >
                                {selectedOpt?.label || val}
                                <button
                                    type="button"
                                    onClick={(e) => handleRemove(val, e)}
                                    className="hover:text-danger dark:hover:text-danger text-gray-400"
                                >
                                    ✕
                                </button>
                            </span>
                        );
                    })}

                    {/* Search Input / Placeholder */}
                    <input
                        id={instanceId}
                        ref={inputRef}
                        type="text"
                        disabled={disabled}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={value.length === 0 ? placeholder : ""}
                        className="flex-1 bg-transparent text-sm text-black outline-none dark:text-white"
                    />

                    {/* Dropdown Indicator */}
                    <div className="ml-auto flex items-center gap-2">
                        {value.length > 0 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange([]);
                                }}
                                className="hover:text-danger text-xs text-gray-400"
                            >
                                Clear
                            </button>
                        )}
                        <span
                            className={`text-gray-400 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        >
                            ▼
                        </span>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="dark:border-strokedark dark:bg-boxdark absolute top-full left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-stroke bg-white shadow-lg">
                        {/* Header Toolbar */}
                        <div className="dark:border-strokedark flex items-center justify-between border-b border-stroke px-4 py-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {value?.length} of {options?.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                {value?.length === options?.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        </div>

                        {/* Options List */}
                        {filteredOptions?.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = value?.includes(
                                    option.value
                                );
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() =>
                                            handleSelect(option.value)
                                        }
                                        className={`dark:hover:bg-meta-4 flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition hover:bg-gray-100 ${
                                            isSelected
                                                ? "bg-primary/5 font-medium text-primary"
                                                : "text-black dark:text-white"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                            className="dark:border-strokedark h-4 w-4 rounded border-stroke text-primary focus:ring-primary"
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-center text-sm text-gray-500">
                                No options found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
