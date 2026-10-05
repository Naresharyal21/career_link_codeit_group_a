
import useApi from "./useApi";
import moderatorApi from '../apis/moderatorApi';

const useModerator = () => {
   const { data, loading, error, execute } = useApi();


   const adminlogin = async (credential)=>{
   
    return await execute(()=>moderatorApi.adminlogin(credential))
   };


   return{
    data,
    loading,
    error,
    adminlogin,
   }
 
}

export default useModerator
