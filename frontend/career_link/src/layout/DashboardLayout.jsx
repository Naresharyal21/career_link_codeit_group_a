import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F7F8FC] text-[#172337] supports-[height:100dvh]:h-[100dvh]">


      <header className="relative z-50 h-20 shrink-0 border-b border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex h-full items-center">
          <button
            type="button"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((open) => !open)}
            className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            {mobileNavOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <div className="min-w-0 flex-1">
            <Navbar />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-64 shrink-0 bg-[#172337] text-white md:block">
          <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        </aside>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
              className="absolute inset-0 bg-slate-950/40"
            />
            <aside className="relative z-10 h-full w-72 max-w-[85vw] bg-[#172337] text-white shadow-xl">
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F7F8FC]">

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
          <Footer />

        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;