const statusStyles = {
    Pending: "bg-[#ffdea9] text-[#634500]",
    "Under Review": "bg-[#d2e4ff] text-[#00355f]",
    Resolved: "bg-[#d9f2df] text-[#17652d]",
    Rejected: "bg-[#ffdad6] text-[#93000a]",
};

export default function ReportStatusBadge({ status }) {
    const style =
        statusStyles[status] ||
        "bg-[#e6eeff] text-[#00355f]";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status || "Pending"}
        </span>
    );
}