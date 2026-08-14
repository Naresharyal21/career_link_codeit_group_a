import { NavLink, useLocation } from "react-router";
import {
    Award,
    Bell,
    BriefcaseBusiness,
    Check,
    ClipboardList,
    Folder,
    Home,
    Settings,
    UserRound,
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", path: "/moderator", icon: Home, end: true },
    { name: "Review Queue", path: "/moderator/review-queue", icon: Folder },
    { name: "Reported Content", path: "/moderator/reported-content", icon: Bell },
    { name: "Job Approvals", path: "/moderator/job-approvals", icon: Check },
    { name: "Company Reviews", path: "/moderator/company-reviews", icon: Award },
    { name: "User Reports", path: "/moderator/user-reports", icon: UserRound },
    { name: "Flagged Listings", path: "/moderator/flagged-listings", icon: Settings },
    { name: "Activity Log", path: "/moderator/activity-log", icon: ClipboardList },
];

export default function ModeratorSidebar() {
    const location = useLocation();

    return (
        <aside className="flex min-h-screen w-[260px] shrink-0 flex-col border-r border-[#334155] bg-[#1a1a2e] p-8 text-white">
            <NavLink to="/moderator" className="flex items-center gap-2">
                <BriefcaseBusiness className="h-6 w-6 text-[#00b4d8]" strokeWidth={2.2} />
                <span className="text-[18px] font-extrabold tracking-tight">
                    Career<span className="text-[#00b4d8]">Link</span>
                </span>
            </NavLink>

            <nav className="mt-8 flex flex-col gap-1.5">
                {menuItems.map(({ name, path, icon: Icon, end }) => {
                    const active = end
                        ? location.pathname === path
                        : location.pathname === path || location.pathname.startsWith(`${path}/`);

                    return (
                        <NavLink
                            key={name}
                            to={path}
                            className={`flex min-h-[42px] items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                                active
                                    ? "bg-[#00b4d8] font-bold text-white"
                                    : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                            <span>{name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="mt-8 border-t border-[#334155] pt-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-9 items-center justify-center overflow-hidden rounded-full bg-[#0f172a] text-xs font-bold text-white">
                        P
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-white">Priya Thapa</p>
                        <p className="truncate text-[11px] text-[#94a3b8]">Content Moderator</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
