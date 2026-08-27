import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "./AuthContext";



const ProtectedRoute = () => {

  const { isAuthenticated , accessToken } = useContext(AuthenticationContext);


  if (!isAuthenticated) {
    
    return <Navigate to="/login"  replace/>
  }

  return <Outlet />;

};

export default ProtectedRoute;
