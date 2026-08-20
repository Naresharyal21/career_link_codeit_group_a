import { Route, Routes } from "react-router";

import DashboardLayout from "./layout/DashboardLayout";

import Loginform from "./accounts/components/Loginform";


import Home from "./pages/Home";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplicationPage from "./applications/ApplicationForm";

import ModeratorDashboard from "./moderator/pages/ModeratorDashboard";
import ReportList from "./moderator/pages/ReportList";
import ReportDetail from "./moderator/pages/ReportDetail";

import ReviewQueue from "./moderator/pages/ReviewQueue";
import CreateReport from "./moderator/pages/CreateReport";

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

                {/* Jobs */}
                <Route
                    path="jobs"
                    element={<BrowseJobsPage />}
                />

                <Route
                    path="jobs/:id"
                    element={<JobDetailPage />}
                />

                {/* Applications */}
                <Route
                    path="application"
                    element={<ApplicationPage />}
                />

                {/* Moderator */}
                <Route
                    path="moderator"
                    element={<ModeratorDashboard />}
                />

                
        </Routes>
    );
};

export default AppRoutes;