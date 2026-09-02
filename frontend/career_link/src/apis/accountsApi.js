import apiClient from "./apiClient";

const accountsApi = {
  register: async (userData) => {
    const formData = new FormData();

    Object.keys(userData).forEach((key) => {
      const value = userData[key];
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return await apiClient.post("/accounts/register/", formData);
  },

  login: async (credentials) => {
    return await apiClient.post("/accounts/login/", credentials);
  },

  getMe: async () => {
    return await apiClient.get("/accounts/me/");
  },

  refreshToken: async (refresh) => {
    return await apiClient.post("/accounts/token/refresh/", { refresh });
  },

  forgotpassword: async (email) => {
    return await apiClient.post("/accounts/forgot/password/", { email });
  },

  verifyOTP: async (email, otp) => {
    return await apiClient.post("/accounts/verify/otp/", { email, otp });
  },

  resetpassword: async (email, newpassword) => {
    return await apiClient.post("/accounts/reset/password/", {
      email,
      new_password: newpassword,
    });
  },
};

export default accountsApi;