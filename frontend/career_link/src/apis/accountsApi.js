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

  sendDeleteOTP:async(otp , purpose)=>{
    return await apiClient("/accounts/delete/sendotp/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        
      },
      body:JSON.stringify({
       
        
        purpose:"dav",
      }),
    });
  },


  deleteAccount:async(otp , purpose)=>{
    return await apiClient("/accounts/pr/verify/otp/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        
      },
      body:JSON.stringify({
    
        otp,
        purpose,
      }),
    });
  },
  resendVerificationOTP:async(email, purpose)=>{
    return await apiClient("/accounts/verify/resend/otp/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        
        
      },
      body:JSON.stringify({
    
        email,
        purpose,
      }),
    });
  },
  confirmPassword:async( password)=>{
    return await apiClient("/accounts/verify/emailchange/password/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        
        
      },
      body:JSON.stringify({
    
        
        password,
      }),
    });
  },
  sendnewemailotp:async( email)=>{
    return await apiClient("/accounts/send/emailchange/otp/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        
        
      },
      body:JSON.stringify({
    
        
        email,
      }),
    });
  },
  updateEmail:async( email)=>{
    return await apiClient("/accounts/update/email/",{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        
        
      },
      body:JSON.stringify({
    
        
        email,
      }),
    });
  },

  

};

export default accountsApi;