import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../apis/apiClient";
import { AuthenticationContext } from "../../../context/AuthContext";

const STATUS_STYLES = {
  APPLIED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  INTERVIEW: "bg-cyan-50 text-cyan-700",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  WITHDRAWN: "bg-slate-100 text-slate-600",
};

const STATUS_LABELS = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function MyApplicationsPage() {
  const { user } = useContext(AuthenticationContext);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [updatingApplication, setUpdatingApplication] = useState(null);
  const [unapplyingApplication, setUnapplyingApplication] = useState(null);
  const [actionError, setActionError] = useState("");

  const isEmployer = user?.role === "ep";

  const fetchApplications = useCallback(async () => {
    const [applicationsResponse, savedJobsResponse] = await Promise.all([
      apiClient.get("/applications/"),
      user?.role === "js" ? apiClient.get("/applications/saved-jobs/") : Promise.resolve([]),
    ]);
    return {
      applications: Array.isArray(applicationsResponse)
        ? applicationsResponse
        : applicationsResponse?.results || [],
      savedJobs: Array.isArray(savedJobsResponse)
        ? savedJobsResponse
        : savedJobsResponse?.results || [],
    };
  }, [user?.role]);

  const loadApplications = useCallback(async () => {
    try {
      const data = await fetchApplications();
      setApplications(data.applications);
      setSavedJobs(data.savedJobs);
    } catch (requestError) {
      setError(requestError.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchApplications();
        if (active) {
          setApplications(data.applications);
          setSavedJobs(data.savedJobs);
        }
      } catch (requestError) {
        if (active) setError(requestError.message || "Unable to load applications.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [fetchApplications]);

  const updateApplicationStatus = async (application, status) => {
    setUpdatingApplication(application.id);
    setActionError("");
    try {
      const updated = await apiClient.patch(`/applications/${application.id}/`, { status });
      setApplications((current) =>
        current.map((item) =>
          item.id === application.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (requestError) {
      setActionError({
        applicationId: application.id,
        message: requestError.message || "Unable to update this application.",
      });
    } finally {
      setUpdatingApplication(null);
    }
  };

  const unapply = async (application) => {
    setUnapplyingApplication(application.id);
    setActionError("");
    try {
      await apiClient.delete(`/applications/${application.id}/`);
      setApplications((current) =>
        current.filter((item) => item.id !== application.id),
      );
    } catch (requestError) {
      setActionError({
        applicationId: application.id,
        message: requestError.message || "Unable to withdraw this application.",
      });
    } finally {
      setUnapplyingApplication(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Applications
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {isEmployer ? "Received Applications" : "My Applications"}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {isEmployer
              ? "Review and manage applications submitted by job seekers."
              : "Track and manage the jobs you have applied for."}
          </p>
        </div>
        {!isEmployer && (
          <Link
            to="/jobs"
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Find more jobs
          </Link>
        )}
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            label="Total Applications"
            value={applications.length}
            tone="blue"
          />
          {!isEmployer && (
            <SummaryCard
              label="Saved Jobs"
              value={savedJobs.length}
              tone="amber"
            />
          )}
          <SummaryCard
            label="Account Type"
            value={isEmployer ? "Employer" : "Job Seeker"}
            tone="green"
          />
        </div>
      )}

      {loading && (
        <div className="space-y-3" aria-label="Loading applications">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
              <div className="h-5 w-1/3 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-1/4 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              loadApplications();
            }}
            className="mt-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-8">
              <h2 className="text-xl font-bold text-slate-900">
                {isEmployer ? "Applications Received" : "Your Applications"}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {applications.length} Total
              </span>
            </div>

            <div className="p-5 sm:p-8">
              {applications.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-6 py-12 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">
                    No applications found
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                    {isEmployer
                      ? "Applications submitted to your job postings will appear here."
                      : "Once you apply for a job, your application status will appear here."}
                  </p>
                  {!isEmployer && (
                    <Link
                      to="/jobs"
                      className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                      Browse jobs
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="space-y-4">
                  {applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      isEmployer={isEmployer}
                      expanded={expandedApplication === application.id}
                      updating={updatingApplication === application.id}
                      unapplying={unapplyingApplication === application.id}
                      actionError={
                        actionError?.applicationId === application.id
                          ? actionError.message
                          : ""
                      }
                      onToggleDetails={() =>
                        setExpandedApplication((current) =>
                          current === application.id ? null : application.id,
                        )
                      }
                      onStatusUpdate={updateApplicationStatus}
                      onUnapply={unapply}
                    />
                  ))}
                </ul>
              )}
            </div>
          </section>

          {!isEmployer && (
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-8">
                <h2 className="text-xl font-bold text-slate-900">Saved Jobs</h2>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {savedJobs.length} Saved
                </span>
              </div>

              <div className="p-5 sm:p-8">
                {savedJobs.length === 0 ? (
                  <div className="rounded-2xl bg-amber-50/50 px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                      No saved jobs
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Jobs you save for later will appear here.
                    </p>
                    <Link
                      to="/jobs"
                      className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                      Browse jobs
                    </Link>
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {savedJobs.map((savedJob) => (
                      <li
                        key={savedJob.id}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 font-bold text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                            {savedJob.job_title?.charAt(0).toUpperCase() || "J"}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-900 group-hover:text-amber-700">
                              {savedJob.job_title || `Job #${savedJob.job}`}
                            </h3>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Saved job
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/jobs/${savedJob.job}`}
                          aria-label={`View ${savedJob.job_title || "saved job"}`}
                          className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-700 hover:text-white"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
}

function SummaryCard({ label, value, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className={`font-extrabold text-slate-900 ${typeof value === "number" ? "text-3xl" : "text-lg"}`}>
          {value}
        </p>
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
          {tone === "amber" ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
            </svg>
          ) : tone === "green" ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}

function ApplicationCard({
  application,
  isEmployer,
  expanded,
  updating,
  unapplying,
  actionError,
  onToggleDetails,
  onStatusUpdate,
  onUnapply,
}) {
  const canDecide = ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW"].includes(
    application.status,
  );
  const phoneDigits = (application.contact_phone || "").replace(/\D/g, "");
  const whatsappNumber = phoneDigits
    ? phoneDigits.startsWith("977")
      ? phoneDigits
      : `977${phoneDigits.replace(/^0/, "")}`
    : "";

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {isEmployer && (
            <p className="text-sm font-medium text-slate-600">
              Applicant: {application.job_seeker}
            </p>
          )}
          <h2 className="font-semibold text-slate-900">
            {application.job_title || `Job #${application.job}`}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Submitted {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[application.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {STATUS_LABELS[application.status] || application.status}
        </span>
      </div>
      {!isEmployer && application.cover_letter && (
        <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm text-slate-600">
          {application.cover_letter}
        </p>
      )}

      {isEmployer && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleDetails}
            aria-expanded={expanded}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {expanded ? "Hide details" : "View details"}
          </button>
          {canDecide && (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={() => onStatusUpdate(application, "ACCEPTED")}
                className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
              >
                {updating ? "Updating..." : "Approve"}
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => onStatusUpdate(application, "REJECTED")}
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {updating ? "Updating..." : "Reject"}
              </button>
            </>
          )}
        </div>
      )}

      {!isEmployer && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/jobs/${application.job}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View job
          </Link>
          <button
            type="button"
            disabled={unapplying}
            onClick={() => onUnapply(application)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
          >
            {unapplying ? "Withdrawing..." : "Withdraw application"}
          </button>
        </div>
      )}

      {isEmployer && actionError && (
        <p role="alert" className="mt-3 text-sm text-red-700">{actionError}</p>
      )}

      {isEmployer && expanded && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Applicant contact</h3>
            <p className="mt-1 text-sm text-slate-600">
              Email:{" "}
              {application.contact_email ? (
                <a
                  href={`mailto:${application.contact_email}`}
                  className="font-medium text-blue-700 hover:underline"
                >
                  {application.contact_email}
                </a>
              ) : "Not provided"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Phone / WhatsApp: {application.contact_phone || "Not provided"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {application.contact_email && (
                <a
                  href={`mailto:${application.contact_email}`}
                  className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Email applicant
                </a>
              )}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                >
                  WhatsApp applicant
                </a>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Cover letter</h3>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
              {application.cover_letter || "No cover letter provided."}
            </p>
          </div>
          {application.resume && (
            <a
              href={application.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-semibold text-blue-700 hover:underline"
            >
              View resume
            </a>
          )}
        </div>
      )}
    </li>
  );
}

export default MyApplicationsPage;
