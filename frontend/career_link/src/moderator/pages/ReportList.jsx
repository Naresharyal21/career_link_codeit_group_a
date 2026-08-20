import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CalendarDays,
    Eye,
    Flag,
    RefreshCw,
    Search,
    SlidersHorizontal,
    UserRound,
} from "lucide-react";

import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ReportStatusBadge from "../components/ReportStatusBadge";
import ModeratorSectionPage from "../components/ModeratorSectionPage";
import { useTheme } from "../../context/ThemeContext";

const ReportList = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { theme } = useTheme();
    const isDark = theme === "dark";
    
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("all");

  

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await moderatorApi.getReports();

            const data = Array.isArray(response)
                ? response
                : response?.results || [];

            setReports(data);
        } catch (err) {
            console.error(
                "Failed to load reports:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Failed to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    
  

    const getStatus = (report) =>
        report?.status ||
        report?.report_status ||
        "Pending";

    const getReporter = (report) => {
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
            "Unknown user"
        );
    };

    const getJobTitle = (report) => {
        if (
            typeof report?.reported_job === "object" &&
            report?.reported_job !== null
        ) {
            return (
                report.reported_job.title ||
                `Job #${report.reported_job.id}`
            );
        }

        return (
            report?.reported_job_title ||
            (report?.reported_job
                ? `Job #${report.reported_job}`
                : "Unknown job")
        );
    };

    const getReason = (report) =>
        report?.report_reason ||
        report?.reason ||
        "No reason provided";

    const getDate = (report) => {
        const value =
            report?.created_at ||
            report?.reported_at ||
            report?.created;

        if (!value) return "N/A";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "N/A";
        }

        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (name) => {
        if (!name) return "U";

        return String(name)
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };



    const summary = useMemo(() => {
        const values = reports.map((report) =>
            String(getStatus(report))
                .toLowerCase()
                .trim()
        );

        return {
            total: reports.length,

            pending: values.filter(
                (value) => value === "pending"
            ).length,

            review: values.filter(
                (value) =>
                    value === "under review" ||
                    value === "in review"
            ).length,

            resolved: values.filter(
                (value) => value === "resolved"
            ).length,

            rejected: values.filter(
                (value) => value === "rejected"
            ).length,
        };
    }, [reports]);



    const filteredReports = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return reports.filter((report) => {
            const status =
                String(getStatus(report))
                    .toLowerCase()
                    .trim();

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter;

            const searchable = [
                report?.id,
                report?.reported_job,
                report?.reported_job_title,
                report?.report_reason,
                report?.reason,
                getReporter(report),
                getJobTitle(report),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query ||
                searchable.includes(query);

            return (
                matchesStatus &&
                matchesSearch
            );
        });
    }, [
        reports,
        search,
        statusFilter,
    ]);



    const openReport = (id) => {
        navigate(
            `/moderator/reports/${id}`
        );
    };


    return (
        <ModeratorSectionPage
            title="Reports"
            description="Review reported job postings, investigate violations, and take appropriate moderation action."
            backLabel="Dashboard"
            backTo="/moderator"
        >


            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                    {
                        label: "Total Reports",
                        value: summary.total,
                        icon: Flag,
                        style:
                            "bg-[#F0ECFF] text-[#6D4AFF]",
                    },
                    {
                        label: "Pending",
                        value: summary.pending,
                        icon: RefreshCw,
                        style:
                            "bg-amber-50 text-amber-600",
                    },
                    {
                        label: "Under Review",
                        value: summary.review,
                        icon: Eye,
                        style:
                            "bg-blue-50 text-blue-600",
                    },
                    {
                        label: "Resolved",
                        value: summary.resolved,
                        icon: CalendarDays,
                        style:
                            "bg-emerald-50 text-emerald-600",
                    },
                    {
                        label: "Rejected",
                        value: summary.rejected,
                        icon: Flag,
                        style:
                            "bg-red-50 text-red-600",
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className={`rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                                isDark
                                    ? "border-slate-700 bg-[#172033]"
                                    : "border-[#E7E3F2] bg-white"
                            }`}
                            >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.style}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <span
                                    className={`text-2xl font-extrabold ${
                                        isDark ? "text-white" : "text-[#172033]"
                                    }`}
                                >
                                    {item.value}
                                </span>
                            </div>

                            <p
                                className={`mt-4 text-sm font-bold ${
                                    isDark ? "text-slate-300" : "text-[#344054]"
                                }`}
                            >
                                {item.label}
                            </p>
                        </div>
                    );
                })}
            </div>

         

            <div 
                className={`mb-6 rounded-2xl border p-5 shadow-sm transition-colors duration-300 ${
                        isDark
                            ? "border-slate-700 bg-[#172033]"
                            : "border-[#E7E3F2] bg-white"
                    }`}
                >
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0ECFF] text-[#6D4AFF]">
                        <SlidersHorizontal className="h-4 w-4" />
                    </div>

                    <div>
                        <h2
                            className={`text-sm font-extrabold ${
                                isDark ? "text-white" : "text-[#172033]"
                            }`}
                        >
                            Search & Filters
                        </h2>

                        <p className="text-xs text-[#98A2B3]">
                            Find reports quickly.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search report, job, reporter or reason..."
                            className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                                isDark
                                    ? "border-slate-700 bg-[#0f172a] text-white placeholder:text-slate-500"
                                    : "border-[#E4E7EC] bg-[#FCFBFF] text-[#344054]"
                            } focus:border-[#6D4AFF] focus:ring-4 focus:ring-[#6D4AFF]/10`}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition ${
                            isDark
                                ? "border-slate-700 bg-[#0f172a] text-slate-200"
                                : "border-[#E4E7EC] bg-[#FCFBFF] text-[#344054]"
                        } focus:border-[#6D4AFF] focus:ring-4 focus:ring-[#6D4AFF]/10`}
                        >
                        <option value="all">
                            All statuses
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="under review">
                            Under Review
                        </option>

                        <option value="resolved">
                            Resolved
                        </option>

                        <option value="rejected">
                            Rejected
                        </option>
                    </select>
                </div>
            </div>


            <div
                className={`overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300 ${
                    isDark
                        ? "border-slate-700 bg-[#172033]"
                        : "border-[#E7E3F2] bg-white"
                }`}
            >
                <div
                    className={`flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 ${
                        isDark
                            ? "border-slate-700"
                            : "border-[#F0EDF7]"
                    }`}
                >
                    <div>
                        <h2
                            className={`text-sm font-extrabold ${
                                isDark ? "text-white" : "text-[#172033]"
                            }`}
                        >
                            Report Queue
                        </h2>

                        <p className="mt-1 text-xs text-[#98A2B3]">
                            Showing{" "}
                            <span className="font-bold text-[#475467]">
                                {
                                    filteredReports.length
                                }
                            </span>{" "}
                            reports
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadReports}
                        disabled={loading}
                       className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition ${
                            isDark
                                ? "border-slate-700 bg-[#0f172a] text-slate-300 hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                                : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                        } disabled:opacity-50`}
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />
                        Refresh
                    </button>
                </div>

               
                {loading && (
                    <div className="flex flex-col items-center justify-center px-6 py-20">
                        <RefreshCw className="h-7 w-7 animate-spin text-[#6D4AFF]" />

                        <p
                            className={`mt-3 text-sm font-bold ${
                                isDark ? "text-slate-300" : "text-[#344054]"
                            }`}
                        >
                            Loading reports...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-sm font-bold text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadReports}
                            className="mt-4 rounded-lg bg-[#6D4AFF] px-4 py-2 text-sm font-bold text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

             
                {!loading &&
                    !error &&
                    filteredReports.length === 0 && (
                        <div className="px-6 py-20 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                <Flag className="h-5 w-5" />
                            </div>

                            <h3
                                className={`mt-4 text-sm font-extrabold ${
                                    isDark ? "text-white" : "text-[#172033]"
                                }`}
                            >
                                No reports found
                            </h3>

                            <p className="mt-1 text-sm text-[#98A2B3]">
                                Try changing your search or
                                status filter.
                            </p>
                        </div>
                    )}

              
                {!loading &&
                    !error &&
                    filteredReports.length > 0 && (
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full">
                                <thead>
                                    <tr
                                        className={`border-b ${
                                            isDark
                                                ? "border-slate-700 bg-[#1e293b]"
                                                : "border-[#F0EDF7] bg-[#FBFAFE]"
                                        }`}
                                    >
                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Report
                                        </th>

                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Reported Job
                                        </th>

                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Reported By
                                        </th>

                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Reason
                                        </th>

                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Date
                                        </th>

                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Status
                                        </th>

                                        <th className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider ${
                                            isDark ? "text-slate-400" : "text-[#667085]"
                                        }`}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredReports.map(
                                        (report) => {
                                            const reporter =
                                                getReporter(
                                                    report
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        report.id
                                                    }
                                                    className={`border-b transition ${
                                                        isDark
                                                            ? "border-slate-700 hover:bg-white/5"
                                                            : "border-[#F3F1F7] hover:bg-[#FCFBFF]"
                                                    }`}
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                                                <Flag className="h-4 w-4" />
                                                            </div>

                                                            <div>
                                                                <p
                                                                    className={`text-sm font-extrabold ${
                                                                        isDark ? "text-white" : "text-[#172033]"
                                                                    }`}
                                                                >
                                                                    Report 
                                                                    {
                                                                        report.id
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-xs text-[#98A2B3]">
                                                                    Moderation report
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <p
                                                            className={`max-w-[220px] truncate text-sm font-bold ${
                                                                isDark ? "text-slate-200" : "text-[#344054]"
                                                            }`}
                                                        >
                                                            {getJobTitle(
                                                                report
                                                            )}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0ECFF] text-[10px] font-extrabold text-[#6D4AFF]">
                                                                {getInitials(
                                                                    reporter
                                                                )}
                                                            </div>

                                                            <span
                                                                className={`max-w-[140px] truncate text-sm font-semibold ${
                                                                    isDark ? "text-slate-300" : "text-[#475467]"
                                                                }`}
                                                            >
                                                                {
                                                                    reporter
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ${
                                                                isDark
                                                                    ? "bg-slate-800 text-slate-300"
                                                                    : "bg-[#F8F7FC] text-[#475467]"
                                                            }`}
                                                        >
                                                            {getReason(
                                                                report
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm text-[#667085]">
                                                            <CalendarDays className="h-3.5 w-3.5 text-[#98A2B3]" />

                                                            {getDate(
                                                                report
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <ReportStatusBadge
                                                            status={getStatus(
                                                                report
                                                            )}
                                                        />
                                                    </td>

                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openReport(
                                                                    report.id
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-bold transition ${
                                                                isDark
                                                                    ? "border-slate-700 bg-[#0f172a] text-violet-400 hover:border-[#6D4AFF] hover:bg-violet-500/10"
                                                                    : "border-[#E4E7EC] bg-white text-[#6D4AFF] hover:border-[#6D4AFF] hover:bg-[#F5F2FF]"
                                                            }`}
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                
                {!loading &&
                    !error &&
                    filteredReports.length > 0 && (
                        <div className="divide-y divide-[#F0EDF7] lg:hidden">
                            {filteredReports.map(
                                (report) => {
                                    const reporter =
                                        getReporter(
                                            report
                                        );

                                    return (
                                        <div
                                            key={
                                                report.id
                                            }
                                            className="p-5"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D4AFF]">
                                                        <Flag className="h-4 w-4" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-extrabold text-[#172033]">
                                                            Report 
                                                            {
                                                                report.id
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#98A2B3]">
                                                            {
                                                                getDate(
                                                                    report
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <ReportStatusBadge
                                                    status={getStatus(
                                                        report
                                                    )}
                                                />
                                            </div>

                                            <div
                                                className={`mt-5 rounded-xl p-4 ${
                                                    isDark
                                                        ? "bg-[#0f172a]"
                                                        : "bg-[#FBFAFE]"
                                                }`}
                                            >
                                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                                                    Reported Job
                                                </p>

                                                <p
                                                    className={`mt-1 text-sm font-bold ${
                                                        isDark ? "text-slate-200" : "text-[#344054]"
                                                    }`}
                                                >
                                                    {getJobTitle(
                                                        report
                                                    )}
                                                </p>

                                                <div className="mt-4">
                                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                                                        Reported By
                                                    </p>

                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0ECFF] text-[10px] font-extrabold text-[#6D4AFF]">
                                                            {getInitials(
                                                                reporter
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`text-xs font-bold ${
                                                                isDark ? "text-slate-300" : "text-[#475467]"
                                                            }`}
                                                        >
                                                            {
                                                                reporter
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#98A2B3]">
                                                        Reason
                                                    </p>

                                                   <p
                                                        className={`mt-1 text-sm font-bold ${
                                                            isDark ? "text-slate-200" : "text-[#344054]"
                                                        }`}
                                                    >
                                                        {getReason(
                                                            report
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openReport(
                                                        report.id
                                                    )
                                                }
                                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5B21B6]"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Review Report
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
            </div>
        </ModeratorSectionPage>
    );
};

export default ReportList;