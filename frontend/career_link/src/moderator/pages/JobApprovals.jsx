import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertCircle,
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Eye,
    RefreshCw,
    Search,
    X,
    XCircle,
} from "lucide-react";

import moderatorApi from "../../apis/moderatorApi";
import ModeratorSectionPage from "../components/ModeratorSectionPage";




function getJobId(approval) {
    if (
        typeof approval?.job === "object" &&
        approval.job !== null
    ) {
        return approval.job.id;
    }

    return (
        approval?.job ||
        approval?.job_id ||
        null
    );
}


function getJobTitle(approval) {
    if (
        approval?.job_title
    ) {
        return approval.job_title;
    }

    if (
        typeof approval?.job === "object" &&
        approval.job !== null
    ) {
        return (
            approval.job.title ||
            `Job ${approval.job.id}`
        );
    }

    return (
        approval?.title ||
        `Job ${getJobId(approval) || "N/A"}`
    );
}


function getCompanyName(approval) {
    if (approval?.company_name) {
        return approval.company_name;
    }

    if (
        typeof approval?.job === "object" &&
        approval.job !== null
    ) {
        return (
            approval.job?.employer?.company_name ||
            approval.job?.company_name ||
            approval.job?.employer_name ||
            "Employer"
        );
    }

    return (
        approval?.employer_name ||
        "Employer"
    );
}


function getDescription(approval) {
    if (
        typeof approval?.job === "object" &&
        approval.job !== null
    ) {
        return (
            approval.job.description ||
            "No description available."
        );
    }

    return (
        approval?.description ||
        "No description available."
    );
}


function getLocation(approval) {
    if (
        typeof approval?.job === "object" &&
        approval.job !== null
    ) {
        return approval.job.location;
    }

    return approval?.location;
}


function getJobType(approval) {
    if (
        typeof approval?.job === "object" &&
        approval.job !== null
    ) {
        return (
            approval.job.job_type ||
            null
        );
    }

    return approval?.job_type || null;
}


function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}




export default function JobApprovals() {
    const navigate = useNavigate();

    const [approvals, setApprovals] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [selectedApproval, setSelectedApproval] =
        useState(null);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [actionError, setActionError] =
        useState("");

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [rejectionReason, setRejectionReason] =
        useState("");

    const [page, setPage] = useState(1);

    const pageSize = 10;

    // Server-reported pagination info for the currently loaded page.
    // totalCount === null means the backend didn't paginate (plain
    // array response) — in that case we fall back to treating
    // `approvals` as the full dataset.
    const [totalCount, setTotalCount] = useState(null);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);




    const loadApprovals = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await moderatorApi.getJobApprovals({
                    page: pageNumber,
                    page_size: pageSize,
                });

            console.log(
                "JOB APPROVALS RESPONSE:",
                response
            );

            if (Array.isArray(response)) {
                setApprovals(response);
                setTotalCount(null);
                setHasNext(false);
                setHasPrevious(false);
            } else {
                setApprovals(
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
            console.error(
                "Failed to load job approvals:",
                err
            );

            setApprovals([]);
            setTotalCount(null);
            setHasNext(false);
            setHasPrevious(false);

            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load job approvals."
            );
        } finally {
            setLoading(false);
        }
    };


    const refresh = () => loadApprovals(page);


    useEffect(() => {
        loadApprovals(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);


    const totalPages =
        totalCount !== null
            ? Math.max(1, Math.ceil(totalCount / pageSize))
            : 1;

    const currentPage = Math.min(page, totalPages);



    const filteredApprovals = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return approvals;
        }

        return approvals.filter(
            (approval) => {
                const searchable = [
                    approval?.id,
                    getJobId(approval),
                    getJobTitle(approval),
                    getCompanyName(approval),
                    getDescription(approval),
                    getLocation(approval),
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchable.includes(
                    query
                );
            }
        );
    }, [approvals, search]);




    const handleApprove = async (
        approvalId
    ) => {
        try {
            setActionLoading(true);
            setActionError("");

            await moderatorApi.approveJob(
                approvalId
            );

            await loadApprovals(page);
        } catch (err) {
            console.error(
                "Failed to approve job:",
                err
            );

            setActionError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to approve this job."
            );
        } finally {
            setActionLoading(false);
        }
    };




    const openRejectModal = (approval) => {
        setSelectedApproval(approval);
        setRejectionReason("");
        setActionError("");
        setShowRejectModal(true);
    };


    const closeRejectModal = () => {
        if (actionLoading) {
            return;
        }

        setShowRejectModal(false);
        setSelectedApproval(null);
        setRejectionReason("");
        setActionError("");
    };


    const handleReject = async () => {
        if (!selectedApproval) {
            return;
        }

        try {
            setActionLoading(true);
            setActionError("");

            await moderatorApi.rejectJob(
                selectedApproval.id,
                rejectionReason.trim()
            );

            setShowRejectModal(false);
            setSelectedApproval(null);
            setRejectionReason("");

            await loadApprovals(page);
        } catch (err) {
            console.error(
                "Failed to reject job:",
                err
            );

            setActionError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to reject this job."
            );
        } finally {
            setActionLoading(false);
        }
    };



    return (
        <>
            <ModeratorSectionPage
                title="Job Approvals"
                description="Review employer job postings waiting for moderator approval."
                backLabel="Dashboard"
                backTo="/reports/"
            >

      

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        {search.trim() !== "" ? (
                            <>
                                <p className="text-sm font-semibold text-[#475467]">
                                    {filteredApprovals.length}{" "}
                                    match
                                    {filteredApprovals.length !==
                                    1
                                        ? "es"
                                        : ""}{" "}
                                    on this page
                                </p>

                                <p className="mt-1 text-xs text-[#98A2B3]">
                                    Search only looks within the
                                    currently loaded page (
                                    {approvals.length} pending
                                    approval
                                    {approvals.length !== 1
                                        ? "s"
                                        : ""}
                                    ). Use the page controls
                                    below to check other pages.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-[#475467]">
                                    {totalCount ??
                                        approvals.length}{" "}
                                    pending approval
                                    {(totalCount ??
                                        approvals.length) !== 1
                                        ? "s"
                                        : ""}
                                </p>

                                <p className="mt-1 text-xs text-[#98A2B3]">
                                    Review each submitted job before
                                    it becomes approved.
                                </p>
                            </>
                        )}
                    </div>


                    <div className="flex flex-wrap gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/reports/"
                                )
                            }
                            className="career-secondary-button"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={refresh}
                            disabled={
                                loading ||
                                actionLoading
                            }
                            className="career-secondary-button"
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

                    </div>
                </div>



                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-3">

                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                            <div>

                                <p className="text-sm font-extrabold text-red-700">
                                    Unable to load job approvals
                                </p>

                                <p className="mt-1 text-sm leading-6 text-red-600">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={refresh}
                                    className="mt-3 text-xs font-bold text-red-700 underline"
                                >
                                    Try again
                                </button>

                            </div>
                        </div>
                    </div>
                )}


          

                <section className="mb-6 rounded-2xl border border-[#E7E3F2] bg-white p-5 shadow-sm">

                    <div className="relative">

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
                            placeholder="Search by job title, company, location..."
                            className="w-full rounded-xl border border-[#E2E8F0] bg-[#FBFCFE] py-3 pl-11 pr-4 text-sm text-[#334155] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                        />

                    </div>
                </section>


                

                <section className="overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">

                    <div className="border-b border-[#F0EDF7] p-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness className="h-5 w-5" />
                            </div>

                            <div>

                                <h2 className="font-montserrat text-headline-md font-bold text-[#172033]">
                                    Pending Job Approvals
                                </h2>

                                <p className="mt-1 text-xs text-[#98A2B3]">
                                    Jobs waiting for moderation review.
                                </p>

                            </div>

                        </div>
                    </div>


                    {/* Loading */}

                    {loading ? (
                        <LoadingState />
                    ) : filteredApprovals.length ===
                      0 ? (
                        <EmptyState
                            hasSearch={
                                search.trim() !==
                                ""
                            }
                            onClear={() =>
                                setSearch("")
                            }
                        />
                    ) : (
                        <div className="divide-y divide-[#F0EDF7]">

                            {filteredApprovals.map(
                                (
                                    approval
                                ) => (
                                    <ApprovalRow
                                        key={
                                            approval.id
                                        }
                                        approval={
                                            approval
                                        }
                                        actionLoading={
                                            actionLoading
                                        }
                                        onReview={() => {
                                            const jobId = getJobId(approval);
                                            if (jobId) {
                                                navigate(`/jobs/${jobId}`);
                                            }
                                        }}
                                        onApprove={() =>
                                            handleApprove(
                                                approval.id
                                            )
                                        }
                                        onReject={() =>
                                            openRejectModal(
                                                approval
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>
                    )}
                </section>


                {!loading &&
                    (approvals.length > 0 ||
                        totalPages > 1) && (
                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-xs font-semibold text-[#98A2B3]">
                                Page {currentPage} of{" "}
                                {totalPages}
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
                                            Math.max(
                                                1,
                                                current - 1
                                            )
                                        )
                                    }
                                    className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    )
                                        .slice(0, 7)
                                        .map((number) => (
                                            <button
                                                key={number}
                                                type="button"
                                                onClick={() =>
                                                    setPage(number)
                                                }
                                                className={`h-10 w-10 rounded-xl text-sm font-extrabold transition ${
                                                    currentPage ===
                                                    number
                                                        ? "bg-[#6D4AFF] text-white"
                                                        : "border border-[#E2E8F0] bg-white text-[#475467] hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                                                }`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                </div>

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


            

            {showRejectModal && (
                <RejectModal
                    approval={
                        selectedApproval
                    }
                    reason={
                        rejectionReason
                    }
                    setReason={
                        setRejectionReason
                    }
                    loading={
                        actionLoading
                    }
                    error={
                        actionError
                    }
                    onClose={
                        closeRejectModal
                    }
                    onConfirm={
                        handleReject
                    }
                />
            )}
        </>
    );
}



function ApprovalRow({
    approval,
    actionLoading,
    onReview,
    onApprove,
    onReject,
}) {
    const jobId =
        getJobId(approval);

    const jobTitle =
        getJobTitle(approval);

    const companyName =
        getCompanyName(approval);

    const location =
        getLocation(approval);

    const jobType =
        getJobType(approval);

    return (
        <div className="p-6 transition hover:bg-[#FBFAFE]">

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                {/* Job information */}

                <div className="flex min-w-0 items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3765D8]">
                        <BriefcaseBusiness className="h-5 w-5" />
                    </div>


                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate text-base font-extrabold text-[#172033]">
                                {jobTitle}
                            </h3>

                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                                Pending
                            </span>

                        </div>


                        <p className="mt-1 text-sm font-semibold text-[#475467]">
                            {companyName}
                        </p>


                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#98A2B3]">

                            {jobId && (
                                <span>
                                    Job {jobId}
                                </span>
                            )}

                            {location && (
                                <span>
                                    {location}
                                </span>
                            )}

                            {jobType && (
                                <span>
                                    {jobType}
                                </span>
                            )}

                            <span>
                                Approval #
                                {
                                    approval.id
                                }
                            </span>

                            <span>
                                Submitted{" "}
                                {formatDate(
                                    approval.created_at
                                )}
                            </span>

                        </div>


                        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-[#667085]">
                            {getDescription(
                                approval
                            )}
                        </p>

                    </div>

                </div>


                {/* Actions */}

                <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">

                    <button
                        type="button"
                        onClick={onReview}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475467] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                    >
                        <Eye className="h-4 w-4" />
                        Review
                    </button>


                    <button
                        type="button"
                        onClick={onApprove}
                        disabled={
                            actionLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 className="h-4 w-4" />

                        Approve
                    </button>


                    <button
                        type="button"
                        onClick={onReject}
                        disabled={
                            actionLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <XCircle className="h-4 w-4" />

                        Reject
                    </button>

                </div>
            </div>
        </div>
    );
}




function LoadingState() {
    return (
        <div className="divide-y divide-[#F0EDF7]">

            {[1, 2, 3, 4].map(
                (item) => (
                    <div
                        key={item}
                        className="animate-pulse p-6"
                    >
                        <div className="flex gap-4">

                            <div className="h-12 w-12 rounded-xl bg-[#EEF1F6]" />

                            <div className="flex-1">

                                <div className="h-5 w-1/2 rounded bg-[#EEF1F6]" />

                                <div className="mt-3 h-4 w-1/3 rounded bg-[#EEF1F6]" />

                                <div className="mt-4 h-3 w-3/4 rounded bg-[#EEF1F6]" />

                                <div className="mt-3 h-3 w-2/3 rounded bg-[#EEF1F6]" />

                            </div>

                        </div>
                    </div>
                )
            )}

        </div>
    );
}




function EmptyState({
    hasSearch,
    onClear,
}) {
    return (
        <div className="p-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#3765D8]">
                <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#172033]">
                {hasSearch
                    ? "No matching jobs"
                    : "No pending job approvals"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
                {hasSearch
                    ? "Try changing your search term."
                    : "There are currently no employer job postings waiting for moderator approval."}
            </p>

            {hasSearch && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#6D4AFF] transition hover:border-[#6D4AFF]"
                >
                    Clear Search
                </button>
            )}
        </div>
    );
}




function RejectModal({
    approval,
    reason,
    setReason,
    loading,
    error,
    onClose,
    onConfirm,
}) {
    if (!approval) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/50 px-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                        event.currentTarget &&
                    !loading
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
            >

                <div className="border-b border-[#F0EDF7] p-6">

                    <div className="flex items-start justify-between gap-4">

                        <div className="flex items-start gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <XCircle className="h-5 w-5" />
                            </div>

                            <div>

                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                                    Job Moderation
                                </p>

                                <h2 className="mt-1 text-xl font-extrabold text-[#172033]">
                                    Reject Job?
                                </h2>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg p-2 text-[#98A2B3] transition hover:bg-[#F8F9FF] hover:text-[#475467]"
                        >
                            <X className="h-5 w-5" />
                        </button>

                    </div>
                </div>


                <div className="p-6">

                    <div className="rounded-xl bg-[#FBFAFE] p-4">

                        <p className="text-sm font-extrabold text-[#172033]">
                            {getJobTitle(
                                approval
                            )}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#667085]">
                            {getCompanyName(
                                approval
                            )}
                        </p>

                    </div>


                    <div className="mt-5">

                        <label
                            htmlFor="rejection_reason"
                            className="block text-sm font-bold text-[#334155]"
                        >
                            Rejection Reason
                        </label>

                        <p className="mt-1 text-xs text-[#98A2B3]">
                            Explain why this job
                            cannot be approved.
                        </p>

                        <textarea
                            id="rejection_reason"
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target
                                        .value
                                )
                            }
                            rows={5}
                            placeholder="Enter the reason for rejection..."
                            className="mt-3 w-full resize-y rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm leading-6 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                        />

                    </div>


                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

                            <div className="flex items-start gap-2">

                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                                <p className="text-sm font-semibold text-red-700">
                                    {error}
                                </p>

                            </div>

                        </div>
                    )}


                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-bold text-[#475467] transition hover:bg-[#F8F9FF] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={
                                loading
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <XCircle className="h-4 w-4" />

                            {loading
                                ? "Rejecting..."
                                : "Reject Job"}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}