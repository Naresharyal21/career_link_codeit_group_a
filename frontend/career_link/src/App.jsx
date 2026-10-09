import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Routes";

const App = () => {
    return (
        <>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3500} newestOnTop />
        </>
    );
};

export default App;