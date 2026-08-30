const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = async (endpoint, options = {}) => {
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await response.json();


  // const message =
  //   data.email?.[0] ||
  //   data.detail ||
  //   data.error ||
  //   data.location?.[0] ||
  //   data.company_name?.[0] ||
  //   data.profile_pictur?.[0] ||
  //   data.resume_file?.[0] ||
  //   data.logo?.[0] ||
  //   "Something went wrong";
 if (!response.ok) {
  console.log("Backend error:", data);

  const message =
    Object.values(data)
      .flat()
      .find((value) => typeof value === "string") ||
    "Something went wrong";

  throw new Error(message);
}

  return data;
};

export default apiClient;
