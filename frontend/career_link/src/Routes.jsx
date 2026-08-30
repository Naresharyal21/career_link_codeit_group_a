import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/accounts/Login";
import Signup from "./pages/accounts/Signup";
import MyProfilecart from "./pages/accounts/MyProfilecart";

import ForgetPasswordPage from "./pages/accounts/ForgetPasswordPage";
import VerifyOTPpage from "./pages/accounts/VerifyOTPpage";
import ResetPasswordPage from "./pages/accounts/ResetPasswordPage";

import DashboardLayout from "./layout/DashboardLayout";

import JobDetailPage from "./pages/JobDetailPage";
import BrowseJobsPage from "./pages/BrowseJobsPage";

import ProtectedRoute from "./context/ProtectedRoute";
import ModeratorRoutes from "./routes/ModeratorRoutes";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />

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