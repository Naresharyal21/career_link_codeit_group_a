const statusStyles = {
    Pending:
        "bg-tertiary-fixed text-on-tertiary-fixed-variant",

    "Under Review":
        "bg-primary-fixed text-on-primary-fixed-variant",

    Resolved:
        "bg-[#D9F2DF] text-[#17652D]",

    Rejected:
        "bg-secondary-fixed text-on-secondary-fixed-variant",
};

export default function ReportStatusBadge({
    status,
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm ${
                statusStyles[status] ||
                "bg-surface-container text-on-surface-variant"
            }`}
        >
            {status || "Unknown"}
        </span>
    );
}