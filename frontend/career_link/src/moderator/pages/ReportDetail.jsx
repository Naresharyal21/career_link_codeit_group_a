import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Flag,
    Gavel,
    RefreshCw,
    ShieldAlert,
    UserRound,
    X,
    XCircle,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";
import ModeratorSectionPage from "../components/ModeratorSectionPage";




function formatReportId(id) {
    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return "R--";
    }

    return `R${String(id).padStart(3, "0")}`;
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


function formatDateTime(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}


function getInitials(value) {
    if (!value) {
        return "U";
    }

    return String(value)
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}




export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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
        if (id) {
            loadReport();
        }
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
    };


    const getReportedJob = () => {
        if (
            typeof report?.reported_job === "object" &&
            report?.reported_job !== null
        ) {
            return (
                report.reported_job.id ||
                null
            );
        }

        return (
            report?.reported_job ||
            report?.job_id ||
            report?.job?.id ||
            null
        );
    };


    const getReportedJobTitle = () => {
        if (
            typeof report?.reported_job === "object" &&
            report?.reported_job !== null
        ) {
            return (
                report.reported_job.title ||
                null
            );
        }

        return (
            report?.reported_job_title ||
            report?.job?.title ||
            null
        );
    };


    const getReviewedBy = () => {
        if (
            typeof report?.reviewed_by === "object" &&
            report?.reviewed_by !== null
        ) {
            return (
                report.reviewed_by.username ||
                report.reviewed_by.email ||
                "Moderator"
            );
        }

        return (
            report?.reviewed_by_name ||
            report?.reviewed_by ||
            "Not reviewed"
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


    const getReviewedDate = () => {
        return (
            report?.reviewed_at ||
            report?.reviewed_on ||
            null
        );
    };




    const getRiskLevel = () => {
        const reason =
            String(getReason()).toLowerCase();

        if (
            reason.includes("scam") ||
            reason.includes("fake") ||
            reason.includes("fraud") ||
            reason.includes("phishing") ||
            reason.includes("harassment") ||
            reason.includes("abuse")
        ) {
            return "High";
        }

        if (
            reason.includes("spam") ||
            reason.includes("misleading") ||
            reason.includes("duplicate") ||
            reason.includes("inappropriate")
        ) {
            return "Medium";
        }

        return "Low";
    };


    const risk = useMemo(
        () => getRiskLevel(),
        [report]
    );




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




    const status = String(getStatus())
        .toLowerCase()
        .trim();

    const isClosed =
        status === "resolved" ||
        status === "rejected";



    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FF]">
                <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">

                    <div className="animate-pulse">

                        <div className="mb-6 h-10 w-40 rounded-xl bg-[#EDE8FF]" />

                        <div className="h-28 rounded-2xl bg-white" />

                        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                            <div className="h-[500px] rounded-2xl bg-white" />

                            <div className="h-[350px] rounded-2xl bg-white" />
                        </div>

                    </div>
                </div>
            </div>
        );
    }




    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#F8F9FF]">
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
                        <ArrowLeft className="h-4 w-4" />
                        Back to Reports
                    </button>

                    <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <AlertCircle className="h-7 w-7" />
                        </div>

                        <h2 className="mt-5 text-lg font-extrabold text-[#172033]">
                            Unable to load report
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667085]">
                            {error ||
                                "The requested report could not be found."}
                        </p>

                        <button
                            type="button"
                            onClick={loadReport}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5B21B6]"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>

                    </div>
                </div>
            </div>
        );
    }



    return (
        <ModeratorSectionPage
            title={`Report ${formatReportId(
                report.id
            )}`}
            description="Review the submitted report, investigate the reported content, and take the appropriate moderation action."
            backLabel="Reports"
            backTo="/moderator/reports"
        >



            <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                <div className="p-6 md:p-7">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex min-w-0 items-start gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6D4AFF]">
                                <Flag className="h-6 w-6" />
                            </div>

                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                    <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#6D4AFF]">
                                        Moderation Report
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-[#C4BDD8]" />

                                    <span className="text-xs font-bold text-[#98A2B3]">
                                        {formatReportId(
                                            report.id
                                        )}
                                    </span>

                                </div>

                                <h1 className="mt-1 font-['Montserrat'] text-2xl font-bold tracking-tight text-[#172033] md:text-3xl">
                                    Report{" "}
                                    {formatReportId(
                                        report.id
                                    )}
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                                    Review the submitted report
                                    and determine the
                                    appropriate moderation
                                    action.
                                </p>

                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                            <div className="rounded-xl border border-[#E7E3F2] bg-[#FBFAFE] px-4 py-3">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                                    Risk
                                </p>

                                <p
                                    className={`mt-1 text-sm font-extrabold ${
                                        risk === "High"
                                            ? "text-red-600"
                                            : risk === "Medium"
                                            ? "text-amber-600"
                                            : "text-emerald-600"
                                    }`}
                                >
                                    {risk}
                                </p>
                            </div>

                            <ReportStatusBadge
                                status={
                                    getStatus()
                                }
                            />

                        </div>

                    </div>

                </div>
            </div>



            {actionError && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <div className="min-w-0">

                        <p className="text-sm font-extrabold text-red-700">
                            Moderation action failed
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-600">
                            {actionError}
                        </p>

                    </div>

                </div>
            )}



            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">



                <div className="space-y-6">

             

                    <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                        <SectionHeading
                            icon={Flag}
                            title="Report Details"
                            description="Information submitted by the reporter."
                        />

                        <div className="mt-7 space-y-6">

                            <div>
                                <Label>
                                    Reason
                                </Label>

                                <div className="mt-2 inline-flex rounded-xl bg-[#F0ECFF] px-4 py-2.5">
                                    <span className="text-sm font-extrabold text-[#6D4AFF]">
                                        {getReason()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Description
                                </Label>

                                <div className="mt-2 rounded-xl border border-[#F0EDF7] bg-[#FBFAFE] p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#475467]">
                                        {getDescription()}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>


         

                    <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                        <SectionHeading
                            icon={ShieldAlert}
                            title="Report Information"
                            description="Metadata associated with this report."
                        />

                        <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                            <InfoItem
                                icon={Flag}
                                label="Report ID"
                                value={formatReportId(
                                    report.id
                                )}
                            />

                            <InfoItem
                                icon={Eye}
                                label="Status"
                                value={
                                    <ReportStatusBadge
                                        status={
                                            getStatus()
                                        }
                                    />
                                }
                            />

                            <InfoItem
                                icon={UserRound}
                                label="Reported By"
                                value={
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0ECFF] text-[10px] font-extrabold text-[#6D4AFF]">
                                            {getInitials(
                                                getReportedBy()
                                            )}
                                        </div>

                                        <span>
                                            {getReportedBy()}
                                        </span>
                                    </div>
                                }
                            />

                            <InfoItem
                                icon={Flag}
                                label="Reported Job"
                                value={
                                    <div>
                                        <p>
                                            {getReportedJobTitle() ||
                                                (getReportedJob()
                                                    ? `Job #${getReportedJob()}`
                                                    : "Unknown job")}
                                        </p>

                                        {getReportedJob() && (
                                            <p className="mt-1 text-xs font-medium text-[#98A2B3]">
                                                Job #
                                                {
                                                    getReportedJob()
                                                }
                                            </p>
                                        )}
                                    </div>
                                }
                            />

                            <InfoItem
                                icon={CalendarDays}
                                label="Submitted"
                                value={formatDateTime(
                                    getSubmittedDate()
                                )}
                            />

                            <InfoItem
                                icon={UserRound}
                                label="Reviewed By"
                                value={getReviewedBy()}
                            />

                            {getReviewedDate() && (
                                <InfoItem
                                    icon={CalendarDays}
                                    label="Reviewed At"
                                    value={formatDateTime(
                                        getReviewedDate()
                                    )}
                                />
                            )}

                        </div>
                    </section>


           

                    <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                        <SectionHeading
                            icon={ShieldAlert}
                            title="Risk Assessment"
                            description="Initial moderation assessment based on the report reason."
                        />

                        <div className="mt-6 rounded-2xl border border-[#E7E3F2] bg-[#FBFAFE] p-5">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                            risk === "High"
                                                ? "bg-red-50 text-red-600"
                                                : risk === "Medium"
                                                ? "bg-amber-50 text-amber-600"
                                                : "bg-emerald-50 text-emerald-600"
                                        }`}
                                    >
                                        <ShieldAlert className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#98A2B3]">
                                            Current Risk Level
                                        </p>

                                        <p
                                            className={`mt-1 text-lg font-extrabold ${
                                                risk === "High"
                                                    ? "text-red-600"
                                                    : risk === "Medium"
                                                    ? "text-amber-600"
                                                    : "text-emerald-600"
                                            }`}
                                        >
                                            {risk}
                                        </p>
                                    </div>

                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-xs leading-5 text-[#98A2B3]">
                                        This is an initial
                                        classification and
                                        should support — not
                                        replace — moderator
                                        judgment.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </section>

                </div>




                <aside className="h-fit lg:sticky lg:top-6">

                    <div className="overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                        <div className="border-b border-[#F0EDF7] p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                    <Gavel className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-base font-extrabold text-[#172033]">
                                        Moderation Actions
                                    </h2>

                                    <p className="mt-1 text-xs text-[#98A2B3]">
                                        Manage report status
                                    </p>
                                </div>

                            </div>

                        </div>


                        <div className="p-6">

                            {!isClosed ? (
                                <div className="space-y-3">

                                    {status ===
                                        "pending" && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleStartReview
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Clock3 className="h-4 w-4" />

                                            {actionLoading
                                                ? "Processing..."
                                                : "Start Review"}
                                        </button>
                                    )}

                                    {status ===
                                        "under review" && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleResolve
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />

                                            {actionLoading
                                                ? "Processing..."
                                                : "Resolve Report"}
                                        </button>
                                    )}

                                    {status ===
                                        "under review" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowRejectModal(
                                                    true
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3.5 text-sm font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject Report
                                        </button>
                                    )}

                                    {status ===
                                        "pending" && (
                                        <p className="rounded-xl bg-[#FBFAFE] p-4 text-xs leading-5 text-[#667085]">
                                            Start the review
                                            before taking a
                                            final moderation
                                            action.
                                        </p>
                                    )}

                                </div>
                            ) : (
                                <div className="rounded-xl border border-[#E7E3F2] bg-[#FBFAFE] p-4">

                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                status ===
                                                "resolved"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {status ===
                                            "resolved" ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-extrabold text-[#172033]">
                                                Report{" "}
                                                {status ===
                                                "resolved"
                                                    ? "resolved"
                                                    : "rejected"}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#667085]">
                                                This report has
                                                been processed
                                                and requires no
                                                further
                                                moderation
                                                action.
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>
                    </div>


                

                    <div className="mt-4 rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm">

                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#98A2B3]">
                            Report Summary
                        </p>

                        <div className="mt-4 space-y-3">

                            <QuickItem
                                label="Report"
                                value={formatReportId(
                                    report.id
                                )}
                            />

                            <QuickItem
                                label="Reason"
                                value={getReason()}
                            />

                            <QuickItem
                                label="Status"
                                value={getStatus()}
                            />

                        </div>

                    </div>

                </aside>

            </div>



            {showRejectModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/45 px-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget &&
                            !actionLoading
                        ) {
                            setShowRejectModal(
                                false
                            );
                        }
                    }}
                >

                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-report-title"
                    >

                        <div className="p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                    <AlertCircle className="h-6 w-6" />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex items-start justify-between gap-3">

                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-600">
                                                Moderation Action
                                            </p>

                                            <h2
                                                id="reject-report-title"
                                                className="mt-1 text-xl font-extrabold text-[#172033]"
                                            >
                                                Reject Report?
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                !actionLoading &&
                                                setShowRejectModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            className="rounded-lg p-1.5 text-[#98A2B3] transition hover:bg-[#F8F9FF] hover:text-[#475467] disabled:opacity-50"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                                        Are you sure you want
                                        to reject this report?
                                        This will mark it as
                                        rejected and close the
                                        moderation workflow.
                                    </p>

                                </div>
                            </div>


                            <div className="mt-5 rounded-xl bg-[#FBFAFE] p-4">

                                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98A2B3]">
                                    Report
                                </p>

                                <p className="mt-1 text-sm font-extrabold text-[#172033]">
                                    {formatReportId(
                                        report.id
                                    )}
                                </p>

                                <p className="mt-2 text-sm font-semibold text-[#475467]">
                                    {getReason()}
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
                                    className="rounded-xl border border-[#E4E7EC] bg-white px-5 py-3 text-sm font-bold text-[#475467] transition hover:bg-[#F8F9FF] disabled:cursor-not-allowed disabled:opacity-50"
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
                                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actionLoading
                                        ? "Rejecting..."
                                        : "Yes, Reject Report"}
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}

        </ModeratorSectionPage>
    );
}




function SectionHeading({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <h2 className="text-base font-extrabold text-[#172033]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-xs text-[#98A2B3]">
                        {description}
                    </p>
                )}
            </div>

        </div>
    );
}


function Label({ children }) {
    return (
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98A2B3]">
            {children}
        </p>
    );
}


function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="min-w-0">

            <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-[#98A2B3]" />

                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98A2B3]">
                    {label}
                </p>
            </div>

            <div className="mt-2 text-sm font-bold text-[#344054]">
                {value}
            </div>

        </div>
    );
}


function QuickItem({
    label,
    value,
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#F0EDF7] pb-3 last:border-0 last:pb-0">

            <span className="text-xs font-semibold text-[#98A2B3]">
                {label}
            </span>

            <span className="max-w-[190px] truncate text-right text-xs font-bold text-[#475467]">
                {value}
            </span>

        </div>
    );
}