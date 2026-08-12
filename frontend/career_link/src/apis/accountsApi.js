import apiClient from "./apiClient";

const accountsApi = {
  register: async (userData) => {
    const formData = new FormData();
    console.log(userData)

    Object.keys(userData).forEach((key) => {
      const value = userData[key];

      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return await apiClient("/accounts/register/", {
      method: "POST",
      body: formData,
      
    });
  },

  login: async (credentials) => {
    return await apiClient("/accounts/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  },

  getMe: async () => {
    return await apiClient("/accounts/me/", {
      method: "GET",
    });
  },

  refreshToken: async (refresh) => {
    return await apiClient("/accounts/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh,
      }),
    });
  },
};

export default accountsApi;