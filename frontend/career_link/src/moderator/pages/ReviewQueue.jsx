import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Flag,
    Gavel,
    RefreshCw,
    ShieldAlert,
    UserRound,
    XCircle,
} from "lucide-react";

import moderatorApi from "../../apis/moderatorApi";
import accountsApi from "../../apis/accountsApi";
import ReportStatusBadge from "../components/ReportStatusBadge";
import ModeratorSectionPage from "../components/ModeratorSectionPage";

import { formatReportId } from "../utils/report";




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


function getJobTitle(report) {
    if (
        typeof report?.reported_job === "object" &&
        report?.reported_job !== null
    ) {
        return (
            report.reported_job.title ||
            `Job ${report.reported_job.id}`
        );
    }

    return (
        report?.reported_job_title ||
        report?.job?.title ||
        "Unknown job"
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


// Mirrors the priority derivation used on the full Reports list,
// so a report shows the same priority everywhere in the app.
function getPriority(report) {
    if (report?.priority) {
        return report.priority;
    }

    const reason = String(getReason(report)).toLowerCase();

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


const PAGE_SIZE = 10;

// The queue only ever cares about reports still awaiting action.
const QUEUE_STATUSES = "Pending,Under Review";




export default function ReviewQueue() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentUser, setCurrentUser] = useState(null);

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    // Per-report id -> which quick action is in flight, so only
    // that row's buttons show a loading state.
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [actionError, setActionError] = useState("");


    const isAdmin =
        currentUser?.is_staff === true ||
        currentUser?.is_superuser === true;


    const loadCurrentUser = async () => {
        try {
            const data = await accountsApi.getMe();
            setCurrentUser(data);
        } catch (err) {
            console.error(
                "Failed to load current user:",
                err
            );
        }
    };


    const loadQueue = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError("");

            const response = await moderatorApi.getReports({
                status: QUEUE_STATUSES,
                page: pageNumber,
                page_size: PAGE_SIZE,
            });

            console.log("REVIEW QUEUE RESPONSE:", response);

            if (Array.isArray(response)) {
                setReports(response);
                setTotalCount(null);
                setHasNext(false);
                setHasPrevious(false);
            } else {
                setReports(
                    Array.isArray(response?.results)
                        ? response.results
                        : []
                );
                setTotalCount(
                    typeof response?.count === "number"
                        ? response.count
                        : null
                );
                setHasNext(Boolean(response?.next));
                setHasPrevious(Boolean(response?.previous));
            }
        } catch (err) {
            console.error("Failed to load review queue:", err);

            setReports([]);
            setTotalCount(null);
            setHasNext(false);
            setHasPrevious(false);

            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load the review queue."
            );
        } finally {
            setLoading(false);
        }
    };


    const refresh = () => loadQueue(page);


    useEffect(() => {
        loadCurrentUser();
    }, []);


    useEffect(() => {
        loadQueue(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);


    const totalPages =
        totalCount !== null
            ? Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
            : 1;

    const currentPage = Math.min(page, totalPages);


    const runAction = async (report, action) => {
        setActionError("");
        setActionLoadingId(report.id);

        try {
            if (action === "review") {
                await moderatorApi.startReview(report.id);
            } else if (action === "resolve") {
                await moderatorApi.resolveReport(report.id);
            } else if (action === "reject") {
                await moderatorApi.rejectReport(report.id);
            }

            // The report likely no longer belongs in the queue
            // (Under Review or resolved/rejected out of it), so
            // reload the current page from the server rather than
            // patch it locally.
            await loadQueue(page);
        } catch (err) {
            console.error(
                `Failed to ${action} report ${report.id}:`,
                err
            );

            setActionError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "That action couldn't be completed."
            );
        } finally {
            setActionLoadingId(null);
        }
    };


    return (
        <ModeratorSectionPage
            eyebrow="Moderation"
            title="Review Queue"
            description="Reports that are still Pending or Under Review, oldest first."
            backLabel="Back to dashboard"
            backTo="/reports/"
            action={
                <button
                    type="button"
                    onClick={refresh}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            }
        >

            {!isAdmin && currentUser && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                        You can view the queue, but only an admin
                        can start review, resolve, or reject a
                        report.
                    </p>
                </div>
            )}

            {actionError && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{actionError}</p>
                </div>
            )}

            {loading ? (
                <div className="rounded-2xl border border-[#E7E3F2] bg-white p-10 text-center text-sm text-[#98A2B3]">
                    Loading the review queue…
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
                    <p className="text-sm font-semibold text-red-700">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={refresh}
                        className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
                    >
                        Try again
                    </button>
                </div>
            ) : reports.length === 0 ? (
                <div className="rounded-2xl border border-[#E7E3F2] bg-white p-10 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                    <p className="mt-3 text-sm font-semibold text-[#344054]">
                        Nothing waiting on this page.
                    </p>
                    <p className="mt-1 text-xs text-[#98A2B3]">
                        All caught up — no Pending or Under
                        Review reports here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => {
                        const priority = getPriority(report);
                        const status = getStatus(report);
                        const busy =
                            actionLoadingId === report.id;

                        return (
                            <div
                                key={report.id}
                                className="rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-[#98A2B3]">
                                                {formatReportId(
                                                    report.id
                                                )}
                                            </span>

                                            <ReportStatusBadge
                                                status={status}
                                            />

                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityStyle(
                                                    priority
                                                )}`}
                                            >
                                                <Flag className="mr-1 h-3 w-3" />
                                                {priority}
                                            </span>
                                        </div>

                                        <h3 className="mt-2 truncate text-sm font-extrabold text-[#172337]">
                                            {getJobTitle(report)}
                                        </h3>

                                        <p className="mt-1 text-sm text-[#667085]">
                                            {getReason(report)}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#98A2B3]">
                                            <span className="inline-flex items-center gap-1">
                                                <UserRound className="h-3.5 w-3.5" />
                                                {getReportedBy(
                                                    report
                                                )}
                                            </span>

                                            <span className="inline-flex items-center gap-1">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {formatDate(
                                                    report.reported_at ||
                                                        report.created_at
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/reports/${report.id}/`
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </button>

                                        {isAdmin &&
                                            status === "Pending" && (
                                                <button
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() =>
                                                        runAction(
                                                            report,
                                                            "review"
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#6D4AFF] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#5A3AE0] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Clock3 className="h-3.5 w-3.5" />
                                                    Start Review
                                                </button>
                                            )}

                                        {isAdmin &&
                                            status ===
                                                "Under Review" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            busy
                                                        }
                                                        onClick={() =>
                                                            runAction(
                                                                report,
                                                                "resolve"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Gavel className="h-3.5 w-3.5" />
                                                        Resolve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            busy
                                                        }
                                                        onClick={() =>
                                                            runAction(
                                                                report,
                                                                "reject"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading &&
                (reports.length > 0 || totalPages > 1) && (
                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-xs font-semibold text-[#98A2B3]">
                            Page {currentPage} of {totalPages}
                            {totalCount !== null &&
                                ` — ${totalCount} in queue`}
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    !hasPrevious &&
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setPage((current) =>
                                        Math.max(1, current - 1)
                                    )
                                }
                                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !hasNext &&
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setPage((current) =>
                                        Math.min(
                                            totalPages,
                                            current + 1
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