import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";

const EMPTY_DASHBOARD = {
    stats: {
        review_queue: { count: 0, critical_priority: 0 },
        reported_content: { count: 0, resolved_today: 0 },
        pending_job_approvals: null,
        flagged_companies: null,
    },
    queue: [],
    content_flags: [],
    performance: {
        today_reviews: 0,
        average_resolution_minutes: null,
        sla_resolution_rate: null,
    },
    meta: { sla_hours: null },
};

export default function ModeratorDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await moderatorApi.getDashboard();

            setDashboard({
                stats: data?.stats ?? EMPTY_DASHBOARD.stats,
                queue: Array.isArray(data?.queue) ? data.queue : [],
                content_flags: Array.isArray(data?.content_flags)
                    ? data.content_flags
                    : [],
                performance: data?.performance ?? EMPTY_DASHBOARD.performance,
                meta: data?.meta ?? EMPTY_DASHBOARD.meta,
            });
        } catch (err) {
            console.error("Failed to load moderator dashboard:", err);

            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to load dashboard data."
            );

            setDashboard(EMPTY_DASHBOARD);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const { stats, queue, content_flags: contentFlags, performance } = dashboard;

    return (
        <div className="min-h-screen bg-[#FAF9FF] text-[#172033]">
            <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">

                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#6D4AFF]">
                                <span className="material-symbols-outlined text-[20px]">
                                    admin_panel_settings
                                </span>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#6D4AFF]">
                                Moderator Panel
                            </p>
                        </div>

                        <h1 className="font-['Montserrat'] text-3xl font-bold tracking-tight text-[#172033] md:text-4xl">
                            Moderation Dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-base leading-6 text-[#667085]">
                            Monitor submitted reports and manage moderation activity from one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7E3F2] bg-white px-5 py-3 text-sm font-bold text-[#6D4AFF] shadow-sm transition duration-200 hover:border-[#6D4AFF] hover:bg-[#F3F0FF] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
                            refresh
                        </span>
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-[#FFD6D6] bg-white p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F1] text-[#B7102A]">
                                <span className="material-symbols-outlined">error</span>
                            </div>
                            <div>
                                <p className="font-bold text-[#93000A]">Unable to load dashboard</p>
                                <p className="mt-1 text-sm text-[#667085]">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STATISTICS - now server-computed */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon="pending_actions"
                        label="Review Queue"
                        value={stats.review_queue.count}
                        sublabel={`${stats.review_queue.critical_priority} critical`}
                        onClick={() => navigate("/moderator/reports")}
                    />

                    <StatCard
                        icon="flag"
                        label="Total Reported Content"
                        value={stats.reported_content.count}
                        sublabel={`${stats.reported_content.resolved_today} resolved today`}
                    />

                    <StatCard
                        icon="task_alt"
                        label="Your Reviews Today"
                        value={performance.today_reviews}
                    />

                    <StatCard
                        icon="speed"
                        label="SLA Resolution Rate"
                        value={
                            performance.sla_resolution_rate !== null
                                ? `${performance.sla_resolution_rate}%`
                                : "—"
                        }
                        sublabel={
                            performance.average_resolution_minutes !== null
                                ? `avg ${performance.average_resolution_minutes} min`
                                : "No closed reports yet"
                        }
                    />
                </div>

                {/* MAIN GRID */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">

                    {/* REVIEW QUEUE (server-prioritized, not client re-sorted) */}
                    <section className="overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-[#E7E3F2] p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">
                                        <span className="material-symbols-outlined">flag</span>
                                    </div>
                                    <h2 className="font-['Montserrat'] text-xl font-bold text-[#172033]">
                                        Review Queue
                                    </h2>
                                </div>
                                <p className="mt-2 text-sm text-[#667085]">
                                    Pending &amp; under-review reports, highest priority first.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/moderator/reports")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[#6D4AFF] transition hover:bg-[#F3F0FF]"
                            >
                                View all
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center">
                                <span className="material-symbols-outlined animate-spin text-3xl text-[#6D4AFF]">
                                    progress_activity
                                </span>
                                <p className="mt-3 text-sm text-[#667085]">Loading queue...</p>
                            </div>
                        ) : queue.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">
                                    <span className="material-symbols-outlined text-2xl">inbox</span>
                                </div>
                                <p className="mt-4 font-bold text-[#172033]">Queue is empty</p>
                                <p className="mt-1 text-sm text-[#667085]">
                                    There are no reports awaiting review.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F0EDF7]">
                                {queue.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => navigate(`/moderator/reports/${item.id}`)}
                                        className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-[#FCFBFF]"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">
                                            <span className="material-symbols-outlined">flag</span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="font-bold text-[#172033]">
                                                    {item.item_title || `Report #${item.id}`}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <PriorityBadge priority={item.priority} />
                                                    <ReportStatusBadge status={item.status} />
                                                </div>
                                            </div>

                                            <p className="mt-1 truncate text-sm text-[#667085]">
                                                {item.status_reason}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#98A2B3]">
                                                <span>{item.item_type} #{item.item_id}</span>
                                                <span>Submitted by {item.submitted_by}</span>
                                                <span>
                                                    {item.date
                                                        ? new Date(item.date).toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="material-symbols-outlined shrink-0 text-[#98A2B3] transition group-hover:translate-x-1 group-hover:text-[#6D4AFF]">
                                            arrow_forward
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* CONTENT FLAGS BREAKDOWN */}
                    <aside className="h-fit rounded-2xl border border-[#E7E3F2] bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">
                                <span className="material-symbols-outlined">bar_chart</span>
                            </div>
                            <h2 className="font-['Montserrat'] text-xl font-bold text-[#172033]">
                                Report Reasons
                            </h2>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#667085]">
                            Breakdown of all reports by reason.
                        </p>

                        <div className="mt-6 space-y-4">
                            {contentFlags.length === 0 ? (
                                <p className="text-sm text-[#98A2B3]">No reports yet.</p>
                            ) : (
                                contentFlags.map((flag) => (
                                    <div key={flag.reason}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#667085]">{flag.reason}</span>
                                            <span className="font-bold text-[#172033]">
                                                {flag.count} ({flag.percentage}%)
                                            </span>
                                        </div>
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDEAF5]">
                                            <div
                                                className="h-full rounded-full bg-[#6D4AFF]"
                                                style={{ width: `${flag.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {(stats.pending_job_approvals === null ||
                            stats.flagged_companies === null) && (
                            <div className="mt-6 rounded-xl bg-[#FAF9FF] p-4">
                                <p className="text-xs leading-5 text-[#667085]">
                                    Job approvals and flagged-company metrics aren't
                                    tracked by the current data model yet.
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sublabel, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={`flex items-center justify-between rounded-2xl border border-[#E7E3F2] bg-white p-5 text-left shadow-sm transition duration-200 ${
                onClick
                    ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#D8D0F7] hover:shadow-md"
                    : "cursor-default"
            }`}
        >
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                    {label}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#172033]">{value}</p>
                {sublabel && (
                    <p className="mt-1 text-xs text-[#98A2B3]">{sublabel}</p>
                )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6D4AFF]">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </button>
    );
}

function PriorityBadge({ priority }) {
    const styles = {
        High: "bg-red-50 text-red-700 ring-red-100",
        Medium: "bg-amber-50 text-amber-700 ring-amber-100",
        Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                styles[priority] || "bg-slate-50 text-slate-700 ring-slate-100"
            }`}
        >
            {priority}
        </span>
    );
}