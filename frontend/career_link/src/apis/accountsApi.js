import apiClient from "./apiClient";

import React from "react";

const accountsApi = {
  registr: (userData) => {
    return apiClient("/accounts/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },



  
};

export default accountsApi;
