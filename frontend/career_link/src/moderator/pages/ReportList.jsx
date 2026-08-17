import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";

export default function ReportList() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    /*
     * =========================================================
     * LOAD REPORTS
     * =========================================================
     */

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await moderatorApi.getReports();

            console.log("REPORT RESPONSE:", data);

            if (Array.isArray(data)) {
                setReports(data);
            } else if (Array.isArray(data?.results)) {
                setReports(data.results);
            } else {
                console.error(
                    "Unexpected reports response:",
                    data
                );

                setReports([]);

                setError(
                    "Unexpected response received from the server."
                );
            }
        } catch (err) {
            console.error(
                "Failed to load reports:",
                err
            );

            setReports([]);

            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * =========================================================
     * INITIAL LOAD
     * =========================================================
     */

    useEffect(() => {
        loadReports();
    }, []);

    /*
     * =========================================================
     * FILTER REPORTS
     * =========================================================
     */

    const filteredReports = useMemo(() => {
        const query = search.trim().toLowerCase();

        return reports.filter((report) => {
            const reportStatus =
                report.status ||
                report.report_status ||
                "Pending";

            const matchesStatus =
                status === "All" ||
                reportStatus.toLowerCase() ===
                    status.toLowerCase();

            const searchableText = [
                report.id,
                report.reported_job,
                report.job_id,
                report.job?.id,
                report.reported_by,
                report.reviewed_by,
                report.report_reason,
                report.report_description,
                report.status,
                report.report_status,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query ||
                searchableText.includes(query);

            return (
                matchesStatus &&
                matchesSearch
            );
        });
    }, [reports, search, status]);

    /*
     * =========================================================
     * CLEAR FILTERS
     * =========================================================
     */

    const clearFilters = () => {
        setSearch("");
        setStatus("All");
    };

    /*
     * =========================================================
     * VIEW REPORT
     * =========================================================
     */

    const handleView = (reportId) => {
        navigate(
            `/moderator/reports/${reportId}`
        );
    };

    /*
     * =========================================================
     * PAGE
     * =========================================================
     */

    return (
        <div className="min-h-screen bg-[#FAF9FF] text-[#172033]">
            <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>

                        {/* Back to Dashboard */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/moderator")
                            }
                            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition duration-200 hover:border-[#6D4AFF] hover:bg-[#F3F0FF] hover:shadow-md"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                arrow_back
                            </span>

                            Back to Dashboard
                        </button>

                        {/* Section Label */}
                        <div className="mb-3 flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#6D4AFF]">
                                <span className="material-symbols-outlined text-[20px]">
                                    flag
                                </span>
                            </div>

                            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#6D4AFF]">
                                Moderation
                            </p>

                        </div>

                        {/* Title */}
                        <h1 className="font-['Montserrat'] text-3xl font-bold tracking-tight text-[#172033] md:text-4xl">
                            Reports
                        </h1>

                        <p className="mt-2 max-w-2xl text-base leading-6 text-[#667085]">
                            Review reports submitted by
                            users and take appropriate
                            moderation action.
                        </p>

                    </div>

                    {/* Refresh */}
                    <button
                        type="button"
                        onClick={loadReports}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-5 py-3 text-sm font-bold text-[#6D4AFF] shadow-sm transition duration-200 hover:border-[#6D4AFF] hover:bg-[#F3F0FF] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] ${
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        >
                            refresh
                        </span>

                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>

                {/* =====================================================
                    QUICK SUMMARY
                ====================================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <SummaryCard
                        icon="flag"
                        label="Total Reports"
                        value={reports.length}
                    />

                    <SummaryCard
                        icon="pending_actions"
                        label="Pending"
                        value={
                            reports.filter(
                                (report) =>
                                    (
                                        report.status ||
                                        report.report_status ||
                                        "Pending"
                                    ).toLowerCase() ===
                                    "pending"
                            ).length
                        }
                    />

                    <SummaryCard
                        icon="visibility"
                        label="Showing"
                        value={
                            filteredReports.length
                        }
                    />

                </div>

                {/* =====================================================
                    ERROR
                ====================================================== */}

                {error && (
                    <div className="mb-6 rounded-xl border border-[#FFD6D6] bg-white p-4 shadow-sm">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F1] text-[#B7102A]">
                                <span className="material-symbols-outlined">
                                    error
                                </span>
                            </div>

                            <div className="min-w-0">

                                <p className="font-bold text-[#93000A]">
                                    Unable to load reports
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[#667085]">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={loadReports}
                                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#6D4AFF] transition hover:text-[#5636D9]"
                                >
                                    Try again

                                    <span className="material-symbols-outlined text-[17px]">
                                        arrow_forward
                                    </span>
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* =====================================================
                    FILTERS
                ====================================================== */}

                <div className="mb-5 rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm md:p-6">

                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#6D4AFF]">
                                <span className="material-symbols-outlined text-[20px]">
                                    tune
                                </span>
                            </div>

                            <div>

                                <h2 className="text-sm font-bold text-[#172033]">
                                    Search & Filters
                                </h2>

                                <p className="text-xs text-[#98A2B3]">
                                    Find a specific moderation
                                    report quickly.
                                </p>

                            </div>

                        </div>

                        {(search ||
                            status !== "All") && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="self-start rounded-lg px-3 py-2 text-sm font-bold text-[#B7102A] transition hover:bg-[#FFF1F1] sm:self-auto"
                            >
                                Clear filters
                            </button>
                        )}

                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row">

                        {/* Search */}
                        <div className="relative flex-1">

                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                                search
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search reports, users, jobs, reasons..."
                                className="w-full rounded-xl border border-[#E7E3F2] bg-[#FAF9FF] py-3.5 pl-12 pr-4 text-sm text-[#172033] outline-none transition duration-200 placeholder:text-[#98A2B3] focus:border-[#6D4AFF] focus:bg-white focus:ring-4 focus:ring-[#EEEAFE]"
                            />

                        </div>

                        {/* Status */}
                        <div className="relative min-w-full lg:min-w-[230px]">

                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                                filter_list
                            </span>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-[#E7E3F2] bg-[#FAF9FF] py-3.5 pl-12 pr-10 text-sm font-semibold text-[#6D4AFF] outline-none transition duration-200 focus:border-[#6D4AFF] focus:bg-white focus:ring-4 focus:ring-[#EEEAFE]"
                            >
                                <option value="All">
                                    All statuses
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Under Review">
                                    Under Review
                                </option>

                                <option value="Resolved">
                                    Resolved
                                </option>

                                <option value="Rejected">
                                    Rejected
                                </option>
                            </select>

                            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                                expand_more
                            </span>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    RESULT SUMMARY
                ====================================================== */}

                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-[#667085]">
                        Showing{" "}
                        <strong className="font-bold text-[#172033]">
                            {filteredReports.length}
                        </strong>{" "}
                        of{" "}
                        <strong className="font-bold text-[#172033]">
                            {reports.length}
                        </strong>{" "}
                        reports
                    </p>

                    {(search ||
                        status !== "All") && (
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F3F0FF] px-3 py-1.5 text-xs font-bold text-[#6D4AFF]">

                            <span className="h-1.5 w-1.5 rounded-full bg-[#6D4AFF]" />

                            Filters active

                        </div>
                    )}

                </div>

                {/* =====================================================
                    LOADING
                ====================================================== */}

                {loading && (
                    <div className="rounded-2xl border border-[#E7E3F2] bg-white p-16 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6D4AFF]">

                            <span className="material-symbols-outlined animate-spin text-3xl">
                                progress_activity
                            </span>

                        </div>

                        <p className="mt-4 text-sm font-semibold text-[#667085]">
                            Loading reports...
                        </p>

                    </div>
                )}

                {/* =====================================================
                    EMPTY
                ====================================================== */}

                {!loading &&
                    filteredReports.length === 0 && (
                        <div className="rounded-2xl border border-[#E7E3F2] bg-white px-6 py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6D4AFF]">

                                <span className="material-symbols-outlined text-3xl">
                                    flag
                                </span>

                            </div>

                            <h2 className="mt-5 font-['Montserrat'] text-xl font-bold text-[#172033]">
                                No reports found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
                                There are no reports
                                matching your current
                                filters.
                            </p>

                            {(search ||
                                status !== "All") && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 rounded-lg bg-[#6D4AFF] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5636D9]"
                                >
                                    Clear filters
                                </button>
                            )}

                        </div>
                    )}

                {/* =====================================================
                    REPORTS
                ====================================================== */}

                {!loading &&
                    filteredReports.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            {/* Desktop */}
                            <div className="hidden overflow-x-auto md:block">

                                <table className="w-full">

                                    <thead>
                                        <tr className="border-b border-[#E7E3F2] bg-[#F3F0FF]">

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Report
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Job
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Reported By
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Submitted
                                            </th>

                                            <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#F0EDF7]">

                                        {filteredReports.map(
                                            (report) => (
                                                <ReportRow
                                                    key={
                                                        report.id
                                                    }
                                                    report={
                                                        report
                                                    }
                                                    onView={() =>
                                                        handleView(
                                                            report.id
                                                        )
                                                    }
                                                />
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {/* Mobile */}
                            <div className="divide-y divide-[#F0EDF7] md:hidden">

                                {filteredReports.map(
                                    (report) => (
                                        <ReportMobileCard
                                            key={
                                                report.id
                                            }
                                            report={
                                                report
                                            }
                                            onView={() =>
                                                handleView(
                                                    report.id
                                                )
                                            }
                                        />
                                    )
                                )}

                            </div>

                        </div>
                    )}

            </div>
        </div>
    );
}

/*
 * =========================================================
 * SUMMARY CARD
 * =========================================================
 */

function SummaryCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                    {label}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#172033]">
                    {value}
                </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">

                <span className="material-symbols-outlined">
                    {icon}
                </span>

            </div>

        </div>
    );
}

/*
 * =========================================================
 * DESKTOP REPORT ROW
 * =========================================================
 */

function ReportRow({
    report,
    onView,
}) {
    const reportStatus =
        report.status ||
        report.report_status ||
        "Pending";

    const reportedJob =
        report.reported_job ||
        report.job_id ||
        report.job?.id;

    return (
        <tr className="group transition duration-150 hover:bg-[#FCFBFF]">

            {/* Report */}
            <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF] transition group-hover:bg-[#EDE8FF]">

                        <span className="material-symbols-outlined">
                            flag
                        </span>

                    </div>

                    <div className="min-w-0">

                        <p className="font-bold text-[#172033]">
                            Report #{report.id}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-sm text-[#667085]">
                            {report.report_reason ||
                                "No reason provided"}
                        </p>

                    </div>

                </div>

            </td>

            {/* Job */}
            <td className="px-6 py-5">

                <span className="inline-flex rounded-lg bg-[#F8F6FF] px-3 py-1.5 text-sm font-bold text-[#6D4AFF]">
                    {reportedJob
                        ? `Job #${reportedJob}`
                        : "Unknown"}
                </span>

            </td>

            {/* Reported By */}
            <td className="px-6 py-5">

                <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6D4AFF]">

                        <span className="material-symbols-outlined text-[17px]">
                            person
                        </span>

                    </div>

                    <span className="max-w-[180px] truncate font-medium text-[#42474F]">
                        {report.reported_by ||
                            "Unknown"}
                    </span>

                </div>

            </td>

            {/* Status */}
            <td className="px-6 py-5">

                <ReportStatusBadge
                    status={reportStatus}
                />

            </td>

            {/* Date */}
            <td className="whitespace-nowrap px-6 py-5 text-sm text-[#667085]">

                {report.reported_at
                    ? new Date(
                          report.reported_at
                      ).toLocaleDateString()
                    : "N/A"}

            </td>

            {/* Action */}
            <td className="px-6 py-5 text-right">

                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition duration-200 hover:border-[#6D4AFF] hover:bg-[#F3F0FF] hover:shadow-md"
                >
                    View

                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                    </span>
                </button>

            </td>

        </tr>
    );
}

/*
 * =========================================================
 * MOBILE REPORT CARD
 * =========================================================
 */

function ReportMobileCard({
    report,
    onView,
}) {
    const reportStatus =
        report.status ||
        report.report_status ||
        "Pending";

    const reportedJob =
        report.reported_job ||
        report.job_id ||
        report.job?.id;

    return (
        <div className="p-5 transition hover:bg-[#FCFBFF]">

            {/* Top */}
            <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">

                        <span className="material-symbols-outlined">
                            flag
                        </span>

                    </div>

                    <div className="min-w-0">

                        <p className="font-bold text-[#172033]">
                            Report #{report.id}
                        </p>

                        <p className="mt-1 text-xs text-[#98A2B3]">
                            {report.reported_at
                                ? new Date(
                                      report.reported_at
                                  ).toLocaleDateString()
                                : "N/A"}
                        </p>

                    </div>

                </div>

                <ReportStatusBadge
                    status={reportStatus}
                />

            </div>

            {/* Reason */}
            <div className="mt-5">

                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                    Reason
                </p>

                <p className="mt-1.5 font-bold text-[#172033]">
                    {report.report_reason ||
                        "No reason provided"}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {report.report_description ||
                        "No description provided."}
                </p>

            </div>

            {/* Metadata */}
            <div className="mt-5 rounded-xl bg-[#FAF9FF] p-4">

                <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-[#667085]">
                        Job
                    </span>

                    <span className="font-bold text-[#6D4AFF]">
                        {reportedJob
                            ? `Job #${reportedJob}`
                            : "Unknown"}
                    </span>

                </div>

                <div className="my-3 h-px bg-[#E7E3F2]" />

                <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-[#667085]">
                        Reported by
                    </span>

                    <span className="max-w-[180px] truncate font-bold text-[#172033]">
                        {report.reported_by ||
                            "Unknown"}
                    </span>

                </div>

            </div>

            {/* View */}
            <button
                type="button"
                onClick={onView}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-[#5636D9] hover:shadow-md"
            >
                View Report

                <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                </span>

            </button>

        </div>
    );
}