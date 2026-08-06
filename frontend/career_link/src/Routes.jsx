import React from "react";
import { Routes, Route } from "react-router-dom";
import MyApplicationsPage from "./applications/components/pages/MyApplicationsPage";
import NotificationsPage from "./notifications/components/pages/NotificationsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/applications" element={<MyApplicationsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}

export default AppRoutes;