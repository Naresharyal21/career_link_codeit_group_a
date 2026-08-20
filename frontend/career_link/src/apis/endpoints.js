export const MODERATOR_ENDPOINTS = {
    DASHBOARD:
        "/moderator/dashboard/",

    REPORTS:
        "/moderator/reports/",

    REPORT: (id) =>
        `/moderator/reports/${id}/`,

    START_REVIEW: (id) =>
        `/moderator/reports/${id}/review/`,

    RESOLVE: (id) =>
        `/moderator/reports/${id}/resolve/`,

    REJECT: (id) =>
        `/moderator/reports/${id}/reject/`,
};