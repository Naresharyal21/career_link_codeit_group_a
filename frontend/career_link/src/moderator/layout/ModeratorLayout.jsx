import { Outlet } from "react-router";
import ModeratorNavbar from "./ModeratorNavbar";
import ModeratorSidebar from "./ModeratorSidebar";

export default function ModeratorLayout() {
    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
            <div className="flex min-h-screen">
                <ModeratorSidebar />
                <main className="min-w-0 flex-1 p-10">
                    <ModeratorNavbar />
                    <div className="mt-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
