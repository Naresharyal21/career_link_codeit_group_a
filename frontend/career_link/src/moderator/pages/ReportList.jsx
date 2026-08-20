import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";




function formatReportId(id) {
    if (id === null || id === undefined) {
        return "R00";
    }

    return `R00${id}`;
}




function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}



export default function ReportList() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");




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
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load reports."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadReports();
    }, []);



    const getReportStatus = (report) => {
        return (
            report?.status ||
            report?.report_status ||
            "Pending"
        );
    };


    const getReportedJobId = (report) => {
        return (
            report?.reported_job ||
            report?.job_id ||
            report?.job?.id ||
            null
        );
    };


    const getReportedJobTitle = (report) => {
        return (
            report?.reported_job_title ||
            report?.job?.title ||
            null
        );
    };


    const getReportedBy = (report) => {
        return (
            report?.reported_by_name ||
            report?.reported_by ||
            report?.reporter ||
            "Unknown"
        );
    };


    const getReportReason = (report) => {
        return (
            report?.report_reason ||
            report?.reason ||
            "No reason provided"
        );
    };


    const getReportDescription = (report) => {
        return (
            report?.report_description ||
            report?.description ||
            "No description provided."
        );
    };


    const getSubmittedDate = (report) => {
        return (
            report?.reported_at ||
            report?.created_at ||
            report?.created ||
            null
        );
    };




    const filteredReports = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        return reports.filter((report) => {
            const reportStatus =
                getReportStatus(report);

            const matchesStatus =
                status === "All" ||
                String(reportStatus).toLowerCase() ===
                    status.toLowerCase();

            const searchableText = [
                report?.id,
                formatReportId(report?.id),

                report?.reported_job,
                report?.reported_job_title,
                report?.job_id,
                report?.job?.id,
                report?.job?.title,

                report?.reported_by,
                report?.reported_by_name,
                report?.reporter,

                report?.report_reason,
                report?.reason,

                report?.report_description,
                report?.description,

                report?.status,
                report?.report_status,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLowerCase();

            return (
                matchesStatus &&
                (!query ||
                    searchableText.includes(query))
            );
        });
    }, [
        reports,
        search,
        status,
    ]);



    const totalReports = reports.length;

    const pendingReports = reports.filter(
        (report) =>
            getReportStatus(report).toLowerCase() ===
            "pending"
    ).length;

    const underReviewReports = reports.filter(
        (report) => {
            const value =
                getReportStatus(report).toLowerCase();

            return (
                value === "under review" ||
                value === "in review"
            );
        }
    ).length;

    const resolvedReports = reports.filter(
        (report) =>
            getReportStatus(report).toLowerCase() ===
            "resolved"
    ).length;

    const rejectedReports = reports.filter(
        (report) =>
            getReportStatus(report).toLowerCase() ===
            "rejected"
    ).length;




    const clearFilters = () => {
        setSearch("");
        setStatus("All");
    };


    const handleView = (reportId) => {
        navigate(
            `/moderator/reports/${reportId}`
        );
    };



    return (
        <div className="min-h-screen bg-[#F8F9FF] text-[#172033]">

            <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">




                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/moderator")
                        }
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition hover:border-[#6D4AFF] hover:bg-[#F3F0FF]"
                    >
                        <span className="material-symbols-outlined text-[19px]">
                            arrow_back
                        </span>

                        Dashboard
                    </button>


                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6D4AFF]">

                                    <span className="material-symbols-outlined">
                                        flag
                                    </span>

                                </div>

                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D4AFF]">
                                    Moderation
                                </span>

                            </div>


                            <h1 className="font-['Montserrat'] text-3xl font-bold tracking-tight text-[#172033] md:text-4xl">
                                Reports
                            </h1>


                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085] md:text-base">
                                Review reports submitted by
                                job seekers and employers,
                                investigate reported content,
                                and take appropriate action.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={loadReports}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-5 py-3 text-sm font-bold text-[#6D4AFF] shadow-sm transition hover:border-[#6D4AFF] hover:bg-[#F3F0FF] disabled:cursor-not-allowed disabled:opacity-50"
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
                                : "Refresh reports"}

                        </button>

                    </div>

                </div>



                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    <SummaryCard
                        icon="flag"
                        label="Total Reports"
                        value={totalReports}
                    />

                    <SummaryCard
                        icon="pending_actions"
                        label="Pending"
                        value={pendingReports}
                    />

                    <SummaryCard
                        icon="rate_review"
                        label="Under Review"
                        value={underReviewReports}
                    />

                    <SummaryCard
                        icon="check_circle"
                        label="Resolved"
                        value={resolvedReports}
                    />

                    <SummaryCard
                        icon="cancel"
                        label="Rejected"
                        value={rejectedReports}
                    />

                </div>




                {error && (
                    <div className="mb-6 rounded-2xl border border-[#FFD6D6] bg-white p-5 shadow-sm">

                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F1] text-[#B7102A]">

                                <span className="material-symbols-outlined">
                                    error
                                </span>

                            </div>


                            <div>

                                <p className="font-bold text-[#93000A]">
                                    Unable to load reports
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[#667085]">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={loadReports}
                                    className="mt-3 text-sm font-bold text-[#6D4AFF] hover:text-[#5636D9]"
                                >
                                    Try again
                                </button>

                            </div>

                        </div>

                    </div>
                )}


                <div className="mb-5 rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm md:p-6">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6D4AFF]">

                                <span className="material-symbols-outlined">
                                    tune
                                </span>

                            </div>


                            <div>

                                <h2 className="font-bold text-[#172033]">
                                    Search & Filters
                                </h2>

                                <p className="text-xs text-[#98A2B3]">
                                    Find reports by ID,
                                    user, job or reason.
                                </p>

                            </div>

                        </div>


                        {(search ||
                            status !== "All") && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-bold text-[#B7102A] hover:text-[#93000A]"
                            >
                                Clear filters
                            </button>
                        )}

                    </div>


                    <div className="grid gap-3 lg:grid-cols-[1fr_240px]">

                        <div className="relative">

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
                                placeholder="Search report ID, user, job, reason..."
                                className="w-full rounded-xl border border-[#E7E3F2] bg-[#FAF9FF] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:bg-white focus:ring-4 focus:ring-[#EEEAFE]"
                            />

                        </div>


                        <div className="relative">

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
                                className="w-full appearance-none rounded-xl border border-[#E7E3F2] bg-[#FAF9FF] py-3.5 pl-12 pr-10 text-sm font-semibold text-[#172033] outline-none focus:border-[#6D4AFF] focus:bg-white focus:ring-4 focus:ring-[#EEEAFE]"
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



                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-[#667085]">

                        Showing{" "}

                        <strong className="font-bold text-[#172033]">
                            {filteredReports.length}
                        </strong>

                        {" "}of{" "}

                        <strong className="font-bold text-[#172033]">
                            {reports.length}
                        </strong>

                        {" "}reports

                    </p>


                    {(search ||
                        status !== "All") && (
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EEEAFE] px-3 py-1.5 text-xs font-bold text-[#6D4AFF]">

                            <span className="h-1.5 w-1.5 rounded-full bg-[#6D4AFF]" />

                            Filters active

                        </span>
                    )}

                </div>




                {loading && (
                    <LoadingState />
                )}




                {!loading &&
                    filteredReports.length === 0 && (
                        <EmptyState
                            hasFilters={
                                !!search ||
                                status !== "All"
                            }
                            onClear={clearFilters}
                        />
                    )}



                {!loading &&
                    filteredReports.length > 0 && (

                        <div className="overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            <div className="hidden overflow-x-auto md:block">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b border-[#E7E3F2] bg-[#FAF9FF]">

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Report
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                                                Report Information
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
                                                    key={report.id}
                                                    report={report}
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


                            {/* MOBILE */}

                            <div className="divide-y divide-[#F0EDF7] md:hidden">

                                {filteredReports.map(
                                    (report) => (
                                        <ReportMobileCard
                                            key={report.id}
                                            report={report}
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


function SummaryCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="group flex items-center justify-between rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#98A2B3]">
                    {label}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#172033]">
                    {value}
                </p>

            </div>


            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6D4AFF] transition group-hover:bg-[#E4DEFF]">

                <span className="material-symbols-outlined">
                    {icon}
                </span>

            </div>

        </div>
    );
}



function ReportRow({
    report,
    onView,
}) {
    const reportStatus =
        report?.status ||
        report?.report_status ||
        "Pending";

    const reportedJobId =
        report?.reported_job ||
        report?.job_id ||
        report?.job?.id ||
        null;

    const reportedJobTitle =
        report?.reported_job_title ||
        report?.job?.title ||
        null;

    const reportedBy =
        report?.reported_by_name ||
        report?.reported_by ||
        report?.reporter ||
        "Unknown";

    const reason =
        report?.report_reason ||
        report?.reason ||
        "No reason provided";

    const submittedDate =
        report?.reported_at ||
        report?.created_at ||
        report?.created ||
        null;


    return (
        <tr className="group transition hover:bg-[#FCFBFF]">


            {/* REPORT */}

            <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6D4AFF]">

                        <span className="material-symbols-outlined">
                            flag
                        </span>

                    </div>


                    <div>

                        <p className="font-bold text-[#172033]">
                            {formatReportId(
                                report.id
                            )}
                        </p>

                        <p className="mt-1 text-xs text-[#98A2B3]">
                            Moderation report
                        </p>

                    </div>

                </div>

            </td>


            {/* REPORT INFORMATION */}

            <td className="px-6 py-5">

                <div className="max-w-[260px]">

                    <div className="mb-2 inline-flex items-center rounded-lg bg-[#F3F0FF] px-2.5 py-1 text-xs font-bold text-[#6D4AFF]">
                        Report {formatReportId(
                            report.id
                        )}
                    </div>


                    <p className="truncate font-bold text-[#172033]">
                        {reportedJobTitle ||
                            "Reported Job"}
                    </p>


                    <p className="mt-1 truncate text-sm text-[#667085]">
                        {reason}
                    </p>


                    {reportedJobId && (
                        <p className="mt-1.5 text-xs text-[#98A2B3]">
                            Job #{reportedJobId}
                        </p>
                    )}

                </div>

            </td>


            {/* REPORTED BY */}

            <td className="px-6 py-5">

                <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6D4AFF]">

                        <span className="material-symbols-outlined text-[17px]">
                            person
                        </span>

                    </div>


                    <span className="max-w-[160px] truncate font-medium text-[#42474F]">
                        {reportedBy}
                    </span>

                </div>

            </td>


            {/* STATUS */}

            <td className="px-6 py-5">

                <ReportStatusBadge
                    status={reportStatus}
                />

            </td>


            {/* DATE */}

            <td className="whitespace-nowrap px-6 py-5 text-sm text-[#667085]">

                {formatDate(submittedDate)}

            </td>


            {/* ACTION */}

            <td className="px-6 py-5 text-right">

                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition hover:border-[#6D4AFF] hover:bg-[#F3F0FF]"
                >
                    View

                    <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                    </span>

                </button>

            </td>

        </tr>
    );
}




function ReportMobileCard({
    report,
    onView,
}) {
    const reportStatus =
        report?.status ||
        report?.report_status ||
        "Pending";

    const reportedJobId =
        report?.reported_job ||
        report?.job_id ||
        report?.job?.id ||
        null;

    const reportedJobTitle =
        report?.reported_job_title ||
        report?.job?.title ||
        null;

    const reportedBy =
        report?.reported_by_name ||
        report?.reported_by ||
        report?.reporter ||
        "Unknown";

    const reason =
        report?.report_reason ||
        report?.reason ||
        "No reason provided";

    const description =
        report?.report_description ||
        report?.description ||
        "No description provided.";

    const submittedDate =
        report?.reported_at ||
        report?.created_at ||
        report?.created ||
        null;


    return (
        <div className="p-5">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6D4AFF]">

                        <span className="material-symbols-outlined">
                            flag
                        </span>

                    </div>


                    <div className="min-w-0">

                        <p className="font-bold text-[#172033]">
                            {formatReportId(
                                report.id
                            )}
                        </p>

                        <p className="mt-1 text-xs text-[#98A2B3]">
                            {formatDate(
                                submittedDate
                            )}
                        </p>

                    </div>

                </div>


                <ReportStatusBadge
                    status={reportStatus}
                />

            </div>


            {/* REPORT INFORMATION */}

            <div className="mt-5 rounded-xl bg-[#FAF9FF] p-4">

                <div className="mb-3 flex items-center justify-between gap-3">

                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#98A2B3]">
                        Report ID
                    </span>

                    <span className="rounded-lg bg-[#EEEAFE] px-2.5 py-1 text-xs font-bold text-[#6D4AFF]">
                        {formatReportId(
                            report.id
                        )}
                    </span>

                </div>


                <div className="h-px bg-[#E7E3F2]" />


                <div className="mt-3">

                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#98A2B3]">
                        Reason
                    </p>

                    <p className="mt-1.5 font-bold text-[#172033]">
                        {reason}
                    </p>

                </div>


                <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {description}
                </p>

            </div>


            {/* JOB */}

            <div className="mt-4 rounded-xl border border-[#E7E3F2] bg-white p-4">

                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#98A2B3]">
                    Reported Job
                </p>


                <p className="mt-1.5 font-bold text-[#172033]">
                    {reportedJobTitle ||
                        "Unknown job"}
                </p>


                {reportedJobId && (
                    <p className="mt-1 text-xs text-[#98A2B3]">
                        Job #{reportedJobId}
                    </p>
                )}

            </div>


            {/* USER */}

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#E7E3F2] bg-white p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6D4AFF]">

                    <span className="material-symbols-outlined text-[18px]">
                        person
                    </span>

                </div>


                <div className="min-w-0">

                    <p className="text-xs text-[#98A2B3]">
                        Reported by
                    </p>

                    <p className="truncate font-bold text-[#172033]">
                        {reportedBy}
                    </p>

                </div>

            </div>


            {/* ACTION */}

            <button
                type="button"
                onClick={onView}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#5636D9] hover:shadow-md"
            >
                View Report

                <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                </span>

            </button>

        </div>
    );
}



function LoadingState() {
    return (
        <div className="rounded-2xl border border-[#E7E3F2] bg-white p-16 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEEAFE] text-[#6D4AFF]">

                <span className="material-symbols-outlined animate-spin text-3xl">
                    progress_activity
                </span>

            </div>


            <p className="mt-4 font-semibold text-[#667085]">
                Loading reports...
            </p>

            <p className="mt-1 text-sm text-[#98A2B3]">
                Please wait while we retrieve
                moderation reports.
            </p>

        </div>
    );
}



function EmptyState({
    hasFilters,
    onClear,
}) {
    return (
        <div className="rounded-2xl border border-[#E7E3F2] bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#6D4AFF]">

                <span className="material-symbols-outlined text-3xl">
                    flag
                </span>

            </div>


            <h2 className="mt-5 font-['Montserrat'] text-xl font-bold text-[#172033]">
                {hasFilters
                    ? "No matching reports"
                    : "No reports yet"}
            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">

                {hasFilters
                    ? "Try adjusting your search or status filter to find the report you are looking for."
                    : "There are currently no moderation reports available."}

            </p>


            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-5 rounded-xl bg-[#6D4AFF] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5636D9]"
                >
                    Clear filters
                </button>
            )}

        </div>
    );
}