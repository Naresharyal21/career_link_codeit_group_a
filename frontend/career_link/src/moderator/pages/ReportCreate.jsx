import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router";

export default function ReportCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        jobId: "",
        reason: "",
        description: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // UI-only for now.
        // The current backend allows report creation by job seekers,
        // not moderators.
        setSubmitted(true);
    };

    return (
        <section className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00a6c7]">
                        Moderation
                    </p>

                    <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a1a2e]">
                        Create Report
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
                        Submit a moderation report for content that requires review.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/moderator/reports")}
                    className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-bold text-[#334155] hover:bg-[#f8fafc]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Reports
                </button>
            </div>

            <div className="mt-7 max-w-3xl rounded-2xl border border-[#e2e8f0] bg-white p-6">
                {submitted && (
                    <div className="mb-6 rounded-xl border border-[#bae6fd] bg-[#ecfeff] px-4 py-3 text-sm font-medium text-[#0369a1]">
                        Report form submitted successfully. Backend submission
                        will be connected when the moderator reporting workflow
                        is implemented.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="jobId"
                            className="mb-2 block text-sm font-bold text-[#334155]"
                        >
                            Job Post ID
                        </label>

                        <input
                            id="jobId"
                            name="jobId"
                            type="number"
                            value={form.jobId}
                            onChange={(event) =>
                                updateField("jobId", event.target.value)
                            }
                            placeholder="Enter job post ID"
                            className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm outline-none transition focus:border-[#00b4d8] focus:bg-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="reason"
                            className="mb-2 block text-sm font-bold text-[#334155]"
                        >
                            Report Reason
                        </label>

                        <select
                            id="reason"
                            name="reason"
                            value={form.reason}
                            onChange={(event) =>
                                updateField("reason", event.target.value)
                            }
                            className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm outline-none transition focus:border-[#00b4d8] focus:bg-white"
                        >
                            <option value="">Select a reason</option>
                            <option value="Spam">Spam</option>
                            <option value="Fake Job">Fake Job</option>
                            <option value="Scam">Scam</option>
                            <option value="Misleading">Misleading</option>
                            <option value="Duplicate">Duplicate</option>
                            <option value="Offensive">Offensive</option>
                            <option value="Expired">Expired</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-bold text-[#334155]"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows={6}
                            value={form.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            placeholder="Describe why this content should be reviewed..."
                            className="w-full resize-none rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm outline-none transition focus:border-[#00b4d8] focus:bg-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-5">
                        <button
                            type="button"
                            onClick={() => navigate("/moderator/reports")}
                            className="rounded-lg border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-bold text-[#475569] hover:bg-[#f8fafc]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg bg-[#00b4d8] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#009bbb]"
                        >
                            <Send className="h-4 w-4" />
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}