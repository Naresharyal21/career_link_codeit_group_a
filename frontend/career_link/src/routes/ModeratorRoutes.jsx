import { Route, Routes } from "react-router-dom";

import ModeratorDashboard from "../moderator/pages/ModeratorDashboard";
import ReportList from "../moderator/pages/ReportList";
import ReportDetail from "../moderator/pages/ReportDetail";
import ReviewQueue from "../moderator/pages/ReviewQueue";
import CreateReport from "../moderator/pages/CreateReport";
import JobApprovals from "../moderator/pages/JobApprovals";

const ModeratorRoutes = () => {
    return (
        <Routes>
            {/* /reports/ */}
            <Route
                index
                element={<ModeratorDashboard />}
            />

            {/* /reports/list/ */}
            <Route
                path="list"
                element={<ReportList />}
            />

            {/* /reports/create/ */}
            <Route
                path="create"
                element={<CreateReport />}
            />

            {/* /reports/review-queue/ */}
            <Route
                path="review-queue"
                element={<ReviewQueue />}
            />

            {/* /reports/job-approvals/ */}
            <Route
                path="job-approvals"
                element={<JobApprovals />}
            />

            {/* /reports/:id/ */}
            <Route
                path=":id"
                element={<ReportDetail />}
            />
        </Routes>
    );
};

export default ModeratorRoutes;