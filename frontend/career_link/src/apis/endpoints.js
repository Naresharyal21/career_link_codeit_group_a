export const MODERATOR_ENDPOINTS = {
    DASHBOARD:
        "/api/moderator/dashboard/",

    REPORTS:
        "/api/moderator/reports/",

    REPORT: (id) =>
        `/api/moderator/reports/${id}/`,

    START_REVIEW: (id) =>
        `/api/moderator/reports/${id}/review/`,

    RESOLVE: (id) =>
        `/api/moderator/reports/${id}/resolve/`,

    REJECT: (id) =>
        `/api/moderator/reports/${id}/reject/`,
};