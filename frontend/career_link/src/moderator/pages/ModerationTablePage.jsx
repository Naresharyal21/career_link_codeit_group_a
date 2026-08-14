import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const defaultColumns = ["Item", "Submitted By", "Date", "Priority", "Reason"];

function priorityClasses(priority) {
    if (priority === "High") return "bg-[#fff1f2] text-[#ef4444]";
    if (priority === "Medium") return "bg-[#fff7ed] text-[#f59e0b]";
    if (priority === "Resolved") return "bg-[#ecfdf5] text-[#16a34a]";
    return "bg-[#ecfeff] text-[#00b4d8]";
}

export default function ModerationTablePage({
    eyebrow = "Moderation",
    title,
    description,
    count,
    rows,
    columns = defaultColumns,
    actionLabel = "Review",
    emptyText = "No items match the current filters.",
}) {
    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("All");

    const filteredRows = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rows.filter((row) => {
            const text = Object.values(row).join(" ").toLowerCase();
            const matchesQuery = !q || text.includes(q);
            const matchesPriority = priority === "All" || row.priority === priority;
            return matchesQuery && matchesPriority;
        });
    }, [priority, query, rows]);

    return (
        <section className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">{eyebrow}</p>
                    <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">{title}</h1>
                    <p className="mt-1 max-w-2xl text-sm text-[#64748b]">{description}</p>
                </div>
                <div className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-bold text-[#1a1a2e]">
                    {count ?? rows.length} items
                </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[#e2e8f0] bg-white p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5">
                        <Search className="h-4 w-4 text-[#94a3b8]" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search this moderation page..."
                            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94a3b8]"
                        />
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 lg:w-52">
                        <SlidersHorizontal className="h-4 w-4 text-[#64748b]" />
                        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="w-full bg-transparent text-sm outline-none">
                            <option value="All">All priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <div className="min-w-[760px] overflow-hidden rounded-xl border border-[#e2e8f0]">
                        <div className="grid grid-cols-[1.2fr_1fr_100px_100px_1fr_90px] bg-[#f8fafc] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                            {columns.map((column) => <span key={column}>{column}</span>)}
                            <span className="text-right">Actions</span>
                        </div>
                        {filteredRows.map((row) => (
                            <div key={row.id} className="grid min-h-[62px] grid-cols-[1.2fr_1fr_100px_100px_1fr_90px] items-center border-t border-[#f1f5f9] px-4 text-[13px]">
                                <span className="font-bold text-[#1e293b]">{row.item}</span>
                                <span className="truncate pr-2 text-[#64748b]">{row.submittedBy}</span>
                                <span className="text-[#64748b]">{row.date}</span>
                                <span><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityClasses(row.priority)}`}>{row.priority}</span></span>
                                <span className="truncate pr-2 text-[#64748b]">{row.reason}</span>
                                <button type="button" className="justify-self-end rounded-lg bg-[#00b4d8] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#009bbb]">{actionLabel}</button>
                            </div>
                        ))}
                        {!filteredRows.length && (
                            <div className="px-6 py-16 text-center text-sm text-[#94a3b8]">{emptyText}</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
