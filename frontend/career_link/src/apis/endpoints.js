export const MODERATOR_ENDPOINTS = {

    DASHBOARD:
        "/reports/dashboard/",

    REPORTS:
        "/reports/",

    REPORT: (id) =>
        `/reports/${id}/`,

    START_REVIEW: (id) =>
        `/reports/${id}/review/`,

    RESOLVE: (id) =>
        `/reports/${id}/resolve/`,

    REJECT: (id) =>
        `/reports/${id}/reject/`,


    JOB_APPROVALS:
        "/reports/job-approvals/",

    APPROVE_JOB: (id) =>
        `/reports/job-approvals/${id}/approve/`,

    REJECT_JOB: (id) =>
        `/reports/job-approvals/${id}/reject/`,
};