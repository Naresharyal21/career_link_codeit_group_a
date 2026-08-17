import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Check, Eye, Flag, MoreHorizontal, ShieldAlert } from "lucide-react";
import moderatorApi from "../../apis/moderatorApi";
import ModerationTablePage from "./ModerationTablePage";
import ReportStatusBadge from "../components/ReportStatusBadge";

const staticRows = {
    jobApprovals: [
        ["Senior Python Architect", "Aayulogic", "Mar 11", "High", "Awaiting review"],
        ["Digital Marketing Analyst", "Nimbus Nepal", "Mar 11", "Medium", "Category validation"],
        ["Senior Accountant Specialist", "KIST Bank", "Mar 10", "Low", "New submission"],
        ["Technical Writer Specialist", "Innovate Nepal", "Mar 10", "Low", "New submission"],
        ["Staff DevOps Engineer", "Yarsa Labs", "Mar 09", "Medium", "Missing salary"],
    ],
    companyReviews: [
        ["Neo Tech Ltd", "Priya Shah", "Mar 11", "High", "Verification"],
        ["Leapfrog Academy", "Ramesh Karki", "Mar 10", "Medium", "Company review"],
        ["Kathmandu Arts", "Sanjay Rai", "Mar 10", "Low", "Profile update"],
        ["Fusemachines", "Aarav Joshi", "Mar 09", "Low", "Review reported"],
    ],
    flaggedListings: [
        ["Frontend UI Developer", "Neo Tech Ltd", "Mar 11", "High", "Spam listing"],
        ["Data Entry Specialist", "QuickHire Nepal", "Mar 10", "High", "Suspicious salary"],
        ["Marketing Intern", "Kathmandu Arts", "Mar 10", "Medium", "Duplicate post"],
        ["Remote Assistant", "Acme Nepal", "Mar 09", "Low", "Incomplete details"],
    ],
};

function mapRows(values) {
    return values.map((row, index) => ({ id: `${row[0]}-${index}`, item: row[0], submittedBy: row[1], date: row[2], priority: row[3], reason: row[4] }));
}

export function JobApprovalsPage() {
    return <ModerationTablePage title="Job Approvals" description="Review new job postings before they become visible to job seekers." count={8} rows={mapRows(staticRows.jobApprovals)} actionLabel="Approve" />;
}

export function CompanyReviewsPage() {
    return <ModerationTablePage title="Company Reviews" description="Moderate employer reviews and company profile content for quality and policy compliance." count={5} rows={mapRows(staticRows.companyReviews)} actionLabel="Review" />;
}

export function FlaggedListingsPage() {
    return <ModerationTablePage title="Flagged Listings" description="Inspect job listings that have been flagged for spam, duplication, misleading information, or other issues." count={12} rows={mapRows(staticRows.flaggedListings)} actionLabel="Inspect" />;
}

function ReportPage({ mode }) {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        let mounted = true;
        moderatorApi.getReports().then((data) => {
            if (mounted) setReports(Array.isArray(data) ? data : data?.results || []);
        }).catch(() => {
            if (mounted) setReports([]);
        });
        return () => { mounted = false; };
    }, []);

    const rows = useMemo(() => {
        const fallback = [
            { id: "f1", item: "Job Post", submittedBy: "Prabin Corp", date: "Mar 11", priority: "High", reason: "Flagged Spam" },
            { id: "f2", item: "Company Profile", submittedBy: "Neo Tech Ltd", date: "Mar 11", priority: "Medium", reason: "Verification" },
            { id: "f3", item: "User Report", submittedBy: "Pooja Gurung", date: "Mar 10", priority: "Low", reason: "Harassment" },
            { id: "f4", item: "Job Post", submittedBy: "Kathmandu Arts", date: "Mar 10", priority: "Low", reason: "Incomplete" },
        ];
        if (!reports.length) return fallback;
        return reports.map((report) => ({
            id: report.id,
            item: report.reported_job ? "Job Post" : "User Report",
            submittedBy: typeof report.reported_by === "object" ? (report.reported_by.username || report.reported_by.email || "Unknown user") : (report.reported_by || "Unknown user"),
            date: report.reported_at ? new Date(report.reported_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
            priority: /scam|fake|fraud/i.test(report.report_reason || "") ? "High" : /spam|misleading|salary/i.test(report.report_reason || "") ? "Medium" : "Low",
            reason: report.report_reason || report.status || "Unspecified",
        }));
    }, [reports]);

    const title = mode === "reported" ? "Reported Content" : "User Reports";
    const description = mode === "reported" ? "Review content that has been reported by members of the CareerLink community." : "Handle user-submitted reports and track moderation outcomes.";

    return (
        <section className="w-full">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">Moderation</p>
                    <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">{title}</h1>
                    <p className="mt-1 max-w-2xl text-sm text-[#64748b]">{description}</p>
                </div>
                <button type="button" onClick={() => navigate("/moderator/review-queue")} className="hidden items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-bold text-[#334155] hover:bg-[#f8fafc] sm:flex"><ArrowLeft className="h-4 w-4" /> Queue</button>
            </div>

            <div className="mt-7">
                <ModerationTablePage title="" description="" count={rows.length} rows={rows} actionLabel="Review" />
            </div>
        </section>
    );
}

export function ReportedContentPage() { return <ReportPage mode="reported" />; }
export function UserReportsPage() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All");

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await moderatorApi.getReports();

            const reportsData = Array.isArray(data)
                ? data
                : data?.results || [];

            setReports(reportsData);
        } catch (err) {
            console.error("Failed to load user reports:", err);

            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Unable to load user reports."
            );

            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const filteredReports = useMemo(() => {
        const searchText = query.trim().toLowerCase();

        return reports.filter((report) => {
            const matchesStatus =
                status === "All" ||
                report.status === status;

            if (!searchText) {
                return matchesStatus;
            }

            const searchableText = [
                report.id,
                report.report_reason,
                report.report_description,
                report.reported_by,
                report.reviewed_by,
                report.reported_job,
                report.status,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLowerCase();

            return (
                matchesStatus &&
                searchableText.includes(searchText)
            );
        });
    }, [reports, query, status]);

    const getReporterName = (report) => {
        if (
            typeof report.reported_by === "object" &&
            report.reported_by !== null
        ) {
            return (
                report.reported_by.username ||
                report.reported_by.email ||
                "Unknown user"
            );
        }

        return report.reported_by || "Unknown user";
    };

    const getDate = (report) => {
        if (!report.reported_at) {
            return "—";
        }

        return new Date(
            report.reported_at
        ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const clearFilters = () => {
        setQuery("");
        setStatus("All");
    };

    return (
        <section className="w-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">
                        Moderation
                    </p>

                    <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">
                        User Reports
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
                        Handle user-submitted reports and track moderation
                        outcomes.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadReports}
                    disabled={loading}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-bold text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Filters */}
            <div className="mt-7 rounded-2xl border border-[#e2e8f0] bg-white p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="flex flex-1 items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3">
                        <input
                            id="user-report-search"
                            name="user-report-search"
                            type="search"
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder="Search reports, users, reasons..."
                            className="w-full bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-[#94a3b8]"
                        />
                    </div>

                    <select
                        id="user-report-status"
                        name="user-report-status"
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                        className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] outline-none lg:w-48"
                    >
                        <option value="All">
                            All statuses
                        </option>
                        <option value="Pending">
                            Pending
                        </option>
                        <option value="Under Review">
                            Under Review
                        </option>
                        <option value="Resolved">
                            Resolved
                        </option>
                        <option value="Rejected">
                            Rejected
                        </option>
                    </select>

                    {(query || status !== "All") && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-bold text-[#64748b] hover:bg-[#f8fafc]"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Count */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-[#64748b]">
                        Showing{" "}
                        <span className="font-bold text-[#1e293b]">
                            {filteredReports.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-[#1e293b]">
                            {reports.length}
                        </span>{" "}
                        reports
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fff7f7] px-5 py-4">
                    <p className="text-sm font-semibold text-[#b91c1c]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadReports}
                        className="mt-2 text-sm font-bold text-[#b91c1c] underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
                {loading ? (
                    <div className="px-6 py-20 text-center">
                        <p className="text-sm font-medium text-[#64748b]">
                            Loading user reports...
                        </p>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="px-6 py-20 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfeff] text-[#00a6c7]">
                            <Flag className="h-5 w-5" />
                        </div>

                        <h2 className="mt-4 text-sm font-extrabold text-[#1e293b]">
                            No user reports found
                        </h2>

                        <p className="mt-1 text-sm text-[#94a3b8]">
                            {query || status !== "All"
                                ? "Try changing your search or filters."
                                : "There are currently no submitted reports."}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[850px]">
                                <thead>
                                    <tr className="bg-[#f8fafc]">
                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Report
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Reported By
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Job
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Submitted
                                        </th>

                                        <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="border-t border-[#f1f5f9] transition hover:bg-[#f8fafc]"
                                        >
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfeff] text-[#00a6c7]">
                                                        <Flag className="h-4 w-4" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-bold text-[#1e293b]">
                                                            Report #{report.id}
                                                        </p>

                                                        <p className="mt-1 max-w-[220px] truncate text-sm text-[#64748b]">
                                                            {report.report_reason ||
                                                                "No reason provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-5 text-sm font-medium text-[#475569]">
                                                {getReporterName(report)}
                                            </td>

                                            <td className="px-5 py-5 text-sm text-[#64748b]">
                                                {report.reported_job
                                                    ? `Job #${report.reported_job}`
                                                    : "—"}
                                            </td>

                                            <td className="px-5 py-5">
                                                <ReportStatusBadge
                                                    status={
                                                        report.status
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-5 text-sm text-[#64748b]">
                                                {getDate(report)}
                                            </td>

                                            <td className="px-5 py-5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/moderator/reports/${report.id}`
                                                        )
                                                    }
                                                    className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition hover:border-[#00b4d8] hover:text-[#00a6c7]"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="divide-y divide-[#f1f5f9] md:hidden">
                            {filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfeff] text-[#00a6c7]">
                                                <Flag className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1e293b]">
                                                    Report #{report.id}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-[#64748b]">
                                                    {report.report_reason ||
                                                        "No reason provided"}
                                                </p>
                                            </div>
                                        </div>

                                        <ReportStatusBadge
                                            status={
                                                report.status
                                            }
                                        />
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#94a3b8]">
                                                Reported by
                                            </span>

                                            <span className="font-semibold text-[#334155]">
                                                {getReporterName(report)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#94a3b8]">
                                                Job
                                            </span>

                                            <span className="font-semibold text-[#334155]">
                                                {report.reported_job
                                                    ? `#${report.reported_job}`
                                                    : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#94a3b8]">
                                                Submitted
                                            </span>

                                            <span className="font-semibold text-[#334155]">
                                                {getDate(report)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/moderator/reports/${report.id}`
                                            )
                                        }
                                        className="mt-5 w-full rounded-lg bg-[#00b4d8] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#009bbb]"
                                    >
                                        View Report
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export function ActivityLogPage() {
    const activities = [
        ["Report resolved", "Priya Thapa resolved a spam listing report.", "10 mins ago"],
        ["Company verification updated", "Neo Tech Ltd was moved to Under Review.", "30 mins ago"],
        ["Job approval reviewed", "Senior Python Architect was approved.", "1 hour ago"],
        ["User report opened", "Harassment report #1048 was assigned to moderation.", "2 hours ago"],
        ["Listing flagged", "System flagged a duplicate job post.", "3 hours ago"],
    ];
    return (
        <section>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">Moderation</p>
            <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">Activity Log</h1>
            <p className="mt-1 text-sm text-[#64748b]">A chronological record of moderation actions and system events.</p>
            <div className="mt-7 rounded-2xl border border-[#e2e8f0] bg-white p-6">
                <div className="space-y-0">
                    {activities.map(([title, text, time], index) => (
                        <div key={title} className="relative flex gap-4 border-b border-[#f1f5f9] py-5 last:border-0">
                            <div className="relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ecfeff] text-[#00a6c7]"><ShieldAlert className="h-4 w-4" /></div>
                            <div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-sm font-extrabold text-[#1e293b]">{title}</h2><span className="text-[11px] text-[#94a3b8]">{time}</span></div><p className="mt-1 text-sm text-[#64748b]">{text}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
