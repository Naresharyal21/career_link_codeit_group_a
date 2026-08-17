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
                "REPORT DETAIL RESPONSE:",
                data
            );

            setReport(data);
        } catch (err) {
            console.error(
                "Failed to load report:",
                err
            );

            setReport(null);

            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load report."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [id]);


    const getStatus = () => {
        return (
            report?.status ||
            report?.report_status ||
            "Pending"
        );
    };

    const getReason = () => {
        return (
            report?.report_reason ||
            report?.reason ||
            "No reason provided"
        );
    };

    const getDescription = () => {
        return (
            report?.report_description ||
            report?.description ||
            "No description provided."
        );
    };

    const getReportedBy = () => {
        return (
            report?.reported_by ||
            report?.reporter ||
            "Unknown"
        );
    };

    const getReportedJob = () => {
        return (
            report?.reported_job ||
            report?.job_id ||
            report?.job?.id ||
            null
        );
    };

    const getSubmittedDate = () => {
        return (
            report?.reported_at ||
            report?.created_at ||
            report?.created ||
            null
        );
    };

    const getReviewedBy = () => {
        return (
            report?.reviewed_by ||
            report?.moderated_by ||
            "Not reviewed"
        );
    };

    const getRiskLevel = () => {
        const reason =
            String(getReason()).toLowerCase();

        if (
            reason.includes("scam") ||
            reason.includes("fake") ||
            reason.includes("fraud")
        ) {
            return "High";
        }

        if (
            reason.includes("misleading") ||
            reason.includes("spam") ||
            reason.includes("salary")
        ) {
            return "Medium";
        }

        return "Low";
    };

    const formatDate = (value) => {
        if (!value) {
            return "N/A";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "N/A";
        }

        return date.toLocaleString();
    };

    const handleStartReview = async () => {
        try {
            setActionLoading(true);
            setActionError("");

            await moderatorApi.startReview(id);

            await loadReport();
        } catch (err) {
            console.error(
                "Failed to start review:",
                err
            );

            setActionError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
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
            setActionError("");

            await moderatorApi.resolveReport(id);

            await loadReport();
        } catch (err) {
            console.error(
                "Failed to resolve report:",
                err
            );

            setActionError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
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
            setActionError("");

            await moderatorApi.rejectReport(id);

            setShowRejectModal(false);

            await loadReport();
        } catch (err) {
            console.error(
                "Failed to reject report:",
                err
            );

            setActionError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to reject report."
            );
        } finally {
            setActionLoading(false);
        }
    };



    const renderStatusActions = () => {
        const status =
            String(getStatus()).toLowerCase();

        if (status === "pending") {
            return (
                <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-[#5636D9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        rate_review
                    </span>

                    {actionLoading
                        ? "Processing..."
                        : "Start Review"}
                </button>
            );
        }

        if (
            status === "under review" ||
            status === "in review"
        ) {
            return (
                <div className="space-y-3">

                    <button
                        type="button"
                        onClick={handleResolve}
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            check_circle
                        </span>

                        {actionLoading
                            ? "Processing..."
                            : "Resolve Report"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setShowRejectModal(true)
                        }
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-700 transition duration-200 hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            close
                        </span>

                        Reject Report
                    </button>

                </div>
            );
        }

        return (
            <div className="rounded-xl border border-[#E7E3F2] bg-[#FAF9FF] p-4">

                <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#6D4AFF]">
                        <span className="material-symbols-outlined text-[19px]">
                            check_circle
                        </span>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-[#172033]">
                            Report processed
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                            No further moderation action
                            is required for this report.
                        </p>
                    </div>

                </div>

            </div>
        );
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9FF] text-[#172033]">

                <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">

                    <div className="mb-6 h-10 w-32 animate-pulse rounded-xl bg-[#F3F0FF]" />

                    <div className="rounded-2xl border border-[#E7E3F2] bg-white p-8 shadow-sm md:p-12">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6D4AFF]">
                            <span className="material-symbols-outlined animate-spin text-3xl">
                                progress_activity
                            </span>
                        </div>

                        <p className="mt-5 text-center text-sm font-semibold text-[#667085]">
                            Loading report...
                        </p>

                    </div>

                </div>

            </div>
        );
    }



    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#FAF9FF] text-[#172033]">

                <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/moderator/reports"
                            )
                        }
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition hover:border-[#6D4AFF] hover:bg-[#F3F0FF]"
                    >
                        <span className="material-symbols-outlined text-[19px]">
                            arrow_back
                        </span>

                        Back to Reports
                    </button>

                    <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm md:p-10">

                        <div className="flex flex-col items-start gap-4 sm:flex-row">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <span className="material-symbols-outlined text-2xl">
                                    error
                                </span>
                            </div>

                            <div>

                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                                    Moderation Error
                                </p>

                                <h1 className="mt-1 font-['Montserrat'] text-2xl font-bold text-[#172033]">
                                    Unable to load report
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                                    {error ||
                                        "Report not found."}
                                </p>

                                <button
                                    type="button"
                                    onClick={loadReport}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5636D9]"
                                >
                                    <span className="material-symbols-outlined text-[19px]">
                                        refresh
                                    </span>

                                    Try Again
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    const status = getStatus();
    const risk = getRiskLevel();
    const reportedJob = getReportedJob();


    return (
        <div className="min-h-screen bg-[#FAF9FF] text-[#172033]">

            <div className="mx-auto max-w-[1440px] px-4 py-7 md:px-8 lg:px-12">



                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/moderator/reports"
                            )
                        }
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition duration-200 hover:border-[#6D4AFF] hover:bg-[#F3F0FF]"
                    >
                        <span className="material-symbols-outlined text-[19px]">
                            arrow_back
                        </span>

                        Back to Reports
                    </button>

                    <button
                        type="button"
                        onClick={loadReport}
                        disabled={loading}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#667085] shadow-sm transition duration-200 hover:border-[#6D4AFF] hover:bg-[#F3F0FF] hover:text-[#6D4AFF] disabled:opacity-50"
                    >
                        <span
                            className={`material-symbols-outlined text-[19px] ${
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        >
                            refresh
                        </span>

                        Refresh
                    </button>

                </div>



                <section className="mb-7 overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                    <div className="p-6 md:p-8">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex min-w-0 items-start gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6D4AFF]">
                                    <span className="material-symbols-outlined text-2xl">
                                        flag
                                    </span>
                                </div>

                                <div className="min-w-0">

                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D4AFF]">
                                        Moderation Report
                                    </p>

                                    <h1 className="mt-1 font-['Montserrat'] text-2xl font-bold tracking-tight text-[#172033] md:text-3xl">
                                        Report {report.id}
                                    </h1>

                                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                                        Review the submitted
                                        report and determine
                                        the appropriate
                                        moderation action.
                                    </p>

                                </div>

                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                                <ReportStatusBadge
                                    status={status}
                                />

                                <RiskBadge
                                    risk={risk}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="grid border-t border-[#E7E3F2] bg-[#FCFBFF] sm:grid-cols-3">

                        <HeaderStat
                            icon="person"
                            label="Reported By"
                            value={getReportedBy()}
                        />

                        <HeaderStat
                            icon="work"
                            label="Reported Job"
                            value={
                                reportedJob
                                    ? `Job ${reportedJob}`
                                    : "Unknown"
                            }
                        />

                        <HeaderStat
                            icon="schedule"
                            label="Submitted"
                            value={formatDate(
                                getSubmittedDate()
                            )}
                        />

                    </div>

                </section>


                {actionError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-white p-4 shadow-sm">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                <span className="material-symbols-outlined">
                                    error
                                </span>
                            </div>

                            <div className="min-w-0">

                                <p className="font-bold text-red-800">
                                    Action failed
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[#667085]">
                                    {actionError}
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                

                    <div className="space-y-6">

                        

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            <SectionHeader
                                icon="flag"
                                title="Report Details"
                                description="Information submitted by the reporter."
                            />

                            <div className="p-6 md:p-7">

                                <div className="rounded-xl border border-[#E7E3F2] bg-[#FCFBFF] p-5">

                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                                        Report Reason
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-[#172033]">
                                        {getReason()}
                                    </p>

                                </div>

                                <div className="mt-6">

                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                                        Description
                                    </p>

                                    <div className="mt-3 rounded-xl border border-[#E7E3F2] bg-white p-5">

                                        <p className="whitespace-pre-wrap text-sm leading-7 text-[#42474F]">
                                            {getDescription()}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>


                        <section className="rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            <SectionHeader
                                icon="info"
                                title="Report Information"
                                description="Metadata associated with this moderation report."
                            />

                            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 md:p-7">

                                <InfoItem
                                    icon="tag"
                                    label="Report ID"
                                    value={`${report.id}`}
                                />

                                <InfoItem
                                    icon="flag"
                                    label="Status"
                                    value={
                                        <ReportStatusBadge
                                            status={
                                                status
                                            }
                                        />
                                    }
                                />

                                <InfoItem
                                    icon="person"
                                    label="Reported By"
                                    value={
                                        getReportedBy()
                                    }
                                />

                                <InfoItem
                                    icon="work"
                                    label="Reported Job"
                                    value={
                                        reportedJob
                                            ? `Job ${reportedJob}`
                                            : "Unknown"
                                    }
                                />

                                <InfoItem
                                    icon="schedule"
                                    label="Submitted"
                                    value={formatDate(
                                        getSubmittedDate()
                                    )}
                                />

                                <InfoItem
                                    icon="admin_panel_settings"
                                    label="Reviewed By"
                                    value={getReviewedBy()}
                                />

                            </div>

                        </section>

                    

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            <SectionHeader
                                icon="shield"
                                title="Risk Assessment"
                                description="Current automated risk classification based on the report reason."
                            />

                            <div className="p-6 md:p-7">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="flex items-center gap-4">

                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                                risk ===
                                                "High"
                                                    ? "bg-red-50 text-red-600"
                                                    : risk ===
                                                        "Medium"
                                                      ? "bg-amber-50 text-amber-600"
                                                      : "bg-emerald-50 text-emerald-600"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined">
                                                shield
                                            </span>
                                        </div>

                                        <div>

                                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                                                Risk Level
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-[#172033]">
                                                {risk} Risk
                                            </p>

                                        </div>

                                    </div>

                                    <RiskBadge
                                        risk={risk}
                                    />

                                </div>

                                <div className="mt-5 rounded-xl bg-[#FAF9FF] p-4">

                                    <p className="text-xs leading-5 text-[#667085]">
                                        Risk classification
                                        is based on keywords
                                        in the submitted
                                        report reason. The
                                        moderator should make
                                        the final decision
                                        after reviewing the
                                        complete report.
                                    </p>

                                </div>

                            </div>

                        </section>

                    </div>

                 
                    <aside className="h-fit lg:sticky lg:top-6">

                        <div className="rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            <SectionHeader
                                icon="gavel"
                                title="Moderation Actions"
                                description="Take action on this report."
                            />

                            <div className="p-6">

                                <div className="rounded-xl bg-[#F3F0FF] p-4">

                                    <div className="flex items-start gap-3">

                                        <span className="material-symbols-outlined text-[#6D4AFF]">
                                            tips_and_updates
                                        </span>

                                        <p className="text-xs leading-5 text-[#5D5570]">
                                            Review the report
                                            details carefully
                                            before changing
                                            its status.
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-5">
                                    {renderStatusActions()}
                                </div>

                            </div>

                        </div>

                        

                        <div className="mt-5 rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm">

                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                                Current Status
                            </p>

                            <div className="mt-3 flex items-center justify-between gap-3">

                                <span className="text-sm font-semibold text-[#667085]">
                                    Report status
                                </span>

                                <ReportStatusBadge
                                    status={status}
                                />

                            </div>

                            <div className="my-4 h-px bg-[#E7E3F2]" />

                            <div className="flex items-center justify-between gap-3">

                                <span className="text-sm font-semibold text-[#667085]">
                                    Risk
                                </span>

                                <RiskBadge
                                    risk={risk}
                                />

                            </div>

                        </div>

                    </aside>

                </div>

            </div>


            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">

                    <div
                        className="w-full max-w-md rounded-2xl border border-[#E7E3F2] bg-white shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <span className="material-symbols-outlined text-2xl">
                                        warning
                                    </span>
                                </div>

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-red-600">
                                        Moderation Action
                                    </p>

                                    <h2 className="mt-1 font-['Montserrat'] text-xl font-bold text-[#172033]">
                                        Reject Report?
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                                        Are you sure you want
                                        to reject this report?
                                        The report status will
                                        be updated immediately.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 rounded-xl bg-[#FAF9FF] p-4">

                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                                    Report
                                </p>

                                <p className="mt-1 font-bold text-[#172033]">
                                    Report {report.id}
                                </p>

                                <p className="mt-1 text-sm text-[#667085]">
                                    {getReason()}
                                </p>

                            </div>

                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-[#E7E3F2] bg-[#FCFBFF] p-5 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRejectModal(
                                        false
                                    )
                                }
                                disabled={actionLoading}
                                className="rounded-xl border border-[#E7E3F2] bg-white px-5 py-3 text-sm font-bold text-[#667085] transition hover:bg-[#F8F7FC] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    close
                                </span>

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


function SectionHeader({
    icon,
    title,
    description,
}) {
    return (
        <div className="border-b border-[#E7E3F2] px-6 py-5 md:px-7">

            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">
                    <span className="material-symbols-outlined">
                        {icon}
                    </span>
                </div>

                <div>

                    <h2 className="font-['Montserrat'] text-lg font-bold text-[#172033]">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-0.5 text-xs text-[#98A2B3]">
                            {description}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}



function HeaderStat({
    icon,
    label,
    value,
}) {
    return (
        <div className="border-b border-[#E7E3F2] px-6 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">

            <div className="flex items-center gap-3">

                <span className="material-symbols-outlined text-[19px] text-[#6D4AFF]">
                    {icon}
                </span>

                <div className="min-w-0">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                        {label}
                    </p>

                    <p className="mt-0.5 truncate text-sm font-bold text-[#172033]">
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
}



function InfoItem({
    icon,
    label,
    value,
}) {
    return (
        <div className="min-w-0">

            <div className="flex items-center gap-2">

                <span className="material-symbols-outlined text-[17px] text-[#6D4AFF]">
                    {icon}
                </span>

                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                    {label}
                </p>

            </div>

            <div className="mt-2 break-words text-sm font-semibold text-[#172033]">
                {value}
            </div>

        </div>
    );
}


function RiskBadge({
    risk,
}) {
    const styles = {
        High: "bg-red-50 text-red-700 ring-red-100",
        Medium: "bg-amber-50 text-amber-700 ring-amber-100",
        Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${
                styles[risk] ||
                "bg-slate-50 text-slate-700 ring-slate-100"
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {risk || "Low"} Risk
        </span>
    );
}