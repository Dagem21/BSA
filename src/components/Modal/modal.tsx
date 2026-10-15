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
        /* Outer Backdrop: Add onClick={onClose} to detect clicks outside the modal */
        <div
            onClick={onClose}
            className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
            {/* Modal Card: Constrained to max-h-[90vh] and flex column so children can flex-1 */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[80vh] w-full flex-col rounded-lg bg-white p-6 text-dark shadow-xl dark:bg-[#020d1a] dark:text-white"
                style={{ maxWidth: "512px" }}
            >
                {/* Header (Stays fixed at the top) */}
                <div className="dark:border-strokedark flex flex-shrink-0 items-center justify-between border-b border-stroke pb-3">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        {title || "Popup"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-lg font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Content: Scrollable when it overflows */}
                <div className="mt-4 w-full flex-1 overflow-y-auto pr-1 break-words">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
