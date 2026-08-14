import { Routes, Route } from "react-router-dom";
import ModeratorDashboard from "../pages/moderator/ModeratorDashboard";

const ModeratorRoutes = () => {
    return (
        <Routes>
            <Route
                path="/moderator"
                element={<ModeratorDashboard />}
            />
        </Routes>
    );
};

export default ModeratorRoutes;