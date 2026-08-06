import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./home/components/pages/HomePage";
import MyApplicationsPage from "./applications/components/pages/MyApplicationsPage";
import NotificationsPage from "./notifications/components/pages/NotificationsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;