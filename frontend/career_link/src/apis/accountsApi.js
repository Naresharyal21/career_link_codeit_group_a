import apiClient from "./apiClient";

import React from "react";

const accountsApi = {
  registr: (userData) => {
    return apiClient("/accounts/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: (credentials) => {
    return apiClient("/accounts/login/", {
      method: POST,
      body: JSON.stringify(credentials),
    });
  },

  refreshToken: (refresh) => {
    return apiClient("/accounts/login/refresh/", {
      method: "POST",
      body: JSON.stringify({
        refresh,
      }),
    });
  },

  getMe: () => {
    return accountsApi("/accounts/me/");
  },
};

export default accountsApi;
