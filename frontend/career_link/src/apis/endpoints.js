export const MODERATOR_ENDPOINTS = {
    REPORTS: "/api/moderator/reports/",
    REPORT: (id) => `/api/moderator/reports/${id}/`,
    START_REVIEW: (id) =>
        `/api/moderator/reports/${id}/start_review/`,
    RESOLVE: (id) =>
        `/api/moderator/reports/${id}/resolve/`,
    REJECT: (id) =>
        `/api/moderator/reports/${id}/reject/`,
};