import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { RefreshCw } from "lucide-react";
import moderatorApi from "../../apis/moderatorApi";

function risk(report) {
    const text = `${report?.report_reason || ""} ${report?.report_description || ""}`.toLowerCase();
    if (/scam|fake|fraud/.test(text)) return "High";
    if (/spam|misleading|salary/.test(text)) return "Medium";
    return "Low";
}

function reporter(report) {
    const value = report?.reported_by;
    if (typeof value === "object" && value) return value.username || value.email || "Unknown user";
    return value || "Unknown user";
}

export default function ReviewQueuePage() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState("");

    const load = async (refresh = false) => {
        refresh ? setRefreshing(true) : setLoading(true);
        try {
            const data = await moderatorApi.getReports();
            setReports(Array.isArray(data) ? data : data?.results || []);
        } catch {
            setReports([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    const rows = useMemo(() => reports.filter((report) => {
        const text = [report.id, report.report_reason, report.status, reporter(report)].join(" ").toLowerCase();
        return !query || text.includes(query.toLowerCase());
    }), [query, reports]);

    return (
        <section>
            <div className="flex items-end justify-between">
                <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">Moderation</p><h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">Review Queue</h1><p className="mt-1 text-sm text-[#64748b]">Work through pending reports and move them through the moderation lifecycle.</p></div>
                <button type="button" onClick={() => load(true)} disabled={refreshing} className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-bold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh</button>
            </div>
            <div className="mt-7 rounded-2xl border border-[#e2e8f0] bg-white p-5">
                <div className="flex items-center gap-3"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports..." className="flex-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5 text-sm outline-none" /><span className="text-sm font-bold text-[#64748b]">{rows.length} pending items</span></div>
                <div className="mt-5 overflow-x-auto"><div className="min-w-[760px] overflow-hidden rounded-xl border border-[#e2e8f0]">
                    <div className="grid grid-cols-[90px_1.1fr_110px_100px_1fr_80px] bg-[#f8fafc] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#64748b]"><span>Type</span><span>Submitted By</span><span>Date</span><span>Priority</span><span>Reason</span><span>Action</span></div>
                    {loading ? <div className="px-6 py-16 text-center text-sm text-[#94a3b8]">Loading review queue...</div> : rows.map((report) => { const p = risk(report); return <div key={report.id} className="grid min-h-[62px] grid-cols-[90px_1.1fr_110px_100px_1fr_80px] items-center border-t border-[#f1f5f9] px-4 text-[13px]"><span className="font-bold">Job Post</span><span className="truncate text-[#64748b]">{reporter(report)}</span><span className="text-[#64748b]">{report.reported_at ? new Date(report.reported_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span><span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${p === "High" ? "bg-[#fff1f2] text-[#ef4444]" : p === "Medium" ? "bg-[#fff7ed] text-[#f59e0b]" : "bg-[#ecfeff] text-[#00b4d8]"}`}>{p}</span></span><span className="truncate text-[#64748b]">{report.report_reason || "Unspecified"}</span><button type="button" onClick={() => navigate(`/moderator/reports/${report.id}`)} className="rounded-lg bg-[#00b4d8] px-3 py-1.5 text-[12px] font-bold text-white">Review</button></div>; })}
                    {!loading && !rows.length && <div className="px-6 py-16 text-center text-sm text-[#94a3b8]">No reports found.</div>}
                </div></div>
            </div>
        </section>
    );
}
