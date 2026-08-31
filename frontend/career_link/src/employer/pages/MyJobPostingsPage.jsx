import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyJobPostings } from "../../apis/employerJobsApi";

const JOB_TYPE_LABELS = {
  FT: "Full-time",
  PT: "Part-time",
  RM: "Remote",
  CT: "Contract",
};

const MyJobPostingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyJobPostings()
      .then((data) => setJobs(data))
      .catch((err) => setError(err.message || "Failed to load your job postings."))
      .finally(() => setLoading(false));
  }, []);

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
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
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
        {jobs.map((job) => (
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
            <span
              className={
                job.is_active
                  ? "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                  : "px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600"
              }
            >
              {job.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobPostingsPage;
