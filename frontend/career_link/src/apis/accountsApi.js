import apiClient from "./apiClient";

const accountsApi = {
    register: (userData) => {
        return apiClient.post("/accounts/register/", userData);
    },

    login: (credentials) => {
        return apiClient.post("/auth/token/", credentials);
    },

    refreshToken: (refresh) => {
        return apiClient.post("/auth/token/refresh/", {
            refresh,
        });
    },

    getMe: () => {
        return apiClient.get("/accounts/me/");
    },
};

export default accountsApi;