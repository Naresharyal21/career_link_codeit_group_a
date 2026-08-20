import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const ModeratorSectionPage = ({
    title,
    description,
    eyebrow = "Moderation",
    children,
    backLabel = "Back",
    backTo = "/moderator",
    action = null,
    className = "",
}) => {
    const navigate = useNavigate();

    return (
        <section className={`w-full ${className}`}>
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">
                        {eyebrow}
                    </p>

                    <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#64748b]">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {action}

                    {backTo && (
                        <button
                            type="button"
                            onClick={() => navigate(backTo)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-bold text-[#334155] transition hover:bg-[#f8fafc]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {backLabel}
                        </button>
                    )}
                </div>
            </div>

            {/* Page Content */}
            <div className="mt-7">
                {children}
            </div>
        </section>
    );
};


import ModerationTablePage from "./ModerationTablePage";

export function JobApprovalsPage() {
    return (
        <ModeratorSectionPage
            title="Job Approvals"
            description="Review new job postings before they become visible to job seekers."
            backLabel="Queue"
            backTo="/moderator/review-queue"
        >
            <ModerationTablePage
                title=""
                description=""
                count={8}
                rows={mapRows(staticRows.jobApprovals)}
                actionLabel="Approve"
            />
        </ModeratorSectionPage>
    );
}

export function ActivityLogPage() {
    const activities = [
        ["Report resolved", "Priya Thapa resolved a spam listing report.", "10 mins ago"],
        ["Company verification updated", "Neo Tech Ltd was moved to Under Review.", "30 mins ago"],
        ["Job approval reviewed", "Senior Python Architect was approved.", "1 hour ago"],
        ["User report opened", "Harassment report #1048 was assigned to moderation.", "2 hours ago"],
        ["Listing flagged", "System flagged a duplicate job post.", "3 hours ago"],
    ];

    return (
        <ModeratorSectionPage
            title="Activity Log"
            description="A chronological record of moderation actions and system events."
        >
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                <div className="space-y-0">
                    {activities.map(([title, text, time]) => (
                        <div
                            key={title}
                            className="relative flex gap-4 border-b border-[#f1f5f9] py-5 last:border-0"
                        >
                            {/* existing activity content */}
                        </div>
                    ))}
                </div>
            </div>
        </ModeratorSectionPage>
    );
}

export default ModeratorSectionPage;