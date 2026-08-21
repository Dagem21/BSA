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
    options = [],
    value = [],
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

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((item) => item !== val));
        } else {
            onChange([...value, val]);
        }
        setSearch("");
    };

    const handleRemove = (val: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter((item) => item !== val));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && search === "" && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const handleSelectAll = () => {
        const targetOptions = search ? filteredOptions : options;
        const targetValues = targetOptions.map((opt) => opt.value);
        const allSelected = targetValues.every((val) => value.includes(val));

        if (allSelected) {
            onChange(value.filter((val) => !targetValues.includes(val)));
        } else {
            onChange(Array.from(new Set([...value, ...targetValues])));
        }
    };

    return (
        <div className="w-full" ref={containerRef}>
            {label && (
                <label
                    htmlFor={instanceId}
                    className="mb-1 block text-body-sm font-medium text-dark dark:text-white"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Input Wrapper */}
                <div
                    onClick={() => {
                        if (!disabled) {
                            setIsOpen(true);
                            inputRef.current?.focus();
                        }
                    }}
                    className={`flex min-h-[50px] w-full flex-wrap items-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 transition outline-none focus-within:border-primary dark:bg-dark-2 ${
                        disabled
                            ? "cursor-not-allowed border-stroke opacity-60 dark:border-dark-3"
                            : "cursor-text"
                    } ${isOpen ? "border-primary shadow-sm" : "border-stroke dark:border-dark-3"}`}
                >
                    {/* Selected Pills */}
                    {value.map((val) => {
                        const selectedOpt = options.find(
                            (opt) => opt.value === val
                        );
                        return (
                            <span
                                key={val}
                                className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium dark:bg-dark-3"
                            >
                                {selectedOpt?.label || val}
                                <button
                                    type="button"
                                    onClick={(e) => handleRemove(val, e)}
                                    className="hover:text-danger text-gray-500"
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
                        className="flex-1 bg-transparent text-sm text-black outline-none placeholder:text-gray-400 dark:text-white"
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
                                className="hover:text-danger text-xs text-gray-500"
                            >
                                Clear
                            </button>
                        )}
                        <span
                            className={`cursor-pointer text-xs text-gray-500 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen((prev) => !prev);
                            }}
                        >
                            ▼
                        </span>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
                        {/* Header Toolbar */}
                        <div className="flex items-center justify-between border-b border-stroke px-4 py-2 dark:border-dark-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {value.length} of {options.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                {options.length > 0 &&
                                value.length === options.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        </div>

                        {/* Options List */}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = value.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() =>
                                            handleSelect(option.value)
                                        }
                                        className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition hover:bg-gray-100 dark:hover:bg-dark-3 ${
                                            isSelected
                                                ? "bg-primary/5 font-medium text-primary"
                                                : "text-black dark:text-white"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}} // Controlled by parent div click
                                            className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
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
