import { ChevronLeftIcon, ChevronsLeftIcon } from "@/assets/icons";

type PageProps = {
    page: number;
    limit: number;
    total: number;
    fetchNext: (page?: number, limit?: number) => void;
};

export function Pager({ page, limit, total, fetchNext }: PageProps) {
    const totalPages = Math.ceil((total ?? 0) / (limit ?? 10));

    return (
        <div className="mt-3 flex items-center justify-between px-3 text-sm text-gray-700 dark:text-gray-200">
            <p>
                Total:{" "}
                <span className="font-semibold text-blue-300">
                    {total ?? 0}
                </span>
            </p>

            <div className="flex items-center gap-2">
                <select
                    className="w-full rounded-lg border border-blue-600 bg-transparent px-2 py-1.5 transition outline-none active:border-primary dark:bg-dark-2"
                    onChange={(e) => fetchNext(page, parseInt(e.target.value))}
                    value={limit}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>

                <div className="flex items-center gap-1">
                    {/* First Page */}
                    <button
                        className="flex items-center justify-center rounded-md border border-blue-600 p-1.5 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
                        onClick={() => fetchNext(1, limit)}
                        title="First page"
                        disabled={page === 1}
                    >
                        <ChevronsLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Previous Page */}
                    <button
                        className="flex items-center justify-center rounded-md border border-blue-600 p-1.5 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
                        onClick={() => fetchNext(page - 1, limit)}
                        title="Previous page"
                        disabled={page === 1}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Current Page */}
                    <button
                        className="rounded-md border border-blue-600 bg-blue-600 px-3 py-1 font-medium text-white shadow-sm disabled:opacity-50"
                        title="Current page"
                        disabled
                    >
                        {page}
                    </button>

                    {/* Next Page */}
                    <button
                        className="flex items-center justify-center rounded-md border border-blue-600 p-1.5 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
                        onClick={() => fetchNext(page + 1, limit)}
                        title="Next page"
                        disabled={page === totalPages}
                    >
                        <ChevronLeftIcon className="h-4 w-4 rotate-180" />
                    </button>

                    {/* Last Page */}
                    <button
                        className="flex items-center justify-center rounded-md border border-blue-600 p-1.5 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
                        onClick={() => fetchNext(totalPages, limit)}
                        title="Last page"
                        disabled={page === totalPages}
                    >
                        <ChevronsLeftIcon className="h-4 w-4 rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}
