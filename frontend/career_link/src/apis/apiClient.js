const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = async (endpoint, options = {}) => {
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await response.json();
    

  if (!response.ok) {
    const message=
    data.email?.[0]||
    data.detail||
    data.error||
    "Something went wrong";
    throw new Error(message);
  }

  return data;
};

export default apiClient;
