import { Navigate, Outlet, useLocation } from "react-router";

export default function RequireAuth() {
    const location = useLocation();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}
