import useApi from "./useApi";
import accountsApi from "../apis/accountsApi";
import apiClient from "../apis/apiClient";

const useAccounts = () => {
  const { data, loading, error, execute } = useApi();

  const login = async (credentials) => {
    return await execute(() => accountsApi.login(credentials));
  };

  const register = async (userData) => {
    return await execute(() => accountsApi.register(userData));
  };

  const getMe = async () => {
    return await execute(() => accountsApi.getMe());
  };

  const refreshToken = async (refresh) => {
    return await execute(() => accountsApi.refreshToken(refresh));
  };

  const forgotpassword= async(email)=>{
    return await execute(()=>accountsApi.forgotpassword(email));
  };
  const verifyOTP = async (email , otp,purpose)=>{
    return await execute(()=> accountsApi.verifyOTP(email, otp , purpose));
  };

  const resetPassword=async (email , newpassword)=>{
    return await execute(()=> accountsApi.resetpassword(email , newpassword));
  };




 
  return {
    data,
    loading,
    error,
    login,
    register,
    getMe,
    refreshToken,
    forgotpassword,
    verifyOTP,
    resetPassword,
  };
};

export default useAccounts;
