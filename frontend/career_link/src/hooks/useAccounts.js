import useApi from "./useApi";
import accountsApi from "../apis/accountsApi";

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

  return {
    data,
    loading,
    error,
    login,
    register,
    getMe,
    refreshToken,
  };
};

export default useAccounts;
