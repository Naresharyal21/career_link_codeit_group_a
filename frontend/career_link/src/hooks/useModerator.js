import apiClient from "./apiClient";
import { MODERATOR_ENDPOINTS } from "./endpoints";

export const getReports = async () => {
    return apiClient.get(
        MODERATOR_ENDPOINTS.REPORTS
    );
};

export const getReport = async (reportId) => {
    return apiClient.get(
        MODERATOR_ENDPOINTS.REPORT(reportId)
    );
};

export const createReport = async (reportData) => {
    return apiClient.post(
        MODERATOR_ENDPOINTS.REPORTS,
        reportData
    );
};

export const updateReport = async (
    reportId,
    reportData
) => {
    return apiClient.put(
        MODERATOR_ENDPOINTS.REPORT(reportId),
        reportData
    );
};

export const deleteReport = async (reportId) => {
    return apiClient.delete(
        MODERATOR_ENDPOINTS.REPORT(reportId)
    );
};

export const startReview = async (reportId) => {
    return apiClient.post(
        `${MODERATOR_ENDPOINTS.REPORT(reportId)}start_review/`
    );
};

export const resolveReport = async (reportId) => {
    return apiClient.post(
        `${MODERATOR_ENDPOINTS.REPORT(reportId)}resolve/`
    );
};

export const rejectReport = async (reportId) => {
    return apiClient.post(
        `${MODERATOR_ENDPOINTS.REPORT(reportId)}reject/`
    );
};

const moderatorApi = {
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,
    startReview,
    resolveReport,
    rejectReport,
};

export default moderatorApi;