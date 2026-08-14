import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] =
        useState(false);

    const [actionError, setActionError] =
        useState("");

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const loadReport = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await moderatorApi.getReport(id);

            console.log(
                "REPORT DETAIL DATA:",
                data
            );

            setReport(data);
        } catch (err) {
            console.error(
                "Failed to load report:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to load report."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadReport();
        }
    }, [id]);

    /*
     * ---------------------------------------------------------
     * MODERATION ACTIONS
     * ---------------------------------------------------------
     */

    const handleStartReview = async () => {
        try {
            setActionLoading(true);

            await moderatorApi.startReview(id);

            await loadReport();
        } catch (err) {
            console.error(
                "Failed to start review:",
                err
            );

            alert(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to start review."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleResolve = async () => {
        try {
            setActionLoading(true);

            await moderatorApi.resolveReport(id);

            await loadReport();
        } catch (err) {
            console.error(
                "Failed to resolve report:",
                err
            );

            alert(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to resolve report."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setActionLoading(true);

            await moderatorApi.rejectReport(id);

            setShowRejectModal(false);

            await loadReport();
        } catch (err) {
            console.error(
                "Failed to reject report:",
                err
            );

            alert(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to reject report."
            );
        } finally {
            setActionLoading(false);
        }
    };
    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9ff] px-4 py-10">
                <div className="mx-auto max-w-[1100px] rounded-xl border border-[#c2c7d1] bg-white p-16 text-center shadow-sm">
                    <span className="material-symbols-outlined animate-spin text-4xl text-[#00355f]">
                        progress_activity
                    </span>

                    <p className="mt-3 text-sm text-[#727780]">
                        Loading report...
                    </p>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * ERROR
     * ---------------------------------------------------------
     */

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f9ff] px-4 py-10">
                <div className="mx-auto max-w-[1100px] rounded-xl border border-[#ffdad6] bg-white p-10 text-center shadow-sm">
                    <span className="material-symbols-outlined text-5xl text-[#ba1a1a]">
                        error
                    </span>

                    <h2 className="mt-4 font-['Montserrat'] text-xl font-bold text-[#00355f]">
                        Unable to load report
                    </h2>

                    <p className="mt-2 text-sm text-[#727780]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={loadReport}
                            className="rounded-lg bg-[#00355f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f4c81]"
                        >
                            Try Again
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/moderator/reports"
                                )
                            }
                            className="rounded-lg border border-[#c2c7d1] bg-white px-5 py-3 text-sm font-semibold text-[#00355f] hover:bg-[#eff4ff]"
                        >
                            Back to Reports
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * NOT FOUND
     * ---------------------------------------------------------
     */

    if (!report) {
        return (
            <div className="min-h-screen bg-[#f8f9ff] px-4 py-10">
                <div className="mx-auto max-w-[1100px] rounded-xl border border-[#c2c7d1] bg-white p-10 text-center shadow-sm">
                    <span className="material-symbols-outlined text-5xl text-[#727780]">
                        flag
                    </span>

                    <p className="mt-4 text-[#727780]">
                        Report not found.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/moderator/reports"
                            )
                        }
                        className="mt-5 rounded-lg bg-[#00355f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f4c81]"
                    >
                        Back to Reports
                    </button>
                </div>
            </div>
        );
    }

    const currentStatus =
        String(
            report.status || "Pending"
        ).toLowerCase();

    const isPending =
        currentStatus === "pending";

    const isUnderReview =
        currentStatus === "under review" ||
        currentStatus === "in review";

    const isResolved =
        currentStatus === "resolved";

    const isRejected =
        currentStatus === "rejected";

    const isClosed =
        isResolved || isRejected;

    return (
        <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2f]">
            <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-8">

                {/* ------------------------------------------------
                    BACK
                ------------------------------------------------ */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/moderator/reports"
                        )
                    }
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#00355f] hover:text-[#b7102a]"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        arrow_back
                    </span>

                    Back to Reports
                </button>

                {/* ------------------------------------------------
                    HEADER
                ------------------------------------------------ */}

                <div className="mb-6 rounded-xl border border-[#c2c7d1] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#d2e4ff] text-[#00355f]">
                                    <span className="material-symbols-outlined">
                                        flag
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-[#b7102a]">
                                        Moderation Report
                                    </p>

                                    <h1 className="mt-1 font-['Montserrat'] text-3xl font-bold text-[#00355f]">
                                        Report {report.id}
                                    </h1>
                                </div>
                            </div>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#727780]">
                                Review the submitted report
                                and take appropriate
                                moderation action.
                            </p>
                        </div>

                        <ReportStatusBadge
                            status={
                                report.status ||
                                "Pending"
                            }
                        />
                    </div>
                </div>

                {/* ------------------------------------------------
                    ACTION ERROR
                ------------------------------------------------ */}

                {actionError && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#ffdad6] bg-[#fff7f7] p-4">
                        <span className="material-symbols-outlined text-[#ba1a1a]">
                            error
                        </span>

                        <div>
                            <p className="font-semibold text-[#93000a]">
                                Action failed
                            </p>

                            <p className="mt-1 text-sm text-[#42474f]">
                                {actionError}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setActionError("")
                                }
                                className="mt-2 text-sm font-semibold text-[#00355f] underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------
                    MAIN CONTENT
                ------------------------------------------------ */}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* --------------------------------------------
                        REPORT INFORMATION
                    -------------------------------------------- */}

                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-[#c2c7d1] bg-white shadow-sm">

                            <div className="border-b border-[#c2c7d1] px-6 py-5">
                                <h2 className="font-['Montserrat'] text-lg font-bold text-[#00355f]">
                                    Report Information
                                </h2>
                            </div>

                            <div className="space-y-6 p-6">

                                {/* Reason */}

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#727780]">
                                        Reason
                                    </p>

                                    <p className="mt-2 text-base font-semibold text-[#0d1c2f]">
                                        {report.report_reason ||
                                            "No reason provided"}
                                    </p>
                                </div>

                                {/* Description */}

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#727780]">
                                        Description
                                    </p>

                                    <div className="mt-2 rounded-lg bg-[#f8f9ff] p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-[#42474f]">
                                            {report.report_description ||
                                                "No description provided."}
                                        </p>
                                    </div>
                                </div>

                                {/* Details */}

                                <div className="grid gap-5 border-t border-[#e2e4e9] pt-6 sm:grid-cols-2">

                                    <InfoItem
                                        label="Report ID"
                                        value={
                                            report.id
                                        }
                                    />

                                    <InfoItem
                                        label="Job ID"
                                        value={
                                            report.reported_job
                                                ? `Job #${report.reported_job}`
                                                : "Unknown"
                                        }
                                    />

                                    <InfoItem
                                        label="Reported By"
                                        value={
                                            report.reported_by ||
                                            "Unknown"
                                        }
                                    />

                                    <InfoItem
                                        label="Submitted"
                                        value={
                                            report.reported_at
                                                ? new Date(
                                                      report.reported_at
                                                  ).toLocaleString()
                                                : "N/A"
                                        }
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* --------------------------------------------
                        REVIEW SIDEBAR
                    -------------------------------------------- */}

                    <div>
                        <div className="rounded-xl border border-[#c2c7d1] bg-white shadow-sm">

                            <div className="border-b border-[#c2c7d1] px-6 py-5">
                                <h2 className="font-['Montserrat'] text-lg font-bold text-[#00355f]">
                                    Review
                                </h2>
                            </div>

                            <div className="space-y-5 p-6">

                                {/* Status */}

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#727780]">
                                        Current Status
                                    </p>

                                    <div className="mt-2">
                                        <ReportStatusBadge
                                            status={
                                                report.status ||
                                                "Pending"
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Reviewed By */}

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#727780]">
                                        Reviewed By
                                    </p>

                                    <p className="mt-1 font-semibold text-[#00355f]">
                                        {report.reviewed_by ||
                                            "Not reviewed"}
                                    </p>
                                </div>

                                {/* Reviewed At */}

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#727780]">
                                        Reviewed At
                                    </p>

                                    <p className="mt-1 text-sm text-[#42474f]">
                                        {report.reviewed_at
                                            ? new Date(
                                                  report.reviewed_at
                                              ).toLocaleString()
                                            : "Not reviewed"}
                                    </p>
                                </div>

                                {/* Divider */}

                                <div className="border-t border-[#e2e4e9] pt-5">

                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#727780]">
                                        Moderation Actions
                                    </p>

                                    {/* Start Review */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleStartReview
                                        }
                                        disabled={
                                            actionLoading ||
                                            !isPending
                                        }
                                        className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#00355f] bg-white px-4 py-3 text-sm font-semibold text-[#00355f] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <span className="material-symbols-outlined text-[19px]">
                                            rate_review
                                        </span>

                                        {actionLoading &&
                                        isPending
                                            ? "Starting..."
                                            : "Start Review"}
                                    </button>

                                    {/* Resolve */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleResolve
                                        }
                                        disabled={
                                            actionLoading ||
                                            isClosed
                                        }
                                        className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#16803c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#126b32] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <span className="material-symbols-outlined text-[19px]">
                                            check_circle
                                        </span>

                                        {actionLoading
                                            ? "Processing..."
                                            : "Resolve Report"}
                                    </button>

                                    {/* Reject */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowRejectModal(
                                                true
                                            )
                                        }
                                        disabled={
                                            actionLoading ||
                                            isClosed
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b7102a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#93001d] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <span className="material-symbols-outlined text-[19px]">
                                            cancel
                                        </span>

                                        Reject Report
                                    </button>
                                </div>

                                {/* Status information */}

                                {isPending && (
                                    <div className="rounded-lg border border-[#ffe08a] bg-[#fff9e6] p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[#8a5a00]">
                                                schedule
                                            </span>

                                            <p className="text-xs leading-5 text-[#6b4a00]">
                                                This report is
                                                waiting for
                                                moderator
                                                review.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isUnderReview && (
                                    <div className="rounded-lg border border-[#b8d7ff] bg-[#eff6ff] p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[#00355f]">
                                                rate_review
                                            </span>

                                            <p className="text-xs leading-5 text-[#00355f]">
                                                This report is
                                                currently under
                                                moderator review.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isResolved && (
                                    <div className="rounded-lg border border-[#b7e4c7] bg-[#effaf2] p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[#16803c]">
                                                check_circle
                                            </span>

                                            <p className="text-xs leading-5 text-[#126b32]">
                                                This report has
                                                been resolved.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isRejected && (
                                    <div className="rounded-lg border border-[#ffd0d0] bg-[#fff5f5] p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[#b7102a]">
                                                cancel
                                            </span>

                                            <p className="text-xs leading-5 text-[#93001d]">
                                                This report has
                                                been rejected.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ----------------------------------------------------
                REJECT CONFIRMATION MODAL
            ---------------------------------------------------- */}

            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1c2f]/50 px-4">
                    <div className="w-full max-w-md rounded-xl border border-[#c2c7d1] bg-white p-6 shadow-2xl">

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#b7102a]">
                                    <span className="material-symbols-outlined">
                                        warning
                                    </span>
                                </div>

                                <div>
                                    <h2 className="font-['Montserrat'] text-lg font-bold text-[#00355f]">
                                        Reject Report?
                                    </h2>

                                    <p className="mt-1 text-sm text-[#727780]">
                                        This action will mark
                                        report {report.id} as
                                        rejected.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRejectModal(
                                        false
                                    )
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-lg p-2 text-[#727780] hover:bg-[#eff4ff]"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        <div className="mt-6 rounded-lg bg-[#f8f9ff] p-4">
                            <p className="text-sm leading-6 text-[#42474f]">
                                Only reject the report if it
                                does not meet the requirements
                                for a valid moderation report.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRejectModal(
                                        false
                                    )
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-lg border border-[#c2c7d1] bg-white px-5 py-3 text-sm font-semibold text-[#00355f] hover:bg-[#eff4ff] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleReject
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-lg bg-[#b7102a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#93001d] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {actionLoading
                                    ? "Rejecting..."
                                    : "Yes, Reject Report"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/*
 * =========================================================
 * INFO ITEM
 * =========================================================
 */

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#727780]">
                {label}
            </p>

            <p className="mt-1 font-semibold text-[#00355f]">
                {value || "N/A"}
            </p>
        </div>
    );
}