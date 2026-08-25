const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = async (endpoint, options = {}) => {
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await response.json();
    

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
};

export default apiClient;
