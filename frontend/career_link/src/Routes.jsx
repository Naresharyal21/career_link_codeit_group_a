import { Route, Routes } from "react-router";

import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";

import ModeratorDashboard from "./moderator/pages/ModeratorDashboard";
import ReportList from "./moderator/pages/ReportList";
import ReportDetail from "./moderator/pages/ReportDetail";

import Loginform from "./accounts/components/Loginform";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Authentication */}
            <Route
                path="/login"
                element={<Loginform />}
            />

            {/* Main application */}
            <Route element={<DashboardLayout />}>
                <Route
                    index
                    element={<Home />}
                />

                <Route
                    path="/moderator"
                    element={<ModeratorDashboard />}
                />

                <Route
                    path="/moderator/reports"
                    element={<ReportList />}
                />

                <Route
                    path="/moderator/reports/:id"
                    element={<ReportDetail />}
                />
                
            </Route>
        </Routes>
    );
};

export default AppRoutes;