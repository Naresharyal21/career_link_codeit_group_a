import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertCircle,
    CalendarDays,
    Eye,
    Flag,
    Filter,
    RefreshCw,
    Search,
    SlidersHorizontal,
    UserRound,
    X,
} from "lucide-react";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";
import ModeratorSectionPage from "../components/ModeratorSectionPage";

import { formatReportId } from "../utils/report";

const STATUS_OPTIONS = [
    "All",
    "Pending",
    "Under Review",
    "Resolved",
    "Rejected",
];


const PRIORITY_OPTIONS = [
    "All",
    "Critical",
    "High",
    "Medium",
    "Low",
];




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


function getReportedBy(report) {
    if (
        typeof report?.reported_by === "object" &&
        report?.reported_by !== null
    ) {
        return (
            report.reported_by.username ||
            report.reported_by.email ||
            "Unknown user"
        );
    }

    return (
        report?.reported_by_name ||
        report?.reported_by ||
        report?.reporter ||
        "Unknown user"
    );
}


function getJobId(report) {
    if (
        typeof report?.reported_job === "object" &&
        report?.reported_job !== null
    ) {
        return report.reported_job.id || null;
    }

    return (
        report?.reported_job ||
        report?.job_id ||
        report?.job?.id ||
        null
    );
}


function getJobTitle(report) {
    if (
        typeof report?.reported_job === "object" &&
        report?.reported_job !== null
    ) {
        return (
            report.reported_job.title ||
            `Job #${report.reported_job.id}`
        );
    }

    return (
        report?.reported_job_title ||
        report?.job?.title ||
        (getJobId(report)
            ? `Job #${getJobId(report)}`
            : "Unknown job")
    );
}


function getReason(report) {
    return (
        report?.report_reason ||
        report?.reason ||
        "Other"
    );
}


function getStatus(report) {
    return (
        report?.status ||
        report?.report_status ||
        "Pending"
    );
}


function getPriority(report) {
    if (report?.priority) {
        return report.priority;
    }

    const reason = String(
        getReason(report)
    ).toLowerCase();

    if (
        reason.includes("scam") ||
        reason.includes("fake") ||
        reason.includes("fraud") ||
        reason.includes("phishing")
    ) {
        return "Critical";
    }

    if (
        reason.includes("harassment") ||
        reason.includes("abuse") ||
        reason.includes("offensive")
    ) {
        return "High";
    }

    if (
        reason.includes("spam") ||
        reason.includes("misleading") ||
        reason.includes("duplicate")
    ) {
        return "Medium";
    }

    return "Low";
}


function getPriorityStyle(priority) {
    switch (priority) {
        case "Critical":
            return "bg-red-50 text-red-700 border-red-200";

        case "High":
            return "bg-orange-50 text-orange-700 border-orange-200";

        case "Medium":
            return "bg-amber-50 text-amber-700 border-amber-200";

        case "Low":
        default:
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
}


export default function ReportList() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [priorityFilter, setPriorityFilter] =
        useState("All");

    const [reasonFilter, setReasonFilter] =
        useState("All");

    const [showFilters, setShowFilters] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const pageSize = 8;




    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await moderatorApi.getReports();

            console.log(
                "REPORT LIST RESPONSE:",
                response
            );

            const data = Array.isArray(response)
                ? response
                : Array.isArray(
                      response?.results
                  )
                ? response.results
                : [];

            setReports(data);
            setPage(1);
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




    const reasons = useMemo(() => {
        const unique = [
            ...new Set(
                reports
                    .map((report) =>
                        getReason(report)
                    )
                    .filter(Boolean)
            ),
        ];

        return [
            "All",
            ...unique,
        ];
    }, [reports]);


   

    const filteredReports = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        return reports.filter((report) => {
            const reportId =
                formatReportId(report.id);

            const jobTitle =
                getJobTitle(report);

            const reporter =
                getReportedBy(report);

            const reason =
                getReason(report);

            const status =
                getStatus(report);

            const priority =
                getPriority(report);

            const searchable = [
                reportId,
                report.id,
                jobTitle,
                reporter,
                reason,
                status,
                priority,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query ||
                searchable.includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                priority === priorityFilter;

            const matchesReason =
                reasonFilter === "All" ||
                reason === reasonFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesReason
            );
        });
    }, [
        reports,
        search,
        statusFilter,
        priorityFilter,
        reasonFilter,
    ]);


   
    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredReports.length /
                pageSize
        )
    );


    const currentPage = Math.min(
        page,
        totalPages
    );


    const paginatedReports =
        filteredReports.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );


    useEffect(() => {
        setPage(1);
    }, [
        search,
        statusFilter,
        priorityFilter,
        reasonFilter,
    ]);


   

    const stats = useMemo(() => {
        return {
            total: reports.length,

            pending: reports.filter(
                (report) =>
                    getStatus(report) ===
                    "Pending"
            ).length,

            underReview: reports.filter(
                (report) =>
                    getStatus(report) ===
                    "Under Review"
            ).length,

            resolved: reports.filter(
                (report) =>
                    getStatus(report) ===
                    "Resolved"
            ).length,

            rejected: reports.filter(
                (report) =>
                    getStatus(report) ===
                    "Rejected"
            ).length,
        };
    }, [reports]);




    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setPriorityFilter("All");
        setReasonFilter("All");
    };


    const hasActiveFilters =
        search.trim() !== "" ||
        statusFilter !== "All" ||
        priorityFilter !== "All" ||
        reasonFilter !== "All";


   

    return (
        <ModeratorSectionPage
            title="Reports"
            description="Review, investigate, and manage reports submitted for job postings."
            backLabel="Dashboard"
            backTo="/reports/"
        >

           

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

                <button
                    type="button"
                    onClick={loadReports}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loading
                                ? "animate-spin"
                                : ""
                        }`}
                    />

                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/reports/create/"
                        )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#5B21B6]"
                >
                    <Flag className="h-4 w-4" />
                    Create Report
                </button>
            </div>


           

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <div className="flex items-start gap-3">

                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="text-sm font-extrabold text-red-700">
                                Unable to load reports
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadReports}
                                className="mt-3 text-xs font-bold text-red-700 underline"
                            >
                                Try again
                            </button>
                        </div>

                    </div>
                </div>
            )}


          


            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <ReportStatCard
                    icon="flag"
                    label="Total"
                    value={stats.total}
                />

                <ReportStatCard
                    icon="pending_actions"
                    label="Pending"
                    value={stats.pending}
                    tone="warning"
                />

                <ReportStatCard
                    icon="rate_review"
                    label="Under Review"
                    value={
                        stats.underReview
                    }
                    tone="info"
                />

                <ReportStatCard
                    icon="task_alt"
                    label="Resolved"
                    value={stats.resolved}
                    tone="success"
                />

                <ReportStatCard
                    icon="cancel"
                    label="Rejected"
                    value={stats.rejected}
                    tone="danger"
                />

            </section>


          

            <section className="mt-6 rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">

                    {/* Search */}

                    <div className="relative flex-1">

                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search report ID, job, reporter, reason..."
                            className="w-full rounded-xl border border-[#E2E8F0] bg-[#FBFCFE] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                        />
                    </div>


                    {/* Filter toggle */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowFilters(
                                (current) =>
                                    !current
                            )
                        }
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            showFilters ||
                            hasActiveFilters
                                ? "border-[#6D4AFF] bg-[#F3F0FF] text-[#6D4AFF]"
                                : "border-[#E2E8F0] bg-white text-[#475467] hover:border-[#6D4AFF]"
                        }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />

                        Filters

                        {hasActiveFilters && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6D4AFF] px-1.5 text-[10px] font-extrabold text-white">
                                {[
                                    statusFilter !==
                                    "All"
                                        ? 1
                                        : 0,
                                    priorityFilter !==
                                    "All"
                                        ? 1
                                        : 0,
                                    reasonFilter !==
                                    "All"
                                        ? 1
                                        : 0,
                                    search.trim() !==
                                    ""
                                        ? 1
                                        : 0,
                                ].reduce(
                                    (
                                        total,
                                        value
                                    ) =>
                                        total +
                                        value,
                                    0
                                )}
                            </span>
                        )}
                    </button>

                </div>


                {showFilters && (
                    <div className="border-t border-[#F0EDF7] bg-[#FBFAFE] p-5">

                        <div className="grid gap-4 md:grid-cols-3">

                            {/* Status */}

                            <FilterSelect
                                label="Status"
                                value={
                                    statusFilter
                                }
                                onChange={
                                    setStatusFilter
                                }
                                options={
                                    STATUS_OPTIONS
                                }
                            />

                            {/* Priority */}

                            <FilterSelect
                                label="Priority"
                                value={
                                    priorityFilter
                                }
                                onChange={
                                    setPriorityFilter
                                }
                                options={
                                    PRIORITY_OPTIONS
                                }
                            />

                            {/* Reason */}

                            <FilterSelect
                                label="Reason"
                                value={
                                    reasonFilter
                                }
                                onChange={
                                    setReasonFilter
                                }
                                options={reasons}
                            />

                        </div>


                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#6D4AFF] hover:underline"
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear filters
                            </button>
                        )}

                    </div>
                )}

            </section>




            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-sm font-bold text-[#344054]">
                        {filteredReports.length}{" "}
                        report
                        {filteredReports.length !==
                        1
                            ? "s"
                            : ""}
                    </p>

                    <p className="mt-0.5 text-xs text-[#98A2B3]">
                        Showing{" "}
                        {filteredReports.length ===
                        0
                            ? 0
                            : (currentPage -
                                  1) *
                                  pageSize +
                              1}{" "}
                        -{" "}
                        {Math.min(
                            currentPage *
                                pageSize,
                            filteredReports.length
                        )}{" "}
                        of{" "}
                        {
                            filteredReports.length
                        }
                    </p>
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
                        <Filter className="h-3.5 w-3.5" />
                        Filters active
                    </div>
                )}

            </div>


         

            <section className="mt-3 overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                {loading ? (
                    <LoadingState />
                ) : paginatedReports.length ===
                  0 ? (
                    <EmptyState
                        hasFilters={
                            hasActiveFilters
                        }
                        onClear={
                            clearFilters
                        }
                    />
                ) : (
                    <>

                        {/* Desktop */}

                        <div className="hidden overflow-x-auto lg:block">

                            <table className="w-full min-w-[1050px]">

                                <thead>
                                    <tr className="border-b border-[#E7EAF2] bg-[#FBFAFE] text-left">

                                        <TableHeader>
                                            Report
                                        </TableHeader>

                                        <TableHeader>
                                            Job
                                        </TableHeader>

                                        <TableHeader>
                                            Reporter
                                        </TableHeader>

                                        <TableHeader>
                                            Reason
                                        </TableHeader>

                                        <TableHeader>
                                            Priority
                                        </TableHeader>

                                        <TableHeader>
                                            Status
                                        </TableHeader>

                                        <TableHeader>
                                            Submitted
                                        </TableHeader>

                                        <TableHeader align="right">
                                            Action
                                        </TableHeader>

                                    </tr>
                                </thead>

                                <tbody>

                                    {paginatedReports.map(
                                        (
                                            report
                                        ) => (
                                            <ReportRow
                                                key={
                                                    report.id
                                                }
                                                report={
                                                    report
                                                }
                                                onReview={() =>
                                                    navigate(
                                                        `/reports/${report.id}/`
                                                    )
                                                }
                                            />
                                        )
                                    )}

                                </tbody>
                            </table>

                        </div>


                        {/* Mobile / Tablet */}

                        <div className="divide-y divide-[#F0EDF7] lg:hidden">

                            {paginatedReports.map(
                                (
                                    report
                                ) => (
                                    <MobileReportCard
                                        key={
                                            report.id
                                        }
                                        report={
                                            report
                                        }
                                        onReview={() =>
                                            navigate(
                                                `/reports/${report.id}/`
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>

                    </>
                )}
            </section>


            {!loading &&
                filteredReports.length >
                    0 && (
                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-xs font-semibold text-[#98A2B3]">
                            Page {currentPage} of{" "}
                            {totalPages}
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    1
                                }
                                onClick={() =>
                                    setPage(
                                        (current) =>
                                            Math.max(
                                                1,
                                                current -
                                                    1
                                            )
                                    )
                                }
                                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">

                                {Array.from(
                                    {
                                        length: totalPages,
                                    },
                                    (_, index) =>
                                        index +
                                        1
                                )
                                    .slice(
                                        0,
                                        7
                                    )
                                    .map(
                                        (
                                            number
                                        ) => (
                                            <button
                                                key={
                                                    number
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setPage(
                                                        number
                                                    )
                                                }
                                                className={`h-10 w-10 rounded-xl text-sm font-extrabold transition ${
                                                    currentPage ===
                                                    number
                                                        ? "bg-[#6D4AFF] text-white"
                                                        : "border border-[#E2E8F0] bg-white text-[#475467] hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                                                }`}
                                            >
                                                {
                                                    number
                                                }
                                            </button>
                                        )
                                    )}

                            </div>

                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (current) =>
                                            Math.min(
                                                totalPages,
                                                current +
                                                    1
                                            )
                                    )
                                }
                                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>

                        </div>

                    </div>
                )}
        </ModeratorSectionPage>
    );
}




function ReportRow({
    report,
    onReview,
}) {
    const priority =
        getPriority(report);

    return (
        <tr className="border-b border-[#F0EDF7] transition hover:bg-[#FBFAFE]">

            <td className="px-5 py-5">
                <div>

                    <p className="text-sm font-extrabold text-[#172033]">
                        {formatReportId(
                            report.id
                        )}
                    </p>

                    <p className="mt-1 max-w-[180px] truncate text-xs text-[#98A2B3]">
                        Report #{report.id}
                    </p>

                </div>
            </td>


            <td className="px-5 py-5">
                <div className="max-w-[210px]">

                    <p className="truncate text-sm font-bold text-[#344054]">
                        {getJobTitle(
                            report
                        )}
                    </p>

                    {getJobId(report) && (
                        <p className="mt-1 text-xs text-[#98A2B3]">
                            Job #
                            {getJobId(
                                report
                            )}
                        </p>
                    )}

                </div>
            </td>


            <td className="px-5 py-5">

                <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0ECFF] text-[10px] font-extrabold text-[#6D4AFF]">
                        {getReportedBy(
                            report
                        )
                            .split(" ")
                            .slice(0, 2)
                            .map(
                                (part) =>
                                    part[0]
                            )
                            .join("")
                            .toUpperCase()}
                    </div>

                    <span className="max-w-[150px] truncate text-sm font-semibold text-[#475467]">
                        {getReportedBy(
                            report
                        )}
                    </span>

                </div>
            </td>


            <td className="px-5 py-5">
                <span className="text-sm font-semibold text-[#475467]">
                    {getReason(
                        report
                    )}
                </span>
            </td>


            <td className="px-5 py-5">

                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${getPriorityStyle(
                        priority
                    )}`}
                >
                    {priority}
                </span>

            </td>


            <td className="px-5 py-5">

                <ReportStatusBadge
                    status={getStatus(
                        report
                    )}
                />

            </td>


            <td className="px-5 py-5">

                <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">

                    <CalendarDays className="h-3.5 w-3.5 text-[#98A2B3]" />

                    {formatDate(
                        report?.reported_at ||
                            report?.created_at
                    )}

                </div>

            </td>


            <td className="px-5 py-5 text-right">

                <button
                    type="button"
                    onClick={onReview}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#5B21B6]"
                >
                    <Eye className="h-4 w-4" />
                    Review
                </button>

            </td>

        </tr>
    );
}




function MobileReportCard({
    report,
    onReview,
}) {
    const priority =
        getPriority(report);

    return (
        <div className="p-5">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <span className="font-extrabold text-[#172033]">
                            {formatReportId(
                                report.id
                            )}
                        </span>

                        <ReportStatusBadge
                            status={
                                getStatus(
                                    report
                                )
                            }
                        />

                    </div>

                    <h3 className="mt-3 truncate text-sm font-extrabold text-[#344054]">
                        {getJobTitle(
                            report
                        )}
                    </h3>

                    <p className="mt-1 text-xs text-[#98A2B3]">
                        Job #
                        {getJobId(
                            report
                        ) || "N/A"}
                    </p>

                </div>


                <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-extrabold ${getPriorityStyle(
                        priority
                    )}`}
                >
                    {priority}
                </span>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-4">

                <MobileInfo
                    icon={UserRound}
                    label="Reported By"
                    value={getReportedBy(
                        report
                    )}
                />

                <MobileInfo
                    icon={Flag}
                    label="Reason"
                    value={getReason(
                        report
                    )}
                />

                <MobileInfo
                    icon={CalendarDays}
                    label="Submitted"
                    value={formatDate(
                        report?.reported_at ||
                            report?.created_at
                    )}
                />

            </div>


            <button
                type="button"
                onClick={onReview}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#5B21B6]"
            >
                <Eye className="h-4 w-4" />
                Review Report
            </button>

        </div>
    );
}




function ReportStatCard({
    icon,
    label,
    value,
    tone = "default",
}) {
    const styles = {
        default:
            "bg-[#F0ECFF] text-[#6D4AFF]",

        warning:
            "bg-amber-50 text-amber-600",

        info:
            "bg-blue-50 text-blue-600",

        success:
            "bg-emerald-50 text-emerald-600",

        danger:
            "bg-red-50 text-red-600",
    };

    return (
        <div className="rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                        {label}
                    </p>

                    <p className="mt-2 font-montserrat text-3xl font-extrabold text-[#172033]">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[tone]}`}
                >
                    <span className="material-symbols-outlined">
                        {icon}
                    </span>
                </div>

            </div>
        </div>
    );
}




function FilterSelect({
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div>

            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#98A2B3]">
                {label}
            </label>

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#475467] outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

        </div>
    );
}




function TableHeader({
    children,
    align = "left",
}) {
    return (
        <th
            className={`px-5 py-4 text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3] ${
                align === "right"
                    ? "text-right"
                    : "text-left"
            }`}
        >
            {children}
        </th>
    );
}




function MobileInfo({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div>

            <div className="flex items-center gap-1.5">

                <Icon className="h-3 w-3 text-[#98A2B3]" />

                <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                    {label}
                </p>

            </div>

            <p className="mt-1 truncate text-xs font-bold text-[#475467]">
                {value}
            </p>

        </div>
    );
}




function LoadingState() {
    return (
        <div className="space-y-4 p-6">

            {Array.from(
                { length: 6 },
                (_, index) => (
                    <div
                        key={index}
                        className="animate-pulse"
                    >
                        <div className="h-16 rounded-xl bg-[#F3F1FA]" />
                    </div>
                )
            )}

        </div>
    );
}



function EmptyState({
    hasFilters,
    onClear,
}) {
    return (
        <div className="p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6D4AFF]">
                <Flag className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#172033]">
                No reports found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
                {hasFilters
                    ? "No reports match your current search and filters."
                    : "There are currently no moderation reports."}
            </p>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] hover:border-[#6D4AFF]"
                >
                    <X className="h-4 w-4" />
                    Clear filters
                </button>
            )}

        </div>
    );
}