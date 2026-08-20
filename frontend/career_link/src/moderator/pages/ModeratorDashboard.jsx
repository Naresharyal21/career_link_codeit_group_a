import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";

const EMPTY_DASHBOARD = {
    total_reports: 0,
    pending_reports: 0,
    resolved_reports: 0,
    rejected_reports: 0,
};

export default function ModeratorDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [dashboardData, reportsData] = await Promise.all([
                moderatorApi.getDashboard(),
                moderatorApi.getReports(),
            ]);

            console.log("Dashboard API:", dashboardData);
            console.log("Reports API:", reportsData);

            setDashboard({
                total_reports: Number(
                    dashboardData?.total_reports ?? 0
                ),
                pending_reports: Number(
                    dashboardData?.pending_reports ?? 0
                ),
                resolved_reports: Number(
                    dashboardData?.resolved_reports ?? 0
                ),
                rejected_reports: Number(
                    dashboardData?.rejected_reports ?? 0
                ),
            });

            const reportList = Array.isArray(reportsData)
                ? reportsData
                : Array.isArray(reportsData?.results)
                    ? reportsData.results
                    : [];

            setReports(reportList);
        } catch (err) {
            console.error(
                "Failed to load moderator dashboard:",
                err
            );

            console.error(
                "Response:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to load dashboard data."
            );

            setDashboard(EMPTY_DASHBOARD);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const pendingReports = reports.filter(
        (report) =>
            report.status === "Pending" ||
            report.status === "Under Review"
    );

    const criticalReports = pendingReports.filter(
        (report) =>
            report.priority === "High" ||
            report.priority === "Critical"
    );

    return (
        <div className="min-h-screen bg-background text-on-surface">
            <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-12">

                {/* ================= HEADER ================= */}

                <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                    <div>
                        <div className="mb-4 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                                <span className="material-symbols-outlined">
                                    admin_panel_settings
                                </span>
                            </div>

                            <span className="text-label-md uppercase text-primary">
                                Moderator Panel
                            </span>
                        </div>

                        <h1 className="font-montserrat text-headline-lg text-on-surface md:text-headline-xl">
                            Moderation Dashboard
                        </h1>

                        <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
                            Monitor submitted reports and manage
                            moderation activity from one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        disabled={loading}
                        className="career-secondary-button"
                    >
                        <span
                            className={`material-symbols-outlined ${
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
                </header>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-6 rounded-lg border border-secondary-fixed bg-white p-4 shadow-ambient">

                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-secondary">
                                <span className="material-symbols-outlined">
                                    error
                                </span>
                            </div>

                            <div>
                                <p className="font-semibold text-error">
                                    Unable to load dashboard
                                </p>

                                <p className="mt-1 text-body-sm text-on-surface-variant">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= STATISTICS ================= */}

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
                                "/moderator/reports"
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
                    />

                    <StatCard
                        icon="task_alt"
                        label="Resolved Reports"
                        value={
                            dashboard.resolved_reports
                        }
                        sublabel="Successfully resolved"
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

                {/* ================= MAIN CONTENT ================= */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                    {/* ================= REVIEW QUEUE ================= */}

                    <section className="career-card overflow-hidden">

                        <div className="flex flex-col gap-4 border-b border-outline-variant p-6 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                                        <span className="material-symbols-outlined">
                                            flag
                                        </span>
                                    </div>

                                    <h2 className="font-montserrat text-headline-md text-on-surface">
                                        Review Queue
                                    </h2>
                                </div>

                                <p className="mt-2 text-body-sm text-on-surface-variant">
                                    Pending and under-review
                                    reports requiring moderator
                                    attention.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/moderator/reports"
                                    )
                                }
                                className="career-ghost-button"
                            >
                                View all

                                <span className="material-symbols-outlined text-[18px]">
                                    arrow_forward
                                </span>
                            </button>
                        </div>

                        {loading ? (
                            <LoadingState />
                        ) : pendingReports.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="divide-y divide-outline-variant">

                                {pendingReports
                                    .slice(0, 6)
                                    .map((item) => (
                                        <ReportQueueItem
                                            key={item.id}
                                            item={item}
                                            onClick={() =>
                                                navigate(
                                                    `/moderator/reports/${item.id}`
                                                )
                                            }
                                        />
                                    ))}
                            </div>
                        )}
                    </section>

                    {/* ================= SUMMARY ================= */}

                    <aside className="career-card h-fit p-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                                <span className="material-symbols-outlined">
                                    bar_chart
                                </span>
                            </div>

                            <h2 className="font-montserrat text-headline-md text-on-surface">
                                Report Summary
                            </h2>
                        </div>

                        <p className="mt-3 text-body-sm leading-6 text-on-surface-variant">
                            Current moderation activity and
                            report status distribution.
                        </p>

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
                                    "/moderator/reports"
                                )
                            }
                            className="career-primary-button mt-6 w-full"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                manage_search
                            </span>

                            Manage Reports
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    );
}


/* =========================================================
   STAT CARD
========================================================= */

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
            className={`career-card career-card-hover flex items-center justify-between p-5 ${
                onClick
                    ? "cursor-pointer"
                    : "cursor-default"
            }`}
        >
            <div>

                <p className="text-label-sm uppercase text-outline">
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

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">

                <span className="material-symbols-outlined">
                    {icon}
                </span>

            </div>
        </button>
    );
}


/* =========================================================
   REPORT QUEUE ITEM
========================================================= */

function ReportQueueItem({
    item,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-surface-low"
        >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">

                <span className="material-symbols-outlined">
                    flag
                </span>

            </div>

            <div className="min-w-0 flex-1">

                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

                    <p className="truncate font-semibold text-on-surface">
                        {item.title ||
                            item.item_title ||
                            item.reason ||
                            `Report R00${item.id}`}
                    </p>

                    <div className="flex items-center gap-2">

                        <PriorityBadge
                            priority={
                                item.priority
                            }
                        />

                        <ReportStatusBadge
                            status={
                                item.status
                            }
                        />
                    </div>
                </div>

                <p className="mt-1 truncate text-body-sm text-on-surface-variant">
                    {item.description ||
                        item.status_reason ||
                        item.reason ||
                        "No description available."}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-label-sm text-outline">

                    {item.reported_job && (
                        <span>
                            Job{" "}
                            {item.reported_job}
                        </span>
                    )}

                    {item.reported_by && (
                        <span>
                            Submitted by{" "}
                            {typeof item.reported_by ===
                            "object"
                                ? item.reported_by
                                      .username ||
                                  item.reported_by
                                      .email
                                : item.reported_by}
                        </span>
                    )}

                    <span>
                        {item.created_at
                            ? new Date(
                                  item.created_at
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


/* =========================================================
   SUMMARY ROW
========================================================= */

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
            className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                styles[tone] || styles.default
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


/* =========================================================
   PRIORITY BADGE
========================================================= */

function PriorityBadge({
    priority,
}) {
    const styles = {
        Critical:
            "bg-secondary-fixed text-on-secondary-fixed-variant",

        High:
            "bg-secondary-fixed text-on-secondary-fixed-variant",

        Medium:
            "bg-tertiary-fixed text-on-tertiary-fixed-variant",

        Low:
            "bg-primary-fixed text-on-primary-fixed-variant",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm ${
                styles[priority] ||
                "bg-surface-container text-on-surface-variant"
            }`}
        >
            {priority || "Normal"}
        </span>
    );
}


/* =========================================================
   LOADING STATE
========================================================= */

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


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
    return (
        <div className="p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-primary-fixed text-primary">

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