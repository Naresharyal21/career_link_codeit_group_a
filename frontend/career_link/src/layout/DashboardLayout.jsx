import React from "react";
import { Outlet } from "react-router";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F7F8FC] text-[#172337]">

      {/* ================= HEADER ================= */}
      <header className="relative z-50 h-20 shrink-0 border-b border-[#E5E7EB] bg-white shadow-sm">
        <Navbar />
      </header>

      {/* ================= MAIN AREA ================= */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden w-64 shrink-0 bg-[#172337] text-white md:block">
          <Sidebar />
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-[#F7F8FC]">

          <div className="min-h-full p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;