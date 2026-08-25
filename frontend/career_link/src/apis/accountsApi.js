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
      headers:{
        Authorization:`Bearer ${localStorage.getItem("accessToken")}`
      },
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

  forgotpassword:async(email)=>{
    return await apiClient("/accounts/forgot/password/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        
      },
      body:JSON.stringify({
        email,
      }),
    });
  },
  verifyOTP:async(email ,otp , purpose)=>{
    return await apiClient("/accounts/verify/otp/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        
      },
      body:JSON.stringify({
        email,
        otp,
        purpose
      }),
    });
  },
  resetpassword:async(email ,newpassword)=>{
    return await apiClient("/accounts/reset/password/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        
      },
      body:JSON.stringify({
        email,
        new_password:newpassword,
      }),
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

  

};

export default accountsApi;