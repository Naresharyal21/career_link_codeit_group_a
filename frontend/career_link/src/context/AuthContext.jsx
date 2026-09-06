import { createContext, useEffect, useState } from "react";
import accountsApi from "../apis/accountsApi";


export const AuthenticationContext = createContext(null);



const AuthContext = ({ children }) => {




  const persistedToken = localStorage.getItem("accessToken");
  // const initialUser = persistedUser ? JSON.parse(persistedUser) : {};

  const [accessToken, setAccessToken] = useState(persistedToken);
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false)
        return;
      }

      try {
        const backendresponse = await accountsApi.getMe();
        setUser(backendresponse);
        setAccessToken(token);
        localStorage.setItem("user", JSON.stringify(backendresponse));

      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
          setAccessToken(null);
        setUser(null);
      } finally{
        setLoading(false)
      }
    };
    checkAuthentication();
  },[])


  const loginUser = (accessToken, refreshToken, userData = null) => {

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }

  };

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  

  const isAuthenticated = !!accessToken;




  return (
    <AuthenticationContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        user,
        setUser,
        loginUser,
        logoutUser,
        loading,
      }}>
      {children}

    </AuthenticationContext.Provider>
  )
}

export default AuthContext
