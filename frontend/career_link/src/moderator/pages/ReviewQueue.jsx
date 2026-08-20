import React, { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Clock3,
    Flag,
    RefreshCw,
    ShieldAlert,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ModeratorSectionPage from "../components/ModeratorSectionPage";

const ReviewQueue = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadQueue = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await moderatorApi.getReports();

            const reportData = Array.isArray(data)
                ? data
                : data?.results || [];

            setReports(reportData);
        } catch (err) {
            console.error("Failed to load review queue:", err);

            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Unable to load the review queue."
            );

            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const pendingReports = useMemo(() => {
        return reports.filter((report) => {
            const status = String(
                report.status || ""
            ).toLowerCase();

            return (
                status === "pending" ||
                status === "under review"
            );
        });
    }, [reports]);

    const queueItems = useMemo(() => {
        const items = [];

        pendingReports.forEach((report) => {
            const reason = String(
                report.report_reason || ""
            ).toLowerCase();

            let priority = "Low";

            if (
                /scam|fake|fraud|harassment|abuse/.test(
                    reason
                )
            ) {
                priority = "High";
            } else if (
                /spam|misleading|duplicate|salary/.test(
                    reason
                )
            ) {
                priority = "Medium";
            }

            items.push({
                id: report.id,
                type: report.reported_job
                    ? "User Report"
                    : "Reported Content",
                title: report.report_reason ||
                    "Reported content",
                submittedBy:
                    typeof report.reported_by === "object"
                        ? (
                              report.reported_by.username ||
                              report.reported_by.email ||
                              "Unknown user"
                          )
                        : report.reported_by ||
                          "Unknown user",
                date: report.reported_at
                    ? new Date(
                          report.reported_at
                      ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                    : "—",
                priority,
                status: report.status || "Pending",
            });
        });

        return items;
    }, [pendingReports]);

    const highPriority = queueItems.filter(
        (item) => item.priority === "High"
    ).length;

    const mediumPriority = queueItems.filter(
        (item) => item.priority === "Medium"
    ).length;

    const lowPriority = queueItems.filter(
        (item) => item.priority === "Low"
    ).length;

    const priorityClasses = {
        High: "border-red-100 bg-red-50 text-red-700",
        Medium: "border-amber-100 bg-amber-50 text-amber-700",
        Low: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };

    const typeIcon = {
        "User Report": Flag,
        "Reported Content": ShieldAlert,
    };

    return (
        <ModeratorSectionPage
            title="Review Queue"
            description="Review pending moderation items and prioritize actions that require moderator attention."
            backLabel="Dashboard"
            backTo="/moderator"
            action={
                <button
                    type="button"
                    onClick={loadQueue}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-bold text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />

                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            }
        >

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <QueueStat
                    icon={Clock3}
                    label="Pending Review"
                    value={queueItems.length}
                    description="Items waiting for action"
                />

                <QueueStat
                    icon={AlertTriangle}
                    label="High Priority"
                    value={highPriority}
                    description="Requires attention"
                />

                <QueueStat
                    icon={ShieldAlert}
                    label="Medium Priority"
                    value={mediumPriority}
                    description="Needs review"
                />

                <QueueStat
                    icon={Flag}
                    label="Low Priority"
                    value={lowPriority}
                    description="Standard review"
                />
            </div>

   
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <QueueSectionCard
                    icon={BriefcaseBusiness}
                    title="Job Approvals"
                    description="Review newly submitted job postings."
                    count={8}
                    onClick={() =>
                        navigate(
                            "/moderator/job-approvals"
                        )
                    }
                />

                <QueueSectionCard
                    icon={Building2}
                    title="Company Reviews"
                    description="Review employer profiles and verification requests."
                    count={5}
                    onClick={() =>
                        navigate(
                            "/moderator/company-reviews"
                        )
                    }
                />

                <QueueSectionCard
                    icon={Flag}
                    title="Flagged Listings"
                    description="Inspect listings flagged by users or the system."
                    count={12}
                    onClick={() =>
                        navigate(
                            "/moderator/flagged-listings"
                        )
                    }
                />
            </div>


            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                    <p className="text-sm font-semibold text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadQueue}
                        className="mt-2 text-sm font-bold text-red-700 underline"
                    >
                        Try again
                    </button>
                </div>
            )}


            <div className="mt-6 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#f1f5f9] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-extrabold text-[#1e293b]">
                            Items Requiring Review
                        </h2>

                        <p className="mt-1 text-sm text-[#64748b]">
                            Pending moderation items from the current queue.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/moderator/reports"
                            )
                        }
                        className="inline-flex items-center gap-2 self-start rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition hover:border-[#00b4d8] hover:text-[#00a6c7]"
                    >
                        View All Reports
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>

                {loading ? (
                    <div className="px-6 py-20 text-center">
                        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#00a6c7]" />

                        <p className="mt-3 text-sm font-medium text-[#64748b]">
                            Loading review queue...
                        </p>
                    </div>
                ) : queueItems.length === 0 ? (
                    <div className="px-6 py-20 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <ShieldAlert className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-extrabold text-[#1e293b]">
                            Queue is clear
                        </h3>

                        <p className="mt-1 text-sm text-[#94a3b8]">
                            There are no pending reports requiring review.
                        </p>
                    </div>
                ) : (
                    <>
                        
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[850px]">
                                <thead>
                                    <tr className="bg-[#f8fafc]">
                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Item
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Submitted By
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Submitted
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Priority
                                        </th>

                                        <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {queueItems.map((item) => {
                                        const Icon =
                                            typeIcon[
                                                item.type
                                            ] || Flag;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-t border-[#f1f5f9] transition hover:bg-[#f8fafc]"
                                            >
                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfeff] text-[#00a6c7]">
                                                            <Icon className="h-4 w-4" />
                                                        </div>

                                                        <div>
                                                            <p className="font-bold text-[#1e293b]">
                                                                {
                                                                    item.title
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#94a3b8]">
                                                                {
                                                                    item.type
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 text-sm font-medium text-[#475569]">
                                                    {
                                                        item.submittedBy
                                                    }
                                                </td>

                                                <td className="px-5 py-5 text-sm text-[#64748b]">
                                                    {
                                                        item.date
                                                    }
                                                </td>

                                                <td className="px-5 py-5">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${priorityClasses[item.priority]}`}
                                                    >
                                                        {
                                                            item.priority
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/moderator/reports/${item.id}`
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#00b4d8] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#009bbb]"
                                                    >
                                                        Review
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        
                        <div className="divide-y divide-[#f1f5f9] md:hidden">
                            {queueItems.map((item) => {
                                const Icon =
                                    typeIcon[
                                        item.type
                                    ] || Flag;

                                return (
                                    <div
                                        key={item.id}
                                        className="p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfeff] text-[#00a6c7]">
                                                    <Icon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-[#1e293b]">
                                                        {
                                                            item.title
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#64748b]">
                                                        {
                                                            item.type
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${priorityClasses[item.priority]}`}
                                            >
                                                {
                                                    item.priority
                                                }
                                            </span>
                                        </div>

                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-[#94a3b8]">
                                                    Submitted by
                                                </span>

                                                <span className="font-semibold text-[#334155]">
                                                    {
                                                        item.submittedBy
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-[#94a3b8]">
                                                    Submitted
                                                </span>

                                                <span className="font-semibold text-[#334155]">
                                                    {
                                                        item.date
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/moderator/reports/${item.id}`
                                                )
                                            }
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00b4d8] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#009bbb]"
                                        >
                                            Review Report
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </ModeratorSectionPage>
    );
};

const QueueStat = ({
    icon: Icon,
    label,
    value,
    description,
}) => {
    return (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfeff] text-[#00a6c7]">
                    <Icon className="h-5 w-5" />
                </div>

                <span className="text-2xl font-extrabold text-[#1e293b]">
                    {value}
                </span>
            </div>

            <h3 className="mt-4 text-sm font-extrabold text-[#334155]">
                {label}
            </h3>

            <p className="mt-1 text-xs text-[#94a3b8]">
                {description}
            </p>
        </div>
    );
};

const QueueSectionCard = ({
    icon: Icon,
    title,
    description,
    count,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#bae6fd] hover:shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfeff] text-[#00a6c7]">
                    <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-bold text-[#475569]">
                    {count}
                </span>
            </div>

            <h3 className="mt-4 text-sm font-extrabold text-[#1e293b]">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-[#64748b]">
                {description}
            </p>

            <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#00a6c7]">
                Open section
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </div>
        </button>
    );
};

export default ReviewQueue;