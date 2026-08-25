import React, { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Flag } from "lucide-react";
import { useNavigate } from "react-router";

import moderatorApi from "../../apis/moderatorApi";
import ModeratorSectionPage from "../components/ModeratorSectionPage";

const CreateReport = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        reported_job: "",
        report_reason: "",
        report_description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    const validateForm = () => {
        if (!form.reported_job.trim()) {
            return "Please enter the reported job ID.";
        }

        if (!form.report_reason.trim()) {
            return "Please select a report reason.";
        }

        if (!form.report_description.trim()) {
            return "Please provide a description of the issue.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                reported_job: Number(form.reported_job),
                report_reason: form.report_reason,
                report_description:
                    form.report_description.trim(),
            };

            await moderatorApi.createReport(payload);

            setSuccess(
                "Report created successfully."
            );

            setForm({
                reported_job: "",
                report_reason: "",
                report_description: "",
            });
        } catch (err) {
            console.error(
                "Failed to create report:",
                err
            );

            const apiError =
                err?.response?.data;

            if (typeof apiError === "string") {
                setError(apiError);
            } else if (apiError?.detail) {
                setError(apiError.detail);
            } else if (apiError) {
                const messages = Object.entries(
                    apiError
                )
                    .flatMap(([field, value]) => {
                        const text = Array.isArray(value)
                            ? value.join(", ")
                            : String(value);

                        return `${field}: ${text}`;
                    })
                    .join(" ");

                setError(
                    messages ||
                        "Unable to create the report."
                );
            } else {
                setError(
                    err?.message ||
                        "Unable to create the report."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/moderator/reports");
    };

    return (
        <ModeratorSectionPage
            title="Create Report"
            description="Create a moderation report for a job posting that requires moderator attention."
            backLabel="Reports"
            backTo="/moderator/reports"
        >
            <div className="mx-auto max-w-3xl">
                {/* Intro */}
                <div className="rounded-2xl border border-[#bae6fd] bg-[#f0fdff] p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#00a6c7] shadow-sm">
                            <Flag className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-sm font-extrabold text-[#164e63]">
                                New moderation report
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-[#155e75]">
                                Provide the job posting and the reason
                                for moderation. The report will be
                                available in the moderator review flow.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success */}
                {success && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                        <div>
                            <p className="text-sm font-bold text-emerald-700">
                                {success}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/moderator/reports"
                                    )
                                }
                                className="mt-1 text-xs font-bold text-emerald-700 underline"
                            >
                                View reports
                            </button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <p className="text-sm font-semibold leading-6 text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
                >
                    <div className="border-b border-[#f1f5f9] px-6 py-5">
                        <h2 className="text-base font-extrabold text-[#1e293b]">
                            Report Information
                        </h2>

                        <p className="mt-1 text-sm text-[#64748b]">
                            Enter the details needed to create this
                            moderation report.
                        </p>
                    </div>

                    <div className="space-y-6 p-6">
                        {/* Job ID */}
                        <div>
                            <label
                                htmlFor="reported_job"
                                className="block text-sm font-bold text-[#334155]"
                            >
                                Reported Job ID
                            </label>

                            <p className="mt-1 text-xs text-[#94a3b8]">
                                Enter the ID of the job posting being
                                reported.
                            </p>

                            <input
                                id="reported_job"
                                name="reported_job"
                                type="number"
                                min="1"
                                value={form.reported_job}
                                onChange={handleChange}
                                placeholder="e.g. 25"
                                className="mt-3 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/10"
                            />
                        </div>

                        {/* Reason */}
                        <div>
                            <label
                                htmlFor="report_reason"
                                className="block text-sm font-bold text-[#334155]"
                            >
                                Report Reason
                            </label>

                            <p className="mt-1 text-xs text-[#94a3b8]">
                                Select the primary reason for the report.
                            </p>

                            <select
                                id="report_reason"
                                name="report_reason"
                                value={form.report_reason}
                                onChange={handleChange}
                                className="mt-3 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/10"
                            >
                                <option value="">
                                    Select a reason
                                </option>

                                <option value="spam">
                                    Spam
                                </option>

                                <option value="fraud">
                                    Fraud / Scam
                                </option>

                                <option value="misleading">
                                    Misleading Information
                                </option>

                                <option value="duplicate">
                                    Duplicate Listing
                                </option>

                                <option value="inappropriate">
                                    Inappropriate Content
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="report_description"
                                className="block text-sm font-bold text-[#334155]"
                            >
                                Description
                            </label>

                            <p className="mt-1 text-xs text-[#94a3b8]">
                                Explain why the listing requires
                                moderation.
                            </p>

                            <textarea
                                id="report_description"
                                name="report_description"
                                rows={6}
                                value={
                                    form.report_description
                                }
                                onChange={handleChange}
                                placeholder="Describe the issue clearly..."
                                className="mt-3 w-full resize-y rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm leading-6 text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/10"
                            />

                            <div className="mt-2 flex justify-end">
                                <span className="text-xs text-[#94a3b8]">
                                    {
                                        form.report_description
                                            .length
                                    }{" "}
                                    characters
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#f1f5f9] bg-[#f8fafc] px-6 py-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-bold text-[#475569] transition hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00b4d8] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#009bbb] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Flag className="h-4 w-4" />

                            {loading
                                ? "Creating..."
                                : "Create Report"}
                        </button>
                    </div>
                </form>
            </div>
        </ModeratorSectionPage>
    );
};

export default CreateReport;