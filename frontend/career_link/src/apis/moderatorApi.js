import React from "react";
import apiClient from "./apiClient";

const moderatorApi =  {
  adminlogin: async (credential) => {
    return await apiClient("/moderator/admin/login/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",

      },
      body: JSON.stringify(credential),
    });
  },
};

export default moderatorApi;
