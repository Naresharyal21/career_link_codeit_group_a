import apiClient from "./apiClient";

const accountsApi = {
  register: async (userData) => {
    const formData = new FormData();

    Object.keys(userData).forEach((key) => {
      const value = userData[key];

      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    return await apiClient.post("/accounts/register/", formData, {
      headers: {
     
        "Content-Type": undefined,
      },
    });
  },

  login: async (credentials) => {
    return await apiClient.post("/accounts/login/", credentials);
  },

  getMe: async () => {
    return await apiClient.get("/accounts/me/");
  },

  refreshToken: async (refresh) => {
      return await apiClient("/accounts/login/refresh/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              refresh,
          }),
      });
  },

  forgotpassword: async (email) => {
    return await apiClient.post("/accounts/forgot/password/", {
      email,
    });
  },

  verifyOTP: async (email, otp, purpose) => {
    return await apiClient.post("/accounts/verify/otp/", {
      email,
      otp,
      purpose,
    });
  },

  resetpassword: async (email, newpassword) => {
    return await apiClient.post("/accounts/reset/password/", {
      email,
      new_password: newpassword,
    });
  },
};

export default accountsApi;