import { Route, Routes } from "react-router";

import DashboardLayout from "./layout/DashboardLayout";

import Loginform from "./accounts/components/Loginform";

import Home from "./pages/Home";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplicationPage from "./applications/ApplicationForm";

import moderatorRoutes from "./routes/moderatorRoutes";

const AppRoutes = () => {
    return (
        <Routes>
   
            <Route
                path="/login"
                element={<Loginform />}
            />

            <Route element={<DashboardLayout />}>
                <Route
                    index
                    element={<Home />}
                />

                <Route
                    path="jobs"
                    element={<BrowseJobsPage />}
                />

                <Route
                    path="jobs/:id"
                    element={<JobDetailPage />}
                />

                <Route
                    path="application"
                    element={<ApplicationPage />}
                />

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