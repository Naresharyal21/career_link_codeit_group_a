import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useJobs from "../../hooks/useJobs";

const JOB_TYPE_LABELS = {
  FT: "Full-time",
  PT: "Part-time",
  RM: "Remote",
  CT: "Contract",
};

const MyJobPostingsPage = () => {
  const navigate = useNavigate();
  const { data: jobs, loading, error, fetchMyJobPostings } = useJobs();
  const { removeJob } = useJobs();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const loadJobs = () => {
    fetchMyJobPostings().catch(() => {});
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const jobList = jobs || [];

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeleteError(null);
    setDeletingId(id);
    try {
      await removeJob(id);
      loadJobs();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete job posting.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Job Postings</h2>
        <Link
          to="/employer/post-job"
          className="bg-[#0f2a52] text-white px-4 py-2 rounded hover:bg-[#173a6e] transition-colors"
        >
          + Post New Job
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm mb-4">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm mb-4">
          {deleteError}
        </div>
      )}

      {!loading && !error && jobList.length === 0 && (
        <div className="bg-gray-50 shadow shadow-black/12 rounded p-8 text-center">
          <p className="text-gray-600">You haven't posted any jobs yet.</p>
          <Link
            to="/employer/post-job"
            className="inline-block mt-4 bg-[#0f2a52] text-white px-4 py-2 rounded hover:bg-[#173a6e] transition-colors"
          >
            Post your first job
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {jobList.map((job) => (
          <div
            key={job.id}
            className="bg-gray-50 shadow shadow-black/12 rounded p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.location} · {JOB_TYPE_LABELS[job.job_type] || job.job_type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={
                  job.is_active
                    ? "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                    : "px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600"
                }
              >
                {job.is_active ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => navigate(`/employer/edit-job/${job.id}`)}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm text-[#0f2a52] hover:bg-gray-100 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(job.id, job.title)}
                disabled={deletingId === job.id}
                className="px-3 py-1.5 rounded border border-red-200 text-sm text-red-700 hover:bg-red-50 cursor-pointer disabled:opacity-50"
              >
                {deletingId === job.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobPostingsPage;
