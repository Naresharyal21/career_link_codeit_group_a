import { Bell, Search } from "lucide-react";

export default function ModeratorNavbar() {
    return (
        <header className="flex h-[52px] shrink-0 items-center justify-between">
            <div className="flex w-[320px] items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4 py-2.5">
                <Search className="h-4 w-4 text-[#64748b]" strokeWidth={2} />
                <input
                    type="search"
                    aria-label="Search moderation"
                    placeholder="Search review queue, flagged listings, reports..."
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1e293b] outline-none placeholder:text-[#64748b]"
                />
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#1e293b]"
                >
                    <Bell className="h-5 w-5" strokeWidth={2} />
                    <span className="absolute right-[5px] top-[5px] h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                </button>
                <div className="h-7 w-px bg-[#e2e8f0]" />
                <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f7fa] text-sm font-bold text-[#00a6c7]">P</div>
                    <span className="text-sm font-bold text-[#1e293b]">Priya Thapa</span>
                </div>
            </div>
        </header>
    );
}
