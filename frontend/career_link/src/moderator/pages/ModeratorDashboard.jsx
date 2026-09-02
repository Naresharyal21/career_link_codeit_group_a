import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import moderatorApi from "../../apis/moderatorApi";
import accountsApi from "../../apis/accountsApi";
import ReportStatusBadge from "../components/ReportStatusBadge";
import { formatReportId } from "../utils/report";


const EMPTY_DASHBOARD = {
    total_reports: 0,
    pending_reports: 0,
    resolved_reports: 0,
    rejected_reports: 0,
};


const EMPTY_USER = {
    username: "",
    role: "",
    is_staff: false,
    is_superuser: false,
    groups: [],
};


export default function ModeratorDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState(EMPTY_DASHBOARD);

    const [reports, setReports] =
        useState([]);

    const [pendingJobs, setPendingJobs] =
        useState([]);

    const [user, setUser] =
        useState(EMPTY_USER);

    const [loading, setLoading] =
        useState(true);

    const [jobLoading, setJobLoading] =
        useState(true);

    const [userLoading, setUserLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [jobError, setJobError] =
        useState("");




    const canModerate = useMemo(() => {
        const normalizedRole = String(
            user?.role || ""
        )
            .trim()
            .toLowerCase();

        const normalizedUsername = String(
            user?.username || ""
        )
            .trim()
            .toLowerCase();

        const groupNames = Array.isArray(
            user?.groups
        )
            ? user.groups
                  .map((group) =>
                      typeof group === "string"
                          ? group
                          : group?.name
                  )
                  .filter(Boolean)
                  .map((name) =>
                      String(name)
                          .trim()
                          .toLowerCase()
                  )
            : [];

        return (
            normalizedUsername ===
                "moderator" ||
            normalizedRole === "moderator" ||
            normalizedRole === "admin" ||
            normalizedRole ===
                "administrator" ||
            user?.is_staff === true ||
            user?.is_superuser === true ||
            groupNames.includes(
                "moderator"
            ) ||
            groupNames.includes("admin") ||
            groupNames.includes(
                "administrator"
            )
        );
    }, [user]);




    const loadCurrentUser = async () => {
        try {
            setUserLoading(true);

            const currentUser =
                await accountsApi.getMe();

            console.log(
                "Moderator dashboard user:",
                currentUser
            );

            setUser({
                username:
                    currentUser?.username ||
                    "",
                role:
                    currentUser?.role || "",
                is_staff:
                    currentUser?.is_staff ===
                    true,
                is_superuser:
                    currentUser?.is_superuser ===
                    true,
                groups:
                    currentUser?.groups || [],
            });
        } catch (err) {
            console.error(
                "Failed to load current user:",
                err
            );

            setUser(EMPTY_USER);
        } finally {
            setUserLoading(false);
        }
    };




    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                dashboardData,
                reportsData,
            ] = await Promise.all([
                moderatorApi.getDashboard(),
                moderatorApi.getReports(),
            ]);

            console.log(
                "Dashboard API:",
                dashboardData
            );

            console.log(
                "Reports API:",
                reportsData
            );

            setDashboard({
                total_reports: Number(
                    dashboardData?.total_reports ??
                        0
                ),

                pending_reports: Number(
                    dashboardData?.pending_reports ??
                        0
                ),

                resolved_reports: Number(
                    dashboardData?.resolved_reports ??
                        0
                ),

                rejected_reports: Number(
                    dashboardData?.rejected_reports ??
                        0
                ),
            });

            const reportList =
                Array.isArray(reportsData)
                    ? reportsData
                    : Array.isArray(
                          reportsData?.results
                      )
                    ? reportsData.results
                    : [];

            setReports(reportList);
        } catch (err) {
            console.error(
                "Failed to load moderator dashboard:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load dashboard data."
            );

            setDashboard(
                EMPTY_DASHBOARD
            );

            setReports([]);
        } finally {
            setLoading(false);
        }
    };




    const loadJobApprovals = async () => {
        if (!canModerate) {
            setPendingJobs([]);
            setJobLoading(false);
            return;
        }

        try {
            setJobLoading(true);
            setJobError("");

            const response =
                await moderatorApi.getJobApprovals();

            console.log(
                "Job Approvals API:",
                response
            );

            const approvalList =
                Array.isArray(response)
                    ? response
                    : Array.isArray(
                          response?.results
                      )
                    ? response.results
                    : [];

            setPendingJobs(
                approvalList
            );
        } catch (err) {
            console.error(
                "Failed to load job approvals:",
                err
            );

            setPendingJobs([]);

            setJobError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load job approvals."
            );
        } finally {
            setJobLoading(false);
        }
    };


    const handleApproveJob = async (
        approvalId
    ) => {
        try {
            await moderatorApi.approveJob(
                approvalId
            );

            await loadJobApprovals();
        } catch (err) {
            console.error(
                "Failed to approve job:",
                err
            );

            setJobError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to approve job."
            );
        }
    };


    const handleRejectJob = async (
        approvalId
    ) => {
        try {
            await moderatorApi.rejectJob(
                approvalId
            );

            await loadJobApprovals();
        } catch (err) {
            console.error(
                "Failed to reject job:",
                err
            );

            setJobError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to reject job."
            );
        }
    };


 

    useEffect(() => {
        loadCurrentUser();
        loadDashboard();
    }, []);


    useEffect(() => {
        if (!userLoading) {
            loadJobApprovals();
        }
    }, [
        userLoading,
        canModerate,
    ]);




    const pendingReports =
        reports.filter(
            (report) =>
                report?.status ===
                    "Pending" ||
                report?.status ===
                    "Under Review"
        );


    const criticalReports =
        pendingReports.filter(
            (report) =>
                report?.priority ===
                    "High" ||
                report?.priority ===
                    "Critical"
        );


    const completionRate =
        dashboard.total_reports > 0
            ? Math.round(
                  (dashboard.resolved_reports /
                      dashboard.total_reports) *
                      100
              )
            : 0;


    const showModeratorActions =
        !userLoading &&
        canModerate;




    return (
        <div className="min-h-screen bg-background text-on-surface">

            <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 lg:px-10">

               

                <header className="mb-8">

                        {/* Left: title */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Left: title */}
                            <div className="min-w-0">
                                <h1 className="font-montserrat text-headline-lg font-bold text-on-surface md:text-headline-xl">
                                    Moderation Dashboard
                                </h1>

                                <p className="mt-3 max-w-3xl text-body-md leading-7 text-on-surface-variant">
                                    Monitor reports, review suspicious activity, approve employer jobs,
                                    and manage moderation operations from one place.
                                </p>
                            </div>

                        {/* Right: ONLY Refresh */}
                        <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="career-secondary-button"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            refresh
                        </span>
                        Refresh
                    </button>

                    </div>
                </header>



                {!userLoading &&
                    !canModerate && (
                        <section className="mb-8 rounded-2xl border border-secondary-fixed bg-white p-5 shadow-ambient">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-secondary">
                                    <span className="material-symbols-outlined">
                                        lock
                                    </span>
                                </div>

                                <div>

                                    <p className="font-semibold text-on-surface">
                                        Moderator controls are restricted
                                    </p>

                                    <p className="mt-1 text-body-sm leading-6 text-on-surface-variant">
                                        Your account can view the
                                        dashboard, but Create Report
                                        and Job Approvals require
                                        moderator or administrator
                                        privileges.
                                    </p>

                                </div>

                            </div>

                        </section>
                    )}


                

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                <span className="material-symbols-outlined">
                                    error
                                </span>
                            </div>

                            <div>

                                <p className="font-semibold text-red-700">
                                    Unable to load dashboard
                                </p>

                                <p className="mt-1 text-body-sm leading-6 text-red-600">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>
                )}


               

                {showModeratorActions && (
                    <section className="mb-8">

                        <div className="mb-4">

                            <p className="text-label-md font-semibold uppercase tracking-wider text-primary">
                                Quick Actions
                            </p>

                            <h2 className="mt-1 font-montserrat text-headline-md font-bold text-on-surface">
                                Moderator Tools
                            </h2>

                        </div>


                        <div className="grid gap-4 md:grid-cols-2">

                            <ActionCard
                                icon="add_circle"
                                title="Create Report"
                                description="Submit a new moderation report for a job posting that requires attention."
                                buttonText="Create Report"
                                onClick={() =>
                                    navigate(
                                        "/reports/create/"
                                    )
                                }
                            />

                            <ActionCard
                                icon="work"
                                title="Job Approvals"
                                description="Review employer job postings waiting for moderator approval."
                                buttonText="Open Approvals"
                                onClick={() =>
                                    navigate(
                                        "/reports/job-approvals/"
                                    )
                                }
                            />

                        </div>

                    </section>
                )}


                

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        icon="pending_actions"
                        label="Review Queue"
                        value={
                            dashboard.pending_reports
                        }
                        sublabel={`${criticalReports.length} high priority`}
                        onClick={() =>
                            navigate(
                                "/reports/list/"
                            )
                        }
                    />

                    <StatCard
                        icon="flag"
                        label="Total Reports"
                        value={
                            dashboard.total_reports
                        }
                        sublabel="All submitted reports"
                        onClick={() =>
                            navigate(
                                "/reports/list/"
                            )
                        }
                    />

                    <StatCard
                        icon="task_alt"
                        label="Resolved Reports"
                        value={
                            dashboard.resolved_reports
                        }
                        sublabel={`${completionRate}% completion`}
                    />

                    <StatCard
                        icon="cancel"
                        label="Rejected Reports"
                        value={
                            dashboard.rejected_reports
                        }
                        sublabel="Reports rejected"
                    />

                </section>


           

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">

                    

                    <div className="space-y-6">

                       

                        <section className="career-card overflow-hidden">

                            <SectionHeader
                                icon="flag"
                                title="Review Queue"
                                description="Reports requiring moderator attention."
                                buttonLabel="View all"
                                onClick={() =>
                                    navigate(
                                        "/reports/list/"
                                    )
                                }
                            />


                            {loading ? (
                                <LoadingState />
                            ) : pendingReports.length ===
                              0 ? (
                                <EmptyState />
                            ) : (
                                <div className="divide-y divide-outline-variant">

                                    {pendingReports
                                        .slice(
                                            0,
                                            6
                                        )
                                        .map(
                                            (
                                                item
                                            ) => (
                                                <ReportQueueItem
                                                    key={
                                                        item.id
                                                    }
                                                    item={
                                                        item
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/reports/${item.id}/`
                                                        )
                                                    }
                                                />
                                            )
                                        )}

                                </div>
                            )}

                        </section>



                        {showModeratorActions && (
                            <section className="career-card overflow-hidden">

                                <SectionHeader
                                    icon="work"
                                    title="Job Approvals"
                                    description="Employer job postings waiting for moderator approval."
                                    buttonLabel="View all"
                                    onClick={() =>
                                        navigate(
                                            "/reports/job-approvals/"
                                        )
                                    }
                                />


                                {jobError && (
                                    <div className="border-b border-red-100 bg-red-50 px-6 py-4">

                                        <div className="flex items-start gap-3">

                                            <span className="material-symbols-outlined text-red-600">
                                                error
                                            </span>

                                            <p className="text-sm font-semibold text-red-700">
                                                {jobError}
                                            </p>

                                        </div>

                                    </div>
                                )}


                                {jobLoading ? (
                                    <JobApprovalLoading />
                                ) : pendingJobs.length ===
                                  0 ? (
                                    <JobApprovalEmpty />
                                ) : (
                                    <div className="divide-y divide-outline-variant">

                                        {pendingJobs
                                            .slice(
                                                0,
                                                5
                                            )
                                            .map(
                                                (
                                                    approval
                                                ) => (
                                                    <JobApprovalItem
                                                        key={
                                                            approval.id
                                                        }
                                                        approval={
                                                            approval
                                                        }
                                                        onReview={() =>
                                                            navigate(
                                                                "/reports/job-approvals/"
                                                            )
                                                        }
                                                        onApprove={() =>
                                                            handleApproveJob(
                                                                approval.id
                                                            )
                                                        }
                                                        onReject={() =>
                                                            handleRejectJob(
                                                                approval.id
                                                            )
                                                        }
                                                    />
                                                )
                                            )}

                                    </div>
                                )}

                            </section>
                        )}

                    </div>


                   

                    <aside className="space-y-6">



                        <section className="career-card p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                                    <span className="material-symbols-outlined">
                                        bar_chart
                                    </span>
                                </div>

                                <div>

                                    <h2 className="font-montserrat text-headline-md font-bold text-on-surface">
                                        Report Summary
                                    </h2>

                                    <p className="text-xs text-on-surface-variant">
                                        Current moderation activity
                                    </p>

                                </div>

                            </div>


                            <div className="mt-6 space-y-3">

                                <SummaryRow
                                    label="Pending"
                                    value={
                                        dashboard.pending_reports
                                    }
                                    tone="warning"
                                />

                                <SummaryRow
                                    label="Resolved"
                                    value={
                                        dashboard.resolved_reports
                                    }
                                    tone="success"
                                />

                                <SummaryRow
                                    label="Rejected"
                                    value={
                                        dashboard.rejected_reports
                                    }
                                    tone="danger"
                                />

                                <SummaryRow
                                    label="Total"
                                    value={
                                        dashboard.total_reports
                                    }
                                />

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/reports/list/"
                                    )
                                }
                                className="career-primary-button mt-6 w-full"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    manage_search
                                </span>

                                Manage Reports
                            </button>

                        </section>


                        

                        <section className="career-card p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-fixed text-secondary">
                                    <span className="material-symbols-outlined">
                                        priority_high
                                    </span>
                                </div>

                                <div>

                                    <h2 className="font-montserrat text-headline-md font-bold text-on-surface">
                                        Priority Alerts
                                    </h2>

                                    <p className="text-xs text-on-surface-variant">
                                        Reports needing attention
                                    </p>

                                </div>

                            </div>


                            <div className="mt-6 rounded-xl bg-surface-low p-5">

                                <p className="text-label-sm uppercase tracking-wide text-outline">
                                    Critical / High
                                </p>

                                <p className="mt-1 font-montserrat text-4xl font-bold text-on-surface">
                                    {
                                        criticalReports.length
                                    }
                                </p>

                                <p className="mt-2 text-body-sm text-on-surface-variant">
                                    High-priority reports currently in queue.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/reports/list/"
                                    )
                                }
                                className="career-secondary-button mt-4 w-full"
                            >
                                Review Priority Reports

                                <span className="material-symbols-outlined text-[18px]">
                                    arrow_forward
                                </span>
                            </button>

                        </section>

                    </aside>

                </div>

            </main>

        </div>
    );
}



function SectionHeader({
    icon,
    title,
    description,
    buttonLabel,
    onClick,
}) {
    return (
        <div className="border-b border-outline-variant p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                            <span className="material-symbols-outlined">
                                {icon}
                            </span>
                        </div>

                        <div>

                            <h2 className="font-montserrat text-headline-md font-bold text-on-surface">
                                {title}
                            </h2>

                            <p className="mt-1 text-body-sm text-on-surface-variant">
                                {description}
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={onClick}
                    className="career-ghost-button"
                >
                    {buttonLabel}

                    <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                    </span>
                </button>

            </div>

        </div>
    );
}




function ActionCard({
    icon,
    title,
    description,
    buttonText,
    onClick,
}) {
    return (
        <div className="career-card career-card-hover p-6">

            <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <span className="material-symbols-outlined">
                        {icon}
                    </span>
                </div>

                <div className="min-w-0 flex-1">

                    <h3 className="font-montserrat text-headline-md font-bold text-on-surface">
                        {title}
                    </h3>

                    <p className="mt-2 text-body-sm leading-6 text-on-surface-variant">
                        {description}
                    </p>

                    <button
                        type="button"
                        onClick={onClick}
                        className="career-primary-button mt-5"
                    >
                        {buttonText}

                        <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                        </span>
                    </button>

                </div>

            </div>

        </div>
    );
}



function StatCard({
    icon,
    label,
    value,
    sublabel,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={`career-card career-card-hover flex min-h-[145px] items-center justify-between p-5 text-left ${
                onClick
                    ? "cursor-pointer"
                    : "cursor-default"
            }`}
        >

            <div>

                <p className="text-label-sm uppercase tracking-wide text-outline">
                    {label}
                </p>

                <p className="mt-2 font-montserrat text-3xl font-bold text-on-surface">
                    {value}
                </p>

                {sublabel && (
                    <p className="mt-1 text-body-sm text-on-surface-variant">
                        {sublabel}
                    </p>
                )}

            </div>


            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <span className="material-symbols-outlined">
                    {icon}
                </span>
            </div>

        </button>
    );
}




function ReportQueueItem({
    item,
    onClick,
}) {
    const priority =
        item?.priority || "Normal";

    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-surface-low"
        >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <span className="material-symbols-outlined">
                    flag
                </span>
            </div>


            <div className="min-w-0 flex-1">

                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

                    <p className="truncate font-semibold text-on-surface">
                        {formatReportId(
                            item.id
                        )}
                    </p>


                    <div className="flex flex-wrap items-center gap-2">

                        <PriorityBadge
                            priority={
                                priority
                            }
                        />

                        <ReportStatusBadge
                            status={
                                item.status ||
                                "Pending"
                            }
                        />

                    </div>

                </div>


                <p className="mt-1 truncate text-body-sm text-on-surface-variant">
                    {item.description ||
                        item.report_description ||
                        item.status_reason ||
                        item.reason ||
                        "No description available."}
                </p>


                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-label-sm text-outline">

                    {item.reported_job && (
                        <span>
                            Job{" "}
                            {typeof item.reported_job ===
                            "object"
                                ? item
                                      .reported_job
                                      .title ||
                                  item
                                      .reported_job
                                      .id
                                : item.reported_job}
                        </span>
                    )}


                    {item.reported_by && (
                        <span>
                            Submitted by{" "}
                            {typeof item.reported_by ===
                            "object"
                                ? item
                                      .reported_by
                                      .username ||
                                  item
                                      .reported_by
                                      .email
                                : item.reported_by}
                        </span>
                    )}


                    <span>
                        {item.created_at
                            ? new Date(
                                  item.created_at
                              ).toLocaleDateString()
                            : item.reported_at
                            ? new Date(
                                  item.reported_at
                              ).toLocaleDateString()
                            : "N/A"}
                    </span>

                </div>

            </div>


            <span className="material-symbols-outlined shrink-0 text-outline transition group-hover:translate-x-1 group-hover:text-primary">
                arrow_forward
            </span>

        </button>
    );
}




function JobApprovalItem({
    approval,
    onReview,
    onApprove,
    onReject,
}) {
    const jobTitle =
        approval?.job_title ||
        approval?.job?.title ||
        (typeof approval?.job ===
        "object"
            ? `Job ${approval.job.id}`
            : `Job ${approval?.job || "N/A"}`);


    const companyName =
        approval?.company_name ||
        approval?.job?.employer
            ?.company_name ||
        "Employer";


    const jobId =
        typeof approval?.job ===
        "object"
            ? approval.job.id
            : approval?.job;


    return (
        <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">
                        work
                    </span>
                </div>


                <div className="min-w-0">

                    <p className="truncate font-semibold text-on-surface">
                        {jobTitle}
                    </p>

                    <p className="mt-1 text-body-sm text-on-surface-variant">
                        {companyName}
                    </p>


                    <div className="mt-2 flex flex-wrap gap-3 text-label-sm text-outline">

                        {jobId && (
                            <span>
                                Job {jobId}
                            </span>
                        )}

                        <span>
                            Approval #
                            {approval.id}
                        </span>

                        <span>
                            {approval.created_at
                                ? new Date(
                                      approval.created_at
                                  ).toLocaleDateString()
                                : "N/A"}
                        </span>

                    </div>

                </div>

            </div>


            <div className="flex flex-wrap gap-2">

                <button
                    type="button"
                    onClick={onReview}
                    className="career-secondary-button"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        visibility
                    </span>

                    Review
                </button>


                <button
                    type="button"
                    onClick={onApprove}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        check_circle
                    </span>

                    Approve
                </button>


                <button
                    type="button"
                    onClick={onReject}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        cancel
                    </span>

                    Reject
                </button>

            </div>

        </div>
    );
}




function SummaryRow({
    label,
    value,
    tone,
}) {
    const styles = {
        warning:
            "bg-tertiary-fixed text-on-tertiary-fixed-variant",

        success:
            "bg-primary-fixed text-on-primary-fixed-variant",

        danger:
            "bg-secondary-fixed text-on-secondary-fixed-variant",

        default:
            "bg-surface-low text-on-surface",
    };

    return (
        <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                styles[tone] ||
                styles.default
            }`}
        >

            <span className="text-body-sm">
                {label}
            </span>

            <span className="font-semibold">
                {value}
            </span>

        </div>
    );
}



function PriorityBadge({
    priority,
}) {
    const styles = {
        Critical:
            "bg-red-50 text-red-700",

        High:
            "bg-orange-50 text-orange-700",

        Medium:
            "bg-amber-50 text-amber-700",

        Low:
            "bg-emerald-50 text-emerald-700",

        Normal:
            "bg-surface-container text-on-surface-variant",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm ${
                styles[priority] ||
                styles.Normal
            }`}
        >
            {priority}
        </span>
    );
}




function LoadingState() {
    return (
        <div className="p-12 text-center">

            <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                progress_activity
            </span>

            <p className="mt-3 text-body-sm text-on-surface-variant">
                Loading review queue...
            </p>

        </div>
    );
}



function EmptyState() {
    return (
        <div className="p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <span className="material-symbols-outlined text-2xl">
                    inbox
                </span>
            </div>

            <p className="mt-4 font-semibold text-on-surface">
                Queue is empty
            </p>

            <p className="mt-1 text-body-sm text-on-surface-variant">
                There are no reports awaiting review.
            </p>

        </div>
    );
}




function JobApprovalLoading() {
    return (
        <div className="divide-y divide-outline-variant">

            {[1, 2, 3].map(
                (item) => (
                    <div
                        key={item}
                        className="animate-pulse p-6"
                    >

                        <div className="flex items-center gap-4">

                            <div className="h-11 w-11 rounded-xl bg-surface-container" />

                            <div className="flex-1">

                                <div className="h-4 w-1/2 rounded bg-surface-container" />

                                <div className="mt-3 h-3 w-1/3 rounded bg-surface-container" />

                                <div className="mt-3 h-3 w-1/4 rounded bg-surface-container" />

                            </div>

                        </div>

                    </div>
                )
            )}

        </div>
    );
}



function JobApprovalEmpty() {
    return (
        <div className="p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <span className="material-symbols-outlined text-2xl">
                    work_off
                </span>
            </div>

            <p className="mt-4 font-semibold text-on-surface">
                No pending job approvals
            </p>

            <p className="mt-1 text-body-sm text-on-surface-variant">
                All submitted jobs have been reviewed.
            </p>

        </div>
    );
}