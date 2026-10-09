import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../apis/apiClient";

const ApplicationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("job");
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [loading, setLoading] = useState(Boolean(jobId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let active = true;
    apiClient
      .get(`/jobs/${jobId}/`)
      .then((result) => {
        if (active) setJob(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this job.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [jobId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobId || submitting) return;

    setError("");
    setSubmitting(true);
    const formData = new FormData();
    formData.append("job", jobId);
    formData.append("cover_letter", coverLetter.trim());
    if (resume) formData.append("resume", resume);

    try {
      await apiClient.post("/applications/", formData);
      navigate("/dashboard/applications", {
        replace: true,
        state: { notice: "Your application has been submitted." },
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to submit your application.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResumeChange = (event) => {
    const file = event.currentTarget.files?.[0] || null;
    if (!file) {
      setResume(null);
      setResumeError("");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(extension)) {
      setResume(null);
      setResumeError("Choose a PDF, DOC, or DOCX file.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResume(null);
      setResumeError("Resume must be 5 MB or smaller.");
      event.currentTarget.value = "";
      return;
    }

    setResume(file);
    setResumeError("");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse rounded-2xl bg-white p-6 shadow-sm">
        <div className="h-6 w-2/3 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
        <div className="mt-8 h-28 rounded bg-slate-100" />
      </div>
    );
  }

  if (!jobId || (!job && !error)) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Choose a job to apply for</h1>
        <p className="mt-2 text-sm text-slate-600">
          Open a job listing first, then select Apply Now to start your application.
        </p>
        <Link
          to="/jobs"
          className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Browse jobs
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <Link
        to={`/jobs/${jobId}`}
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        Back to job details
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Apply for {job?.title}</h1>
      <p className="mt-1 text-sm text-slate-600">{job?.employer_name}</p>

      {error && (
        <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="cover-letter" className="mb-2 block text-sm font-medium text-slate-800">
            Cover letter <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="cover-letter"
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            rows={7}
            maxLength={5000}
            placeholder="Introduce yourself and explain why you are a good fit."
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-right text-xs text-slate-500">{coverLetter.length}/5000</p>
        </div>

        <div>
          <label htmlFor="resume" className="mb-2 block text-sm font-medium text-slate-800">
            Resume <span className="font-normal text-slate-500">(PDF, DOC or DOCX, up to 5 MB)</span>
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="block w-full rounded-xl border border-slate-300 p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700"
          />
          {resumeError && <p role="alert" className="mt-2 text-sm text-red-700">{resumeError}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting || !job}
          className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Submitting application..." : "Submit application"}
        </button>
      </form>
    </section>
  );
};

export default ApplicationForm;
