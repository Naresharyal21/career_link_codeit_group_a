const BASE_URL=import.meta.env.VITE_API_BASE_URL;



const apiClient=async(endpoints , options ={})=>{

const response = await fetch(
  `${BASE_URL}${endpoints}`,options
);

const data = await response.json();
if(!response.ok){
  throw new Error(
    data.detail || "something went wrong"
  )
}
return data;


};

 export default apiClient;