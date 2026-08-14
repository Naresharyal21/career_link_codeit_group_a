import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { RefreshCw } from "lucide-react";

import moderatorApi from "../../apis/moderatorApi";

const fallbackRows = [
    { id: "f1", type: "Job Post", submittedBy: "Prabin Corp", date: "Mar 11", priority: "High", reason: "Flagged Spam" },
    { id: "f2", type: "Company Profile", submittedBy: "Neo Tech Ltd", date: "Mar 11", priority: "Medium", reason: "Verification" },
    { id: "f3", type: "User Report", submittedBy: "Pooja Gurung", date: "Mar 10", priority: "Low", reason: "Harassment" },
    { id: "f4", type: "Job Post", submittedBy: "Kathmandu Arts", date: "Mar 10", priority: "Low", reason: "Incomplete" },
];

const flagBreakdown = [
    { label: "Inappropriate Content", value: 3, width: "23%" },
    { label: "Spam Listings", value: 5, width: "40%" },
    { label: "Fake Companies", value: 2, width: "17%" },
    { label: "Duplicate Posts", value: 4, width: "35%" },
];

function normalizeReason(report) {
    return report?.report_reason || report?.reason || "Unspecified";
}

function normalizeDescription(report) {
    return report?.report_description || report?.description || "";
}

function normalizeReporter(report) {
    const value = report?.reported_by || report?.reporter || report?.user;
    if (typeof value === "object" && value !== null) {
        return value.username || value.email || value.full_name || "Unknown user";
    }
    return value || "Unknown user";
}

function normalizeDate(report) {
    const raw = report?.reported_at || report?.created_at || report?.created;
    if (!raw) return "—";
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return String(raw).slice(0, 10);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function riskFromReport(report) {
    const text = `${normalizeReason(report)} ${normalizeDescription(report)}`.toLowerCase();
    if (text.includes("scam") || text.includes("fake") || text.includes("fraud")) return "High";
    if (text.includes("spam") || text.includes("misleading") || text.includes("salary")) return "Medium";
    return "Low";
}

function priorityClasses(priority) {
    if (priority === "High") return "bg-[#fff1f2] text-[#ef4444]";
    if (priority === "Medium") return "bg-[#fff7ed] text-[#f59e0b]";
    return "bg-[#ecfeff] text-[#00b4d8]";
}

function StatCard({ title, value, note, valueClass = "text-[#1a1a2e]" }) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border border-[#e2e8f0] bg-white p-5">
            <p className="truncate text-[13px] font-semibold text-[#64748b]">{title}</p>
            <p className={`text-[32px] font-extrabold leading-none ${valueClass}`}>{value}</p>
            <p className="truncate text-[11px] text-[#94a3b8]">{note}</p>
        </div>
    );
}

export default function ModeratorDashboard() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const loadReports = useCallback(async (refresh = false) => {
        try {
            setError("");
            if (refresh) setRefreshing(true);
            else setLoading(true);

            const data = await moderatorApi.getReports();
            const rows = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
            setReports(rows);
        } catch (err) {
            setReports([]);
            setError(err?.response?.data?.detail || err?.message || "Unable to load moderation reports.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const queueRows = useMemo(() => {
        if (!reports.length) return fallbackRows;

        return reports.slice(0, 4).map((report) => ({
            id: report.id,
            type: report.reported_job ? "Job Post" : "User Report",
            submittedBy: normalizeReporter(report),
            date: normalizeDate(report),
            priority: riskFromReport(report),
            reason: normalizeReason(report),
        }));
    }, [reports]);

    const visibleRows = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return queueRows;
        return queueRows.filter((row) =>
            [row.type, row.submittedBy, row.date, row.priority, row.reason]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [queueRows, searchTerm]);

    const queueCount = reports.length || 34;
    const reportedCount = reports.length || 12;
    const criticalCount = reports.filter((report) => riskFromReport(report) === "High").length || 12;

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Items in Review Queue" value={queueCount} note={`${criticalCount} critical priority`} />
                <StatCard title="Reported Content Tickets" value={reportedCount} note="8 resolved today" valueClass="text-[#ef4444]" />
                <StatCard title="Pending Job Approvals" value="8" note="SLA remaining: 4 hrs" valueClass="text-[#f59e0b]" />
                <StatCard title="Flagged Companies" value="5" note="Under moderation" valueClass="text-[#8b5cf6]" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,551px)_302px]">
                <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-none xl:p-[30px_0_24px_19px]">
                    <div className="flex items-center justify-between pr-5 xl:pr-0">
                        <h2 className="text-base font-extrabold text-[#1a1a2e]">Active Moderation Queue ({queueCount})</h2>
                        <button
                            type="button"
                            onClick={() => loadReports(true)}
                            disabled={refreshing}
                            className="rounded-lg p-2 text-[#64748b] transition hover:bg-[#f8fafc] disabled:opacity-50"
                            aria-label="Refresh moderation queue"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        </button>
                    </div>

                    <div className="mt-7 overflow-x-auto pr-5 xl:pr-0">
                        <div className="min-w-[680px]">
                            <div className="grid grid-cols-[1fr_106px_66px_82px_110px_60px] items-center rounded-lg bg-[#f8fafc] px-1.5 py-2.5 text-[12px] font-bold text-[#64748b]">
                                <span>Item Type</span>
                                <span>Submitted By</span>
                                <span>Date</span>
                                <span>Priority</span>
                                <span>Status Reason</span>
                                <span className="text-right">Actions</span>
                            </div>

                            {loading ? (
                                <div className="flex h-[240px] items-center justify-center text-sm text-[#94a3b8]">Loading moderation queue...</div>
                            ) : (
                                visibleRows.map((row) => (
                                    <div key={row.id} className="grid min-h-[56px] grid-cols-[1fr_106px_66px_82px_110px_60px] items-center border-x border-b border-[#f1f5f9] px-1 py-3 text-[13px]">
                                        <span className="truncate pr-2 font-bold text-[#1e293b]">{row.type}</span>
                                        <span className="truncate pr-2 text-[#64748b]">{row.submittedBy}</span>
                                        <span className="text-[#64748b]">{row.date}</span>
                                        <span>
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityClasses(row.priority)}`}>
                                                {row.priority}
                                            </span>
                                        </span>
                                        <span className="truncate pr-2 text-[#ef4444]">{row.reason}</span>
                                        <span className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => row.id?.startsWith("f") ? navigate("/moderator/reports") : navigate(`/moderator/reports/${row.id}`)}
                                                className="rounded-lg bg-[#00b4d8] px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-[#009bbb]"
                                            >
                                                Review
                                            </button>
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 mr-5 rounded-lg border border-[#fecaca] bg-[#fff7f7] px-4 py-3 text-xs text-[#b91c1c] xl:mr-0">
                            {error}
                        </div>
                    )}
                </section>

                <aside className="flex flex-col gap-7">
                    <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                        <h2 className="text-base font-extrabold text-[#1a1a2e]">Content Flags Breakdown</h2>
                        <div className="mt-4 space-y-3">
                            {flagBreakdown.map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-[#475569]">{item.label}</span>
                                        <span className="font-bold text-[#1e293b]">{item.value}</span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f1f5f9]">
                                        <div className="h-full rounded-full bg-[#ef4444]" style={{ width: item.width }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/moderator/reports")}
                            className="mt-5 w-full rounded-lg border border-[#94a3b8] bg-[#f1f1f1] px-4 py-2 text-sm font-medium text-[#1e293b] transition hover:bg-[#e2e8f0]"
                        >
                            Review All Flagged
                        </button>
                    </section>

                    <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                        <h2 className="text-base font-extrabold text-[#1a1a2e]">My Performance</h2>
                        <div className="mt-4 divide-y divide-[#e2e8f0]">
                            <div className="flex items-center justify-between py-2 text-sm">
                                <span className="text-[#64748b]">Today's Reviews</span>
                                <strong className="text-[#1e293b]">18 Items</strong>
                            </div>
                            <div className="flex items-center justify-between py-2 text-sm">
                                <span className="text-[#64748b]">Avg. Resolution Time</span>
                                <strong className="text-[#10b981]">2.5 hrs</strong>
                            </div>
                            <div className="flex items-center justify-between py-2 text-sm">
                                <span className="text-[#64748b]">SLA Resolution Rate</span>
                                <strong className="text-[#00b4d8]">94%</strong>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </section>
    );
}
