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

  verifyOTP: async (email, otp, purpose) => {
    return await apiClient.post("/accounts/verify/otp/", { email, otp, purpose });
  },

  resetpassword: async (email, newpassword) => {
    return await apiClient.post("/accounts/reset/password/", {
      email,
      new_password: newpassword,
    });
  },

  sendDeleteOTP: async () => {
    return await apiClient.post("/accounts/delete/sendotp/", { purpose: "dav" });
  },

  deleteAccount: async (otp, purpose) => {
    return await apiClient.post("/accounts/pr/verify/otp/", { otp, purpose });
  },

  resendVerificationOTP: async (email, purpose) => {
    return await apiClient.post("/accounts/verify/resend/otp/", { email, purpose });
  },

  confirmPassword: async (password) => {
    return await apiClient.post("/accounts/verify/emailchange/password/", { password });
  },

  sendnewemailotp: async (email) => {
    return await apiClient.post("/accounts/send/emailchange/otp/", { email });
  },

  updateEmail: async (email) => {
    return await apiClient.put("/accounts/update/email/", { email });
  },
};

export default accountsApi;
