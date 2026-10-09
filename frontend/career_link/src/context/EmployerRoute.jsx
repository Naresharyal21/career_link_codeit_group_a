import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "./AuthContext";

const EmployerRoute = () => {
  const { user, loading } = useContext(AuthenticationContext);

  if (loading) {
    return null;
  }

  if (!user || user.role !== "ep") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default EmployerRoute;
