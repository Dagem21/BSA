"use client";

import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    // Close on 'Escape' key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            {/* 2. Add 'mx-auto' and explicit 'w-full' to force the max-width boundary */}
            <div
                className="dark:bg-boxdark relative rounded-lg bg-white p-6 shadow-xl"
                style={{ width: "100%", maxWidth: "512px" }}
            >
                {/* Header */}
                <div className="dark:border-strokedark flex items-center justify-between border-b border-stroke pb-3">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        {title || "Popup"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-lg font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="mt-4 w-md break-words">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
