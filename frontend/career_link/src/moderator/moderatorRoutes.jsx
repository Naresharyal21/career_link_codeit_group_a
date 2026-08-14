import { Route } from "react-router";

import ModeratorLayout from "./layout/ModeratorLayout";

import ModeratorDashboard from "./pages/ModeratorDashboard";
import ReviewQueuePage from "./pages/ReviewQueuePage";
import ReportList from "./pages/ReportList";
import ReportDetail from "./pages/ReportDetail";
import ReportCreate from "./pages/ReportCreate";

import {
    JobApprovalsPage,
    CompanyReviewsPage,
    ReportedContentPage,
    UserReportsPage,
    FlaggedListingsPage,
    ActivityLogPage,
} from "./pages/ModeratorSectionPages";


export default function ModeratorRoutes() {
    return (
        <Route path="/moderator" element={<ModeratorLayout />}>
            <Route index element={<ModeratorDashboard />} />

            <Route
                path="review-queue"
                element={<ReviewQueuePage />}
            />

            <Route
                path="reported-content"
                element={<ReportedContentPage />}
            />

            <Route
                path="job-approvals"
                element={<JobApprovalsPage />}
            />

            <Route
                path="company-reviews"
                element={<CompanyReviewsPage />}
            />

            <Route
                path="user-reports"
                element={<UserReportsPage />}
            />

            <Route
                path="flagged-listings"
                element={<FlaggedListingsPage />}
            />

            <Route
                path="activity-log"
                element={<ActivityLogPage />}
            />

            <Route
                path="reports"
                element={<ReportList />}
            />

            <Route
                path="reports/create"
                element={<ReportCreate />}
            />

            <Route
                path="reports/:id"
                element={<ReportDetail />}
            />
        </Route>
    );
}