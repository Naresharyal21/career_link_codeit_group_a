import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthenticationContext);
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;