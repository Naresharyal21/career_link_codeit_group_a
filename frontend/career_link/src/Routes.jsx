import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import HomePage from "./home/components/pages/HomePage";

import Login from "./pages/accounts/Login";
import Signup from "./pages/accounts/Signup";
import MyProfilecart from "./pages/accounts/MyProfilecart";

import ForgetPasswordPage from "./pages/accounts/ForgetPasswordPage";
import VerifyOTPpage from "./pages/accounts/VerifyOTPpage";
import ResetPasswordPage from "./pages/accounts/ResetPasswordPage";

import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./context/ProtectedRoute";

import JobDetailPage from "./pages/JobDetailPage";
import BrowseJobsPage from "./pages/BrowseJobsPage";

import ApplicationPage from "./applications/ApplicationForm";
import MyApplicationsPage from "./applications/components/pages/MyApplicationsPage";
import NotificationsPage from "./notifications/components/pages/NotificationsPage";

import ModeratorRoutes from "./routes/ModeratorRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/forgetpassword"
                element={<ForgetPasswordPage />}
            />

            <Route
                path="/verifyotp/:purpose"
                element={<VerifyOTPpage />}
            />

            <Route
                path="/resetpassword"
                element={<ResetPasswordPage />}
            />

            <Route
                path="/jobs"
                element={<BrowseJobsPage />}
            />

            <Route
                path="/jobs/:id"
                element={<JobDetailPage />}
            />

            {/* Dashboard / Applications & Notifications */}
            <Route path="/application" element={<ApplicationPage />} />
            <Route path="/applications" element={<MyApplicationsPage />} />
            <Route path="/applied-jobs" element={<MyApplicationsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="application" element={<ApplicationPage />} />
                <Route path="applications" element={<MyApplicationsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    {/* User Profile */}
                    <Route
                        path="/profile"
                        element={<MyProfilecart />}
                    />

                    {/* Moderator */}
                    <Route
                        path="/reports/*"
                        element={<ModeratorRoutes />}
                    />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;