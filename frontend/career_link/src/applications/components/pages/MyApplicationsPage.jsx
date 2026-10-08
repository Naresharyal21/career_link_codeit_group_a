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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      const response = await apiClient.get("/applications/");
      setApplications(Array.isArray(response) ? response : response?.results || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiClient
      .get("/applications/")
      .then((response) => {
        if (active) {
          setApplications(Array.isArray(response) ? response : response?.results || []);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load applications.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const isEmployer = user?.role === "ep";

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEmployer ? "Received applications" : "My applications"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isEmployer
              ? "Review candidates who applied to your job postings."
              : "Track the latest status of your job applications."}
          </p>
        </div>
        {!isEmployer && (
          <Link to="/jobs" className="text-sm font-semibold text-blue-700 hover:underline">
            Find more jobs
          </Link>
        )}
      </div>

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

      {!loading && !error && applications.length === 0 && (
        <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Nothing here yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            {isEmployer
              ? "New applications to your jobs will appear here."
              : "When you apply for a job, you can follow its progress here."}
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
      )}

      {!loading && !error && applications.length > 0 && (
        <ul className="space-y-3">
          {applications.map((application) => (
            <li key={application.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {application.job_title || `Job #${application.job}`}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Submitted{" "}
                    {new Date(application.created_at).toLocaleDateString()}
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
              {application.cover_letter && (
                <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm text-slate-600">
                  {application.cover_letter}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MyApplicationsPage;
