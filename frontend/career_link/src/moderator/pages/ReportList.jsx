import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";


function getReporter(report) {
    if (typeof report?.reported_by === "object" && report.reported_by) {
        return (
            report.reported_by.username ||
            report.reported_by.email ||
            "Unknown user"
        );
    }

    return report?.reported_by || "Unknown user";
}


function getJobTitle(report) {
    if (typeof report?.reported_job === "object" && report.reported_job) {
        return (
            report.reported_job.title ||
            `Job #${report.reported_job.id || report.reported_job_id || "-"}`
        );
    }

    return report?.reported_job_title || `Job #${report?.reported_job || report?.reported_job_id || "-"}`;
}


function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}


function getPriority(reason = "") {
    const value = reason.toLowerCase();

    if (/scam|fake|fraud/.test(value)) {
        return "High";
    }

    if (/spam|misleading|salary/.test(value)) {
        return "Medium";
    }

    return "Low";
}


export default function ReportList() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const loadReports = async (refresh = false) => {
        if (refresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const data = await moderatorApi.getReports();

            setReports(
                Array.isArray(data)
                    ? data
                    : data?.results || []
            );
        } catch (error) {
            console.error("Failed to load reports:", error);
            setReports([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const filteredReports = useMemo(() => {
        const search = query.trim().toLowerCase();

        return reports.filter((report) => {
            const searchableText = [
                report.id,
                getJobTitle(report),
                getReporter(report),
                report.report_reason,
                report.report_description,
                report.status,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !search || searchableText.includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                report.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reports, query, statusFilter]);

    return (
        <section className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">
                        Moderation
                    </p>

                    <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">
                        Reports
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
                        Review reports submitted against job listings and track
                        their moderation status.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => loadReports(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-bold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/moderator/reports/create")
                        }
                        className="flex items-center gap-2 rounded-lg bg-[#00b4d8] px-4 py-2 text-sm font-bold text-white hover:bg-[#009bbb]"
                    >
                        <Plus className="h-4 w-4" />
                        Create Report
                    </button>
                </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[#e2e8f0] bg-white p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5">
                        <Search className="h-4 w-4 shrink-0 text-[#94a3b8]" />

                        <input
                            id="report-search"
                            name="report-search"
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder="Search reports..."
                            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94a3b8]"
                        />
                    </div>

                    <select
                        id="report-status"
                        name="report-status"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm outline-none"
                    >
                        <option value="All">All statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Under Review">
                            Under Review
                        </option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <div className="min-w-[950px] overflow-hidden rounded-xl border border-[#e2e8f0]">
                        <div className="grid grid-cols-[70px_1.2fr_1fr_120px_90px_120px_80px] bg-[#f8fafc] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                            <span>ID</span>
                            <span>Job Post</span>
                            <span>Reported By</span>
                            <span>Date</span>
                            <span>Priority</span>
                            <span>Status</span>
                            <span className="text-right">
                                Action
                            </span>
                        </div>

                        {loading && (
                            <div className="px-6 py-16 text-center text-sm text-[#94a3b8]">
                                Loading reports...
                            </div>
                        )}

                        {!loading &&
                            filteredReports.map((report) => {
                                const priority = getPriority(
                                    report.report_reason
                                );

                                return (
                                    <div
                                        key={report.id}
                                        className="grid min-h-[66px] grid-cols-[70px_1.2fr_1fr_120px_90px_120px_80px] items-center border-t border-[#f1f5f9] px-4 text-[13px]"
                                    >
                                        <span className="font-bold text-[#334155]">
                                            #{report.id}
                                        </span>

                                        <span className="truncate pr-3 font-bold text-[#1e293b]">
                                            {getJobTitle(report)}
                                        </span>

                                        <span className="truncate pr-3 text-[#64748b]">
                                            {getReporter(report)}
                                        </span>

                                        <span className="text-[#64748b]">
                                            {formatDate(
                                                report.reported_at
                                            )}
                                        </span>

                                        <span>
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                    priority === "High"
                                                        ? "bg-[#fff1f2] text-[#ef4444]"
                                                        : priority === "Medium"
                                                        ? "bg-[#fff7ed] text-[#f59e0b]"
                                                        : "bg-[#ecfeff] text-[#00a6c7]"
                                                }`}
                                            >
                                                {priority}
                                            </span>
                                        </span>

                                        <span>
                                            <ReportStatusBadge
                                                status={report.status}
                                            />
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/moderator/reports/${report.id}`
                                                )
                                            }
                                            className="justify-self-end rounded-lg bg-[#00b4d8] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#009bbb]"
                                        >
                                            View
                                        </button>
                                    </div>
                                );
                            })}

                        {!loading &&
                            !filteredReports.length && (
                                <div className="px-6 py-16 text-center text-sm text-[#94a3b8]">
                                    No reports found.
                                </div>
                            )}
                    </div>
                </div>

                <div className="mt-4 text-xs font-medium text-[#94a3b8]">
                    Showing {filteredReports.length} of {reports.length} reports
                </div>
            </div>
        </section>
    );
}