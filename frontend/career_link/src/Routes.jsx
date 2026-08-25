import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import DashboardLayout from "./layout/DashboardLayout";

import Loginform from "./accounts/components/Loginform";

import HomePage from "./home/components/pages/HomePage";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import JobDetailPage from "./pages/JobDetailPage";

import ApplicationPage from "./applications/ApplicationForm";
import MyApplicationsPage from "./applications/components/pages/MyApplicationsPage";
import NotificationsPage from "./notifications/components/pages/NotificationsPage";

import moderatorRoutes from "./routes/ModeratorRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public pages */}
            <Route element={<Layout />}>
                {/* <Route path="/" element={<HomePage />} /> */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/jobs" element={<BrowseJobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/login" element={<Loginform />} />
            </Route>

            {/* Authenticated / dashboard pages */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="application" element={<ApplicationPage />} />
                <Route path="applications" element={<MyApplicationsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />

                {moderatorRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Route>
        </Routes>
    );
};

export default AppRoutes;