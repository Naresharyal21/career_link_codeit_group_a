export function formatReportId(id) {
    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return "R---";
    }

    return `R${String(id).padStart(3, "0")}`;
}