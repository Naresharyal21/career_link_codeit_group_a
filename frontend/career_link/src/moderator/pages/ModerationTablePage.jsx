import React, { useMemo, useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    Flag,
    MoreHorizontal,
    Search,
    ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
        case "high":
            return "bg-red-50 text-red-700 border-red-100";

        case "medium":
            return "bg-amber-50 text-amber-700 border-amber-100";

        case "low":
            return "bg-emerald-50 text-emerald-700 border-emerald-100";

        default:
            return "bg-slate-50 text-slate-600 border-slate-100";
    }
};

const getInitials = (value = "") => {
    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
};

const ModerationTablePage = ({
    title = "",
    description = "",
    count = 0,
    rows = [],
    actionLabel = "Review",
    onAction,
    showSearch = true,
    showFilters = true,
    emptyMessage = "No moderation records found.",
}) => {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("All");
    const [page, setPage] = useState(1);

    const filteredRows = useMemo(() => {
        const search = query.trim().toLowerCase();

        return rows.filter((row) => {
            const matchesPriority =
                priority === "All" ||
                row.priority?.toLowerCase() === priority.toLowerCase();

            if (!search) {
                return matchesPriority;
            }

            const searchableText = [
                row.id,
                row.item,
                row.submittedBy,
                row.date,
                row.priority,
                row.reason,
                row.status,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLowerCase();

            return (
                matchesPriority &&
                searchableText.includes(search)
            );
        });
    }, [rows, query, priority]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRows.length / PAGE_SIZE)
    );

    const safePage = Math.min(page, totalPages);

    const paginatedRows = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;

        return filteredRows.slice(
            start,
            start + PAGE_SIZE
        );
    }, [filteredRows, safePage]);

    const clearFilters = () => {
        setQuery("");
        setPriority("All");
        setPage(1);
    };

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setPage(1);
    };

    const handlePriority = (event) => {
        setPriority(event.target.value);
        setPage(1);
    };

    const handleAction = (row) => {
        if (onAction) {
            onAction(row);
            return;
        }

        if (row.id) {
            navigate(`reports/${row.id}`);
        }
    };

    const showingFrom =
        filteredRows.length === 0
            ? 0
            : (safePage - 1) * PAGE_SIZE + 1;

    const showingTo = Math.min(
        safePage * PAGE_SIZE,
        filteredRows.length
    );

    return (
        <div className="w-full">
            {/* Optional Page Title */}
            {title && (
                <div className="mb-6">
                    <h2 className="text-xl font-extrabold tracking-tight text-[#1e293b]">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-[#64748b]">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {/* Toolbar */}
            {(showSearch || showFilters) && (
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        {showSearch && (
                            <div className="flex flex-1 items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3">
                                <Search className="h-4 w-4 shrink-0 text-[#94a3b8]" />

                                <input
                                    id="moderation-table-search"
                                    name="moderation-table-search"
                                    type="search"
                                    value={query}
                                    onChange={handleSearch}
                                    placeholder="Search moderation records..."
                                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[#94a3b8]"
                                />
                            </div>
                        )}

                        {showFilters && (
                            <select
                                id="moderation-priority"
                                name="moderation-priority"
                                value={priority}
                                onChange={handlePriority}
                                className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] outline-none lg:w-44"
                            >
                                <option value="All">
                                    All priorities
                                </option>

                                <option value="High">
                                    High
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Low">
                                    Low
                                </option>
                            </select>
                        )}

                        {(query || priority !== "All") && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-bold text-[#64748b] transition hover:bg-[#f8fafc]"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[#64748b]">
                            Showing{" "}
                            <span className="font-bold text-[#1e293b]">
                                {showingFrom}
                            </span>
                            {" – "}
                            <span className="font-bold text-[#1e293b]">
                                {showingTo}
                            </span>
                            {" of "}
                            <span className="font-bold text-[#1e293b]">
                                {filteredRows.length}
                            </span>
                            {" records"}
                        </p>

                        <p className="text-xs text-[#94a3b8]">
                            Total: {count}
                        </p>
                    </div>
                </div>
            )}

            {/* Desktop Table */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
                {paginatedRows.length === 0 ? (
                    <div className="px-6 py-20 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfeff] text-[#00a6c7]">
                            <ShieldAlert className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-extrabold text-[#1e293b]">
                            {emptyMessage}
                        </h3>

                        <p className="mt-1 text-sm text-[#94a3b8]">
                            {query || priority !== "All"
                                ? "Try changing your search or filters."
                                : "There are currently no records to display."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="bg-[#f8fafc]">
                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Item
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Submitted By
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Date
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Priority
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Reason
                                        </th>

                                        <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedRows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-t border-[#f1f5f9] transition hover:bg-[#f8fafc]"
                                        >
                                            {/* Item */}
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfeff] text-[#00a6c7]">
                                                        <Flag className="h-4 w-4" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-bold text-[#1e293b]">
                                                            {row.item ||
                                                                "Unknown item"}
                                                        </p>

                                                        {row.status && (
                                                            <p className="mt-1 text-xs text-[#94a3b8]">
                                                                {row.status}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Submitted By */}
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[10px] font-extrabold text-[#64748b]">
                                                        {getInitials(
                                                            row.submittedBy
                                                        )}
                                                    </div>

                                                    <span className="text-sm font-medium text-[#475569]">
                                                        {row.submittedBy ||
                                                            "Unknown"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-5 py-5 text-sm text-[#64748b]">
                                                {row.date || "—"}
                                            </td>

                                            {/* Priority */}
                                            <td className="px-5 py-5">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${getPriorityClasses(
                                                        row.priority
                                                    )}`}
                                                >
                                                    {row.priority ||
                                                        "Normal"}
                                                </span>
                                            </td>

                                            {/* Reason */}
                                            <td className="max-w-[240px] px-5 py-5">
                                                <p className="truncate text-sm text-[#64748b]">
                                                    {row.reason ||
                                                        "No reason provided"}
                                                </p>
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAction(row)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition hover:border-[#00b4d8] hover:text-[#00a6c7]"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {actionLabel}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="divide-y divide-[#f1f5f9] md:hidden">
                            {paginatedRows.map((row) => (
                                <div
                                    key={row.id}
                                    className="p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfeff] text-[#00a6c7]">
                                                <Flag className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-[#1e293b]">
                                                    {row.item ||
                                                        "Unknown item"}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-[#64748b]">
                                                    {row.reason ||
                                                        "No reason provided"}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getPriorityClasses(
                                                row.priority
                                            )}`}
                                        >
                                            {row.priority || "Normal"}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#94a3b8]">
                                                Submitted by
                                            </span>

                                            <span className="font-semibold text-[#334155]">
                                                {row.submittedBy ||
                                                    "Unknown"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#94a3b8]">
                                                Date
                                            </span>

                                            <span className="font-semibold text-[#334155]">
                                                {row.date || "—"}
                                            </span>
                                        </div>

                                        {row.status && (
                                            <div className="flex justify-between gap-4">
                                                <span className="text-[#94a3b8]">
                                                    Status
                                                </span>

                                                <span className="font-semibold text-[#334155]">
                                                    {row.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAction(row)
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00b4d8] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#009bbb]"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {actionLabel}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {filteredRows.length > 0 && totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4">
                    <button
                        type="button"
                        disabled={safePage === 1}
                        onClick={() =>
                            setPage((current) =>
                                Math.max(1, current - 1)
                            )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-bold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() =>
                                    setPage(pageNumber)
                                }
                                className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
                                    safePage === pageNumber
                                        ? "bg-[#00b4d8] text-white"
                                        : "text-[#64748b] hover:bg-[#f1f5f9]"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        disabled={safePage === totalPages}
                        onClick={() =>
                            setPage((current) =>
                                Math.min(
                                    totalPages,
                                    current + 1
                                )
                            )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-bold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ModerationTablePage;