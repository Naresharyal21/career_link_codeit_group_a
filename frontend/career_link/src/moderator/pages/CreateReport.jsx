import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    Flag,
    Search,
} from "lucide-react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import moderatorApi from "../../apis/moderatorApi";
import { getJobs } from "../../apis/jobsApi";
import ModeratorSectionPage from "../components/ModeratorSectionPage";
import { formatReportId } from "../utils/report";


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

    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState("");
    const [jobQuery, setJobQuery] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [isJobOpen, setIsJobOpen] = useState(false);

    const jobFieldRef = useRef(null);

    const { id } = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
        let cancelled = false;

        const loadJobs = async () => {
            try {
                setJobsLoading(true);
                setJobsError("");

                const response = await getJobs();

                const data = Array.isArray(response)
                    ? response
                    : response?.results || [];

                if (!cancelled) {
                    setJobs(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setJobsError(
                        "Couldn't load job postings. You can still search again."
                    );
                }
            } finally {
                if (!cancelled) {
                    setJobsLoading(false);
                }
            }
        };

        loadJobs();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadReport = async () => {
            try {
                setLoading(true);

                const data =
                    await moderatorApi.getReport(id);

                setForm({
                    reported_job:
                        String(
                            typeof data.reported_job ===
                            "object"
                                ? data.reported_job.id
                                : data.reported_job || ""
                        ),

                    report_reason:
                        data.report_reason || "",

                    report_description:
                        data.report_description || "",
                });

                setJobQuery(
                    typeof data.reported_job ===
                    "object"
                        ? data.reported_job.title || ""
                        : data.reported_job_title || ""
                );
            } catch (err) {
                setError(
                    err?.message ||
                        "Unable to load report."
                );
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [id]);

    const filteredJobs = useMemo(() => {
        const query = jobQuery.trim().toLowerCase();

        if (!query) {
            return jobs.slice(0, 20);
        }

        return jobs
            .filter((job) => {
                const searchable = [
                    job.id,
                    job.title,
                    job.employer_name,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchable.includes(query);
            })
            .slice(0, 20);
    }, [jobs, jobQuery]);

    const handleJobQueryChange = (event) => {
        setJobQuery(event.target.value);
        setIsJobOpen(true);

        if (selectedJob) {
            setSelectedJob(null);

            setForm((current) => ({
                ...current,
                reported_job: "",
            }));
        }

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    const handleSelectJob = (job) => {
        setSelectedJob(job);
        setJobQuery(job.title);
        setIsJobOpen(false);

        setForm((current) => ({
            ...current,
            reported_job: String(job.id),
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

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
            return "Please select the reported job from the list.";
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

            if (isEditMode) {
                await moderatorApi.updateReport(
                    id,
                    payload
                );

                setSuccess(
                    `Report ${formatReportId(
                        id
                    )} updated successfully.`
                );
            } else {
                const createdReport =
                    await moderatorApi.createReport(
                        payload
                    );

                setSuccess(
                    `Report ${formatReportId(
                        createdReport.id
                    )} created successfully.`
                );

                setForm({
                    reported_job: "",
                    report_reason: "",
                    report_description: "",
                });

                setSelectedJob(null);
                setJobQuery("");
            }
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to save report."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/reports/");
    };

    return (
            <ModeratorSectionPage
                title={
                    isEditMode
                        ? `Update Report ${formatReportId(id)}`
                        : "Create Report"
                }
                description={
                    isEditMode
                        ? "Update the moderation report information."
                        : "Create a moderation report for a job posting."
                }
                backLabel="Reports"
                backTo="/reports/"
            >
            
            <div className="mx-auto max-w-3xl">
                {/* Intro */}
                {/* <div className="rounded-2xl border border-[#bae6fd] bg-[#f0fdff] p-5">
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
                </div> */}

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
                                        "/reports/list/"
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
                        {/* Job */}
                        <div ref={jobFieldRef} className="relative">
                            <label
                                htmlFor="reported_job_search"
                                className="block text-sm font-bold text-[#334155]"
                            >
                                Reported Job
                            </label>

                            <p className="mt-1 text-xs text-[#94a3b8]">
                                Search by job title or employer and
                                select the posting being reported.
                            </p>

                            <div className="relative mt-3">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />

                                <input
                                    id="reported_job_search"
                                    name="reported_job_search"
                                    type="text"
                                    autoComplete="off"
                                    value={jobQuery}
                                    onChange={handleJobQueryChange}
                                    onFocus={() =>
                                        setIsJobOpen(true)
                                    }
                                    placeholder={
                                        jobsLoading
                                            ? "Loading job postings..."
                                            : "Search job title or employer..."
                                    }
                                    className="w-full rounded-lg border border-[#e2e8f0] bg-white py-3 pl-11 pr-9 text-sm text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/10"
                                />

                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />

                                {isJobOpen && (
                                    <div className="absolute z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-[#e2e8f0] bg-white shadow-lg">
                                        {jobsLoading && (
                                            <p className="px-4 py-3 text-sm text-[#94a3b8]">
                                                Loading job postings...
                                            </p>
                                        )}

                                        {!jobsLoading &&
                                            jobsError && (
                                                <p className="px-4 py-3 text-sm text-red-600">
                                                    {jobsError}
                                                </p>
                                            )}

                                        {!jobsLoading &&
                                            !jobsError &&
                                            filteredJobs.length ===
                                                0 && (
                                                <p className="px-4 py-3 text-sm text-[#94a3b8]">
                                                    No matching job
                                                    postings.
                                                </p>
                                            )}

                                        {!jobsLoading &&
                                            !jobsError &&
                                            filteredJobs.map(
                                                (job) => (
                                                    <button
                                                        key={
                                                            job.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectJob(
                                                                job
                                                            )
                                                        }
                                                        className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left text-sm transition hover:bg-[#f0fdff]"
                                                    >
                                                        <span className="font-bold text-[#1e293b]">
                                                            {
                                                                job.title
                                                            }
                                                        </span>

                                                        <span className="text-xs text-[#94a3b8]">
                                                            {job.employer_name ||
                                                                "Unknown employer"}{" "}
                                                            &middot; #
                                                            {job.id}
                                                        </span>
                                                    </button>
                                                )
                                            )}
                                    </div>
                                )}
                            </div>

                            {selectedJob && (
                                <p className="mt-2 text-xs font-semibold text-[#00a6c7]">
                                    Selected: {selectedJob.title}{" "}
                                    (#{selectedJob.id})
                                </p>
                            )}
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

                                <option value="Spam">
                                    Spam
                                </option>

                                <option value="Fake Job">
                                    Fake Job
                                </option>

                                <option value="Scam">
                                    Scam
                                </option>

                                <option value="Misleading Information">
                                    Misleading Information
                                </option>

                                <option value="Duplicate">
                                    Duplicate Listing
                                </option>

                                <option value="Offensive Content">
                                    Offensive Content
                                </option>

                                <option value="Expired Job">
                                    Expired Job
                                </option>

                                <option value="Other">
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
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                ? "Update Report"
                                : "Create Report"}
                        </button>
                    </div>
                </form>
            </div>
        </ModeratorSectionPage>
    );
};

export default CreateReport;