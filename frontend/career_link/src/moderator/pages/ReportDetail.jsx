
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
    Pencil,
    RefreshCw,
    Save,
    ShieldAlert,
    UserRound,
    X,
    XCircle,
    BriefcaseBusiness,
    FileText,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import moderatorApi from "../../apis/moderatorApi";
import accountsApi from "../../apis/accountsApi";
import ReportStatusBadge from "../components/ReportStatusBadge";



function formatReportId(id) {
    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return "R---";
    }

    return `R${String(id).padStart(3, "0")}`;
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

    const [currentUser, setCurrentUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [userLoading, setUserLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);

    const [isEditing, setIsEditing] =
        useState(false);

    const [editLoading, setEditLoading] =
        useState(false);

    const [editError, setEditError] =
        useState("");

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [editForm, setEditForm] = useState({
        report_reason: "",
        report_description: "",
    });


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");




    const loadCurrentUser = async () => {
        try {
            setUserLoading(true);

            const data =
                await accountsApi.getMe();

            console.log(
                "Report Detail User:",
                data
            );

            setCurrentUser(data);
        } catch (err) {
            console.error(
                "Failed to load current user:",
                err
            );

            setCurrentUser(null);
        } finally {
            setUserLoading(false);
        }
    };



    const loadReport = async () => {
        if (!id) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data =
                await moderatorApi.getReport(id);

            console.log(
                "REPORT DETAIL:",
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
                    "Unable to load this report."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadCurrentUser();
        loadReport();
    }, [id]);




    const canModerate = useMemo(() => {
        const username = String(
            currentUser?.username || ""
        )
            .trim()
            .toLowerCase();

        const role = String(
            currentUser?.role || ""
        )
            .trim()
            .toLowerCase();

        return (
            username === "moderator" ||
            role === "moderator" ||
            role === "admin" ||
            role === "administrator" ||
            currentUser?.is_staff === true ||
            currentUser?.is_superuser === true
        );
    }, [currentUser]);




    const status = String(
        report?.status ||
            report?.report_status ||
            "Pending"
    )
        .trim()
        .toLowerCase();


    const reason =
        report?.report_reason ||
        report?.reason ||
        "No reason provided";


    const description =
        report?.report_description ||
        report?.description ||
        "No description provided.";


    const reportedBy =
        typeof report?.reported_by === "object" &&
        report?.reported_by !== null
            ? report.reported_by.username ||
              report.reported_by.email ||
              "Unknown user"
            : report?.reported_by_name ||
              report?.reported_by ||
              report?.reporter ||
              "Unknown user";


    const reporterEmail =
        typeof report?.reported_by === "object" &&
        report?.reported_by !== null
            ? report.reported_by.email ||
              "Not available"
            : report?.reported_by_email ||
              "Not available";


    const reportedJobId =
        typeof report?.reported_job === "object" &&
        report?.reported_job !== null
            ? report.reported_job.id
            : report?.reported_job ||
              report?.job_id ||
              report?.job?.id ||
              null;


    const reportedJobTitle =
        typeof report?.reported_job === "object" &&
        report?.reported_job !== null
            ? report.reported_job.title ||
              `Job report.reported_job.id}`
            : report?.reported_job_title ||
              report?.job?.title ||
              (reportedJobId
                  ? `Job ${reportedJobId}`
                  : "Unknown job");


    const companyName =
        typeof report?.reported_job === "object" &&
        report?.reported_job !== null
            ? report.reported_job.company_name ||
              report.reported_job.employer_name ||
              report.reported_job.company?.name ||
              "Employer"
            : report?.company_name ||
              report?.employer_name ||
              "Employer";


    const reviewedBy =
        typeof report?.reviewed_by === "object" &&
        report?.reviewed_by !== null
            ? report.reviewed_by.username ||
              report.reviewed_by.email ||
              "Moderator"
            : report?.reviewed_by_name ||
              report?.reviewed_by ||
              "Not reviewed";


    const submittedAt =
        report?.reported_at ||
        report?.created_at ||
        report?.created ||
        null;


    const reviewedAt =
        report?.reviewed_at ||
        report?.reviewed_on ||
        null;


    const isClosed =
        status === "resolved" ||
        status === "rejected";




    const risk = useMemo(() => {
        const value = String(reason)
            .toLowerCase();

        if (
            value.includes("scam") ||
            value.includes("fake") ||
            value.includes("fraud") ||
            value.includes("phishing") ||
            value.includes("harassment") ||
            value.includes("abuse")
        ) {
            return "High";
        }

        if (
            value.includes("spam") ||
            value.includes("misleading") ||
            value.includes("duplicate") ||
            value.includes("offensive")
        ) {
            return "Medium";
        }

        return "Low";
    }, [reason]);



    const openEdit = () => {
        setEditForm({
            report_reason:
                report?.report_reason || "",
            report_description:
                report?.report_description || "",
        });

        setEditError("");
        setIsEditing(true);
    };


    const cancelEdit = () => {
        setIsEditing(false);
        setEditError("");
    };


    const handleEditChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setEditForm((current) => ({
            ...current,
            [name]: value,
        }));

        setEditError("");
    };


    const saveEdit = async () => {
        if (
            !editForm.report_reason.trim()
        ) {
            setEditError(
                "Please select a report reason."
            );
            return;
        }

        try {
            setEditLoading(true);
            setEditError("");

            await moderatorApi.updateReport(
                id,
                {
                    report_reason:
                        editForm.report_reason,

                    report_description:
                        editForm.report_description.trim(),
                }
            );

            await loadReport();

            setIsEditing(false);
        } catch (err) {
            console.error(
                "Failed to update report:",
                err
            );

            setEditError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to update report."
            );
        } finally {
            setEditLoading(false);
        }
    };



    const startReview = async () => {
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


    const resolveReport = async () => {
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


    const rejectReport = async () => {
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

    const handleDeleteReport = async () => {
        try {
            setDeleteLoading(true);
            setDeleteError("");

            await moderatorApi.deleteReport(id);

            setShowDeleteModal(false);

            navigate("/reports/list/");
        } catch (err) {
            console.error(
                "Failed to delete report:",
                err
            );

            setDeleteError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to delete report."
            );
        } finally {
            setDeleteLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FF]">
                <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 lg:px-10">

                    <div className="animate-pulse space-y-6">

                        <div className="h-8 w-40 rounded-xl bg-[#EDE8FF]" />

                        <div className="h-36 rounded-2xl bg-white" />

                        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                            <div className="h-[620px] rounded-2xl bg-white" />
                            <div className="h-[480px] rounded-2xl bg-white" />
                        </div>

                    </div>
                </div>
            </div>
        );
    }




    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#F8F9FF]">
                <div className="mx-auto max-w-[1200px] px-4 py-10">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/reports/list/"
                            )
                        }
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] shadow-sm transition hover:bg-[#F3F0FF]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Reports
                    </button>

                    <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <AlertCircle className="h-7 w-7" />
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-[#172033]">
                            Unable to load report
                        </h2>

                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
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
        <div className="min-h-screen bg-[#F8F9FF] text-[#172033]">

            <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 lg:px-10">



                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/reports/list/"
                            )
                        }
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] shadow-sm transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Reports
                    </button>

                    <div className="flex flex-wrap items-center gap-3">

                        <button
                            type="button"
                            onClick={loadReport}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] shadow-sm transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />
                            Refresh
                        </button>

                        {!userLoading && canModerate && (
                            <>
                                <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/reports/${report.id}/edit/`
                                            )
                                        }
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#5B21B6] disabled:opacity-50"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Update
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteError("");
                                        setShowDeleteModal(true);
                                    }}
                                    disabled={deleteLoading}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-extrabold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>



                <section className="mb-6 overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                    <div className="p-6 md:p-8">

                        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                            <div className="flex min-w-0 items-start gap-4">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6D4AFF]">
                                    <Flag className="h-7 w-7" />
                                </div>

                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="rounded-full bg-[#F0ECFF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6D4AFF]">
                                            Moderation Report
                                        </span>

                                        <span className="text-xs font-bold text-[#98A2B3]">
                                            #{report.id}
                                        </span>
                                    </div>

                                    <h1 className="mt-3 font-montserrat text-3xl font-extrabold tracking-tight text-[#172033] md:text-4xl">
                                        
                                        Report {formatReportId(report.id)}
                                    </h1>
                                                                
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
                                        Review the submitted report,
                                        investigate the reported
                                        job, and determine the
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
                                        report.status ||
                                        "Pending"
                                    }
                                />

                            </div>
                        </div>
                    </div>



                    <div className="grid border-t border-[#F0EDF7] sm:grid-cols-2 lg:grid-cols-4">

                        <HeaderMeta
                            icon={FileText}
                            label="Report ID"
                            value={formatReportId(
                                report.id
                            )}
                        />

                        <HeaderMeta
                            icon={BriefcaseBusiness}
                            label="Reported Job"
                            value={
                                reportedJobTitle
                            }
                        />

                        <HeaderMeta
                            icon={UserRound}
                            label="Reported By"
                            value={
                                reportedBy
                            }
                        />

                        <HeaderMeta
                            icon={CalendarDays}
                            label="Submitted"
                            value={formatDate(
                                submittedAt
                            )}
                        />
                    </div>
                </section>




                {actionError && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="text-sm font-extrabold text-red-700">
                                Moderation action failed
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                {actionError}
                            </p>
                        </div>
                    </div>
                )}



     

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                   

                    <div className="space-y-6">

                        {/* Report Details */}

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                    <FileText className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-extrabold">
                                        Report Details
                                    </h2>

                                    <p className="mt-1 text-xs text-[#98A2B3]">
                                        Information submitted by
                                        the reporter.
                                    </p>
                                </div>
                            </div>


                            {isEditing ? (
                                <div className="mt-7 space-y-6">

                                    {editError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                                            {editError}
                                        </div>
                                    )}

                                    <div>

                                        <label
                                            htmlFor="report_reason"
                                            className="block text-sm font-bold text-[#334155]"
                                        >
                                            Report Reason
                                        </label>

                                        <select
                                            id="report_reason"
                                            name="report_reason"
                                            value={
                                                editForm.report_reason
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="mt-3 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                                        >
                                            <option value="">
                                                Select a reason
                                            </option>

                                            <option value="Spam">
                                                Spam
                                            </option>

                                            <option value="Fake Job">
                                                Fake Job
                                            </option>

                                            <option value="Scam">
                                                Scam
                                            </option>

                                            <option value="Misleading Information">
                                                Misleading Information
                                            </option>

                                            <option value="Duplicate">
                                                Duplicate
                                            </option>

                                            <option value="Offensive Content">
                                                Offensive Content
                                            </option>

                                            <option value="Expired Job">
                                                Expired Job
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>


                                    <div>

                                        <label
                                            htmlFor="report_description"
                                            className="block text-sm font-bold text-[#334155]"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id="report_description"
                                            name="report_description"
                                            rows={7}
                                            value={
                                                editForm.report_description
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="mt-3 w-full resize-y rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm leading-6 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                                        />
                                    </div>


                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                        <button
                                            type="button"
                                            onClick={
                                                cancelEdit
                                            }
                                            disabled={
                                                editLoading
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-bold text-[#475467]"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                saveEdit
                                            }
                                            disabled={
                                                editLoading
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-extrabold text-white"
                                        >
                                            <Save className="h-4 w-4" />

                                            {editLoading
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                <div className="mt-7 space-y-6">

                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98A2B3]">
                                            Reason
                                        </p>

                                        <div className="mt-2 inline-flex rounded-xl bg-[#F0ECFF] px-4 py-2.5">
                                            <span className="text-sm font-extrabold text-[#6D4AFF]">
                                                {reason}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98A2B3]">
                                            Description
                                        </p>

                                        <div className="mt-2 rounded-xl border border-[#F0EDF7] bg-[#FBFAFE] p-5">
                                            <p className="whitespace-pre-wrap text-sm leading-7 text-[#475467]">
                                                {description}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </section>


                        {/* Reported Job */}

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3765D8]">
                                    <BriefcaseBusiness className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-extrabold">
                                        Reported Job
                                    </h2>

                                    <p className="mt-1 text-xs text-[#98A2B3]">
                                        Job posting associated with
                                        this report.
                                    </p>
                                </div>
                            </div>


                            <div className="mt-6 rounded-2xl border border-[#E7EAF2] bg-[#FBFCFF] p-5">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="min-w-0">

                                        <p className="text-lg font-extrabold text-[#172033]">
                                            {reportedJobTitle}
                                        </p>

                                        <p className="mt-1 text-sm text-[#667085]">
                                            {companyName}
                                        </p>

                                        {reportedJobId && (
                                            <p className="mt-2 text-xs font-semibold text-[#98A2B3]">
                                                Job 
                                                {
                                                    reportedJobId
                                                }
                                            </p>
                                        )}

                                    </div>

                                    {reportedJobId && (
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                                            onClick={() => {
                                                console.log(
                                                    "Open job:",
                                                    reportedJobId
                                                );
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Job
                                        </button>
                                    )}

                                </div>
                            </div>
                        </section>


                        {/* Reporter / Metadata */}

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                    <UserRound className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-extrabold">
                                        Report Information
                                    </h2>

                                    <p className="mt-1 text-xs text-[#98A2B3]">
                                        Report ownership and
                                        moderation metadata.
                                    </p>
                                </div>
                            </div>


                            <div className="mt-7 grid gap-6 sm:grid-cols-2">

                                <InfoItem
                                    icon={
                                        UserRound
                                    }
                                    label="Reported By"
                                    value={
                                        <div>
                                            <p>
                                                {
                                                    reportedBy
                                                }
                                            </p>

                                            <p className="mt-1 text-xs font-normal text-[#98A2B3]">
                                                {
                                                    reporterEmail
                                                }
                                            </p>
                                        </div>
                                    }
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Submitted At"
                                    value={formatDateTime(
                                        submittedAt
                                    )}
                                />

                                <InfoItem
                                    icon={UserRound}
                                    label="Reviewed By"
                                    value={
                                        reviewedBy
                                    }
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Reviewed At"
                                    value={
                                        reviewedAt
                                            ? formatDateTime(
                                                  reviewedAt
                                              )
                                            : "Not reviewed"
                                    }
                                />
                            </div>
                        </section>


                        {/* Risk */}

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-extrabold">
                                        Risk Assessment
                                    </h2>

                                    <p className="mt-1 text-xs text-[#98A2B3]">
                                        Initial classification
                                        based on the report reason.
                                    </p>
                                </div>
                            </div>


                            <div className="mt-6 grid gap-4 md:grid-cols-3">

                                <RiskCard
                                    label="Risk Level"
                                    value={risk}
                                    active
                                    tone={risk}
                                />

                                <RiskCard
                                    label="Status"
                                    value={
                                        report.status ||
                                        "Pending"
                                    }
                                />

                                <RiskCard
                                    label="Report"
                                    value={formatReportId(
                                        report.id
                                    )}
                                />

                            </div>
                        </section>
                    </div>



                    <aside className="h-fit xl:sticky xl:top-6 space-y-6">

                        {/* Moderation action card */}

                        <section className="overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                            <div className="border-b border-[#F0EDF7] p-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                        <Gavel className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-extrabold">
                                            Review Report
                                        </h2>

                                        <p className="mt-1 text-xs text-[#98A2B3]">
                                            Take moderation action
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
                                                    startReview
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#5B21B6] disabled:opacity-50"
                                            >
                                                <Clock3 className="h-4 w-4" />

                                                {actionLoading
                                                    ? "Starting..."
                                                    : "Start Review"}
                                            </button>
                                        )}


                                        {status ===
                                            "under review" && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={
                                                        resolveReport
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />

                                                    {actionLoading
                                                        ? "Resolving..."
                                                        : "Resolve Report"}
                                                </button>

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
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3.5 text-sm font-extrabold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Reject Report
                                                </button>
                                            </>
                                        )}


                                        {status ===
                                            "pending" && (
                                            <div className="rounded-xl bg-[#FBFAFE] p-4">

                                                <p className="text-xs leading-5 text-[#667085]">
                                                    Start the review
                                                    before making
                                                    a final
                                                    moderation
                                                    decision.
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-[#E7E3F2] bg-[#FBFAFE] p-4">

                                        <div className="flex items-start gap-3">

                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
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

                                                <p className="text-sm font-extrabold">
                                                    Report{" "}
                                                    {status ===
                                                    "resolved"
                                                        ? "Resolved"
                                                        : "Rejected"}
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-[#667085]">
                                                    This report
                                                    has completed
                                                    its moderation
                                                    workflow.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>


                        {/* Status timeline */}

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                    <Clock3 className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-extrabold">
                                        Activity
                                    </h2>

                                    <p className="text-xs text-[#98A2B3]">
                                        Report timeline
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">

                                <TimelineItem
                                    active
                                    title="Report Submitted"
                                    description={`Submitted by ${reportedBy}`}
                                    date={submittedAt}
                                />

                                <TimelineItem
                                    active={
                                        status ===
                                            "under review" ||
                                        status ===
                                            "resolved" ||
                                        status ===
                                            "rejected"
                                    }
                                    title="Review"
                                    description={
                                        reviewedBy ===
                                        "Not reviewed"
                                            ? "Awaiting moderator review"
                                            : `Reviewed by ${reviewedBy}`
                                    }
                                    date={
                                        reviewedAt
                                    }
                                />

                                <TimelineItem
                                    active={
                                        status ===
                                            "resolved" ||
                                        status ===
                                            "rejected"
                                    }
                                    title="Final Decision"
                                    description={
                                        status ===
                                        "resolved"
                                            ? "Report resolved"
                                            : status ===
                                              "rejected"
                                            ? "Report rejected"
                                            : "Decision pending"
                                    }
                                    date={
                                        isClosed
                                            ? reviewedAt
                                            : null
                                    }
                                />
                            </div>
                        </section>


                        {/* Quick information */}

                        <section className="rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">

                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#98A2B3]">
                                Report Reference
                            </p>

                            <div className="mt-4 space-y-3">

                                <QuickRow
                                    label="Report"
                                    value={formatReportId(
                                        report.id
                                    )}
                                />

                                <QuickRow
                                    label="Status"
                                    value={
                                        report.status ||
                                        "Pending"
                                    }
                                />

                                <QuickRow
                                    label="Reason"
                                    value={reason}
                                />

                                <QuickRow
                                    label="Risk"
                                    value={risk}
                                />
                            </div>
                        </section>
                    </aside>
                </div>
            </main>




            {showRejectModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/50 px-4 backdrop-blur-sm"
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

                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        <div className="p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                    <AlertCircle className="h-6 w-6" />
                                </div>

                                <div className="flex-1">

                                    <div className="flex items-start justify-between gap-3">

                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-600">
                                                Moderation Action
                                            </p>

                                            <h2 className="mt-1 text-xl font-extrabold">
                                                Reject{" "}
                                                {formatReportId(
                                                    report.id
                                                )}
                                                ?
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowRejectModal(
                                                    false
                                                )
                                            }
                                            className="rounded-lg p-1.5 text-[#98A2B3] hover:bg-[#F8F9FF]"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                                        Rejecting this report
                                        will close its
                                        moderation workflow.
                                    </p>

                                </div>
                            </div>


                            <div className="mt-5 rounded-xl bg-[#FBFAFE] p-4">

                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                                    Report
                                </p>

                                <p className="mt-1 text-sm font-extrabold">
                                    Report ID: {formatReportId(report.id)}
                                </p>

                                <p className="mt-2 text-sm font-semibold text-[#475467]">
                                    {reason}
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
                                    className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-bold text-[#475467]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        rejectReport
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white"
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


            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/50 px-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                                event.currentTarget &&
                            !deleteLoading
                        ) {
                            setShowDeleteModal(false);
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                    <AlertCircle className="h-6 w-6" />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex items-start justify-between gap-3">

                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-600">
                                                Danger Zone
                                            </p>

                                            <h2 className="mt-1 text-xl font-extrabold text-[#172033]">
                                                Delete{" "}
                                                {formatReportId(
                                                    report.id
                                                )}
                                                ?
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                !deleteLoading &&
                                                setShowDeleteModal(false)
                                            }
                                            disabled={deleteLoading}
                                            className="rounded-lg p-1.5 text-[#98A2B3] transition hover:bg-[#F8F9FF] hover:text-[#475467]"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                                        This action will permanently delete
                                        this moderation report. This cannot
                                        be undone.
                                    </p>

                                </div>
                            </div>

                            {deleteError && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-semibold leading-6 text-red-700">
                                        {deleteError}
                                    </p>
                                </div>
                            )}

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
                                    {reason}
                                </p>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeleteModal(false)
                                    }
                                    disabled={deleteLoading}
                                    className="rounded-xl border border-[#E4E7EC] bg-white px-5 py-3 text-sm font-bold text-[#475467] transition hover:bg-[#F8F9FF] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDeleteReport}
                                    disabled={deleteLoading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />

                                    {deleteLoading
                                        ? "Deleting..."
                                        : "Yes, Delete Report"}
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




function HeaderMeta({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="border-b border-[#F0EDF7] px-6 py-4 lg:border-b-0 lg:border-r last:border-r-0">

            <div className="flex items-center gap-2">

                <Icon className="h-3.5 w-3.5 text-[#98A2B3]" />

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                    {label}
                </p>
            </div>

            <p className="mt-2 truncate text-sm font-bold text-[#344054]">
                {value}
            </p>
        </div>
    );
}


function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div>

            <div className="flex items-center gap-2">

                <Icon className="h-3.5 w-3.5 text-[#98A2B3]" />

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                    {label}
                </p>

            </div>

            <div className="mt-2 text-sm font-bold text-[#344054]">
                {value}
            </div>
        </div>
    );
}


function RiskCard({
    label,
    value,
    active,
    tone,
}) {
    const toneClass =
        tone === "High"
            ? "text-red-600 bg-red-50"
            : tone === "Medium"
            ? "text-amber-600 bg-amber-50"
            : tone === "Low"
            ? "text-emerald-600 bg-emerald-50"
            : "text-[#475467] bg-[#F8F9FC]";

    return (
        <div className="rounded-xl border border-[#E7E3F2] bg-[#FBFAFE] p-4">

            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                {label}
            </p>

            <div className="mt-3">
                {active ? (
                    <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-sm font-extrabold ${toneClass}`}
                    >
                        {value}
                    </span>
                ) : (
                    <p className="text-sm font-bold text-[#344054]">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}


function TimelineItem({
    title,
    description,
    date,
    active,
}) {
    return (
        <div className="flex items-start gap-3">

            <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    active
                        ? "bg-[#F0ECFF] text-[#6D4AFF]"
                        : "bg-[#F4F5F7] text-[#98A2B3]"
                }`}
            >
                <CheckCircle2 className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center justify-between gap-2">

                    <p className="text-sm font-extrabold text-[#344054]">
                        {title}
                    </p>

                    <span className="text-[10px] font-semibold text-[#98A2B3]">
                        {date
                            ? formatDateTime(date)
                            : "Pending"}
                    </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-[#667085]">
                    {description}
                </p>
            </div>
        </div>
    );
}


function QuickRow({
    label,
    value,
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#F0EDF7] pb-3 last:border-0 last:pb-0">

            <span className="text-xs font-semibold text-[#98A2B3]">
                {label}
            </span>

            <span className="max-w-[210px] truncate text-right text-xs font-bold text-[#475467]">
                {value}
            </span>
        </div>
    );
}

