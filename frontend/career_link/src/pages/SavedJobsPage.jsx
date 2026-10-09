import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../apis/apiClient";

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const loadSavedJobs = useCallback(async () => {
    try {
      const response = await apiClient.get("/applications/saved-jobs/");
      setSavedJobs(Array.isArray(response) ? response : response?.results || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load saved jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiClient
      .get("/applications/saved-jobs/")
      .then((response) => {
        if (active) {
          setSavedJobs(Array.isArray(response) ? response : response?.results || []);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load saved jobs.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const removeSavedJob = async (id) => {
    setRemovingId(id);
    setError("");
    try {
      await apiClient.delete(`/applications/saved-jobs/${id}/`);
      setSavedJobs((jobs) => jobs.filter((job) => job.id !== id));
    } catch (requestError) {
      setError(requestError.message || "Unable to remove this saved job.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved jobs</h1>
          <p className="mt-1 text-sm text-slate-600">Keep interesting opportunities in one place.</p>
        </div>
        <Link to="/jobs" className="text-sm font-semibold text-blue-700 hover:underline">
          Browse jobs
        </Link>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              loadSavedJobs();
            }}
            className="ml-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && <p className="rounded-2xl bg-white p-6 text-sm text-slate-600">Loading saved jobs…</p>}

      {!loading && !error && savedJobs.length === 0 && (
        <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No saved jobs yet</h2>
          <p className="mt-2 text-sm text-slate-600">Save listings while browsing to come back to them later.</p>
          <Link to="/jobs" className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            Explore jobs
          </Link>
        </div>
      )}

      {!loading && savedJobs.length > 0 && (
        <ul className="space-y-3">
          {savedJobs.map((savedJob) => (
            <li key={savedJob.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <Link to={`/jobs/${savedJob.job}`} className="font-semibold text-slate-900 hover:text-blue-700">
                  {savedJob.job_title || `Job #${savedJob.job}`}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  Saved {new Date(savedJob.saved_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/jobs/${savedJob.job}`} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                  View job
                </Link>
                <button
                  type="button"
                  disabled={removingId === savedJob.id}
                  onClick={() => removeSavedJob(savedJob.id)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {removingId === savedJob.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SavedJobsPage;
