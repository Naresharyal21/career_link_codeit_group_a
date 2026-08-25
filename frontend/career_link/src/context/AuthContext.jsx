import { createContext, useState } from "react";


export const AuthenticationContext = createContext(null);



const AuthContext = ({ children }) => {

  const persistedToken = localStorage.getItem("accessToken");
  // const initialUser = persistedUser ? JSON.parse(persistedUser) : {};

  const [accessToken, setAccessToken] = useState(persistedToken);
  const [user , setUser]=useState(null);
  console.log(user)

  const loginUser = (acessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
    localStorage.setItem("user", JSON.stringify(user));

  }

  const logoutUser = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

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
      }}>
      {children}

    </AuthenticationContext.Provider>
  )
}

export default AuthContext
