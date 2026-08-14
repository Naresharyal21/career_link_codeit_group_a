import apiClient from "./apiClient";

const accountsApi = {
    register: (userData) => {
        return apiClient.post("/accounts/register/", userData);
    },

    login: (credentials) => {
        return apiClient.post("/api/token/", credentials);
    },

    refreshToken: (refresh) => {
        return apiClient.post("/api/token/refresh/", {
            refresh,
        });
    },
};

export default accountsApi;