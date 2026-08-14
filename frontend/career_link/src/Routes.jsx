import { Navigate, Route, Routes } from "react-router";

import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";

import ModeratorLayout from "./moderator/layout/ModeratorLayout";
import ModeratorDashboard from "./moderator/pages/ModeratorDashboard";
import ReviewQueuePage from "./moderator/pages/ReviewQueuePage";
import ReportList from "./moderator/pages/ReportList";
import ReportDetail from "./moderator/pages/ReportDetail";
import ReportCreate from "./moderator/pages/ReportCreate";

import {
    JobApprovalsPage,
    CompanyReviewsPage,
    ReportedContentPage,
    UserReportsPage,
    FlaggedListingsPage,
    ActivityLogPage,
} from "./moderator/pages/ModeratorSectionPages";

import Loginform from "./accounts/components/Loginform";
import RequireAuth from "./auth/RequireAuth";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route */}
            <Route
                path="/login"
                element={<Loginform />}
            />

            {/* All authenticated routes */}
            <Route element={<RequireAuth />}>

                {/* Normal application routes */}
                <Route element={<DashboardLayout />}>
                    <Route
                        index
                        element={<Home />}
                    />
                </Route>

                {/* Moderator application routes */}
                <Route
                    path="/moderator"
                    element={<ModeratorLayout />}
                >
                    {/* Dashboard */}
                    <Route
                        index
                        element={<ModeratorDashboard />}
                    />

                    {/* Review Queue */}
                    <Route
                        path="review-queue"
                        element={<ReviewQueuePage />}
                    />

                    {/* Reported Content */}
                    <Route
                        path="reported-content"
                        element={<ReportedContentPage />}
                    />

                    {/* Job Approvals */}
                    <Route
                        path="job-approvals"
                        element={<JobApprovalsPage />}
                    />

                    {/* Company Reviews */}
                    <Route
                        path="company-reviews"
                        element={<CompanyReviewsPage />}
                    />

                    {/* User Reports */}
                    <Route
                        path="user-reports"
                        element={<UserReportsPage />}
                    />

                    {/* Flagged Listings */}
                    <Route
                        path="flagged-listings"
                        element={<FlaggedListingsPage />}
                    />

                    {/* Activity Log */}
                    <Route
                        path="activity-log"
                        element={<ActivityLogPage />}
                    />

                    {/* Reports */}
                    <Route
                        path="reports"
                        element={<ReportList />}
                    />

                    {/* Create Report */}
                    <Route
                        path="reports/create"
                        element={<ReportCreate />}
                    />

                    {/* Report Detail */}
                    <Route
                        path="reports/:id"
                        element={<ReportDetail />}
                    />
                </Route>
            </Route>

            {/* Catch-all */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
};

export default AppRoutes;