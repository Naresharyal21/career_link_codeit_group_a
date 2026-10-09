import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./home/components/pages/HomePage";
import Login from "./pages/accounts/Login";
import Signup from "./pages/accounts/Signup";
import Auth0LoginButtons from "./components/accounts/Auth0LoginButtons";
import MyProfilecart from "./pages/accounts/MyProfilecart";
import ForgetPasswordPage from "./pages/accounts/ForgetPasswordPage";
import VerifyOTPpage from "./pages/accounts/VerifyOTPpage";
import ResetPasswordPage from "./pages/accounts/ResetPasswordPage";
import EmailConformPasswordPage from "./pages/accounts/EmailConformPasswordPage";
import EmailChangePage from "./pages/accounts/EmailChangePage";
import DashboardLayout from "./layout/DashboardLayout";
import Layout from "./components/Layout";
import DashboardHomePage from "./pages/DashboardHomePage";
import SavedJobsPage from "./pages/SavedJobsPage";
import ResumePage from "./pages/ResumePage";
import JobDetailPage from "./pages/JobDetailPage";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import ProtectedRoute from "./context/ProtectedRoute";
import EmployerRoute from "./context/EmployerRoute";
import ApplicationPage from "./applications/ApplicationForm";
import MyApplicationsPage from "./applications/components/pages/MyApplicationsPage";
import NotificationsPage from "./notifications/components/pages/NotificationsPage";
import ModeratorRoutes from "./routes/ModeratorRoutes";
import employerRoutes from "./routes/EmployerRoutes";
import AdminLogin from "./pages/moderator/AdminLogin";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/custom/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<Auth0LoginButtons callbackOnly />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
            </Route>
            <Route element={<DashboardLayout />}>
                {/* Account support and dashboard routes */}
                <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
                <Route path="/verifyotp/:purpose" element={<VerifyOTPpage />} />
                <Route path="/resetpassword" element={<ResetPasswordPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/conformpassword" element={<EmailConformPasswordPage />} />
                    <Route path="/get/new/email" element={<EmailChangePage />} />
                </Route>
                <Route path="/jobs" element={<BrowseJobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardHomePage />} />
                    <Route path="/dashboard/application" element={<ApplicationPage />} />
                    <Route path="/dashboard/applications" element={<MyApplicationsPage />} />
                    <Route path="/dashboard/saved-jobs" element={<SavedJobsPage />} />
                    <Route path="/dashboard/resume" element={<ResumePage />} />
                    <Route path="/dashboard/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard/applied-jobs" element={<Navigate to="/dashboard/applications" replace />} />
                    <Route path="/application" element={<ApplicationPage />} />
                    <Route path="/applications" element={<Navigate to="/dashboard/applications" replace />} />
                    <Route path="/applied-jobs" element={<Navigate to="/dashboard/applications" replace />} />
                    <Route path="/saved-jobs" element={<Navigate to="/dashboard/saved-jobs" replace />} />
                    <Route path="/resume" element={<Navigate to="/dashboard/resume" replace />} />
                    <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />

                    {/* User Profile */}
                    <Route path="/profile" element={<MyProfilecart />} />

                    {/* Moderator */}
                    <Route path="/reports/*" element={<ModeratorRoutes />} />

                    {/* Employer only */}
                    <Route element={<EmployerRoute />}>
                        {employerRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
};

export default AppRoutes;