import { Routes, Route } from "react-router-dom";
import ModeratorDashboard from "../pages/moderator/ModeratorDashboard";

const ModeratorRoutes = () => {
    return (
        <Routes>
            <Route
                path="/moderator"
                element={<ModeratorDashboard />}
            />
            <Route
                    path="moderator/reports"
                    element={<ReportList />}
            />

            <Route
                    path="moderator/reports/:id"
                    element={<ReportDetail />}
            />
            <Route
                    path="/moderator/review-queue"
                    element={<ReviewQueue />}
            />
            <Route
                    path="/moderator/reports/create"
                    element={<CreateReport />}
            />
           
        </Routes>
    );
};

export default ModeratorRoutes;