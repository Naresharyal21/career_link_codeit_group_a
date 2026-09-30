import apiClient from "./apiClient";
import { MODERATOR_ENDPOINTS } from "./endpoints";

export const getDashboard = async () => {
    return apiClient.get(
        MODERATOR_ENDPOINTS.DASHBOARD
    );
};


export const getReports = async (params = {}) => {
    const query = new URLSearchParams(
        Object.entries(params).filter(
            ([, value]) =>
                value !== undefined && value !== null && value !== ""
        )
    ).toString();

    return apiClient.get(
        query
            ? `${MODERATOR_ENDPOINTS.REPORTS}?${query}`
            : MODERATOR_ENDPOINTS.REPORTS
    );
};


export const getReport = async (reportId) => {
    return apiClient.get(
        MODERATOR_ENDPOINTS.REPORT(reportId)
    );
};


export const createReport = async (
    reportData
) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.REPORTS,
        reportData
    );
};


export const updateReport = async (
    reportId,
    reportData
) => {
    return apiClient.patch(
        MODERATOR_ENDPOINTS.REPORT(reportId),
        reportData
    );
};


export const deleteReport = async (
    reportId
) => {
    return apiClient.delete(
        MODERATOR_ENDPOINTS.REPORT(reportId)
    );
};



export const startReview = async (
    reportId
) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.START_REVIEW(
            reportId
        )
    );
};


export const resolveReport = async (
    reportId
) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.RESOLVE(
            reportId
        )
    );
};


export const rejectReport = async (
    reportId
) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.REJECT(
            reportId
        )
    );
};



export const getJobApprovals = async (
    params = {}
) => {
    const query = new URLSearchParams(
        Object.entries(params).filter(
            ([, value]) =>
                value !== undefined && value !== null && value !== ""
        )
    ).toString();

    return apiClient.get(
        query
            ? `${MODERATOR_ENDPOINTS.JOB_APPROVALS}?${query}`
            : MODERATOR_ENDPOINTS.JOB_APPROVALS
    );
};


export const approveJob = async (
    approvalId
) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.APPROVE_JOB(
            approvalId
        )
    );
};


export const rejectJob = async (
    approvalId,
    rejectionReason = ""
) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.REJECT_JOB(
            approvalId
        ),
        {
            rejection_reason:
                rejectionReason,
        }
    );
};



const moderatorApi = {
    getDashboard,

    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,

    startReview,
    resolveReport,
    rejectReport,

    getJobApprovals,
    approveJob,
    rejectJob,
};

export default moderatorApi;