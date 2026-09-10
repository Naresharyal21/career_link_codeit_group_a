import { useEffect, useState } from 'react';
import axios from 'axios';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:8000/api/v1/jobs/manage/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const jobsData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete('http://localhost:8000/api/v1/jobs/manage/' + jobId + '/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

  {/* Header */}
  <div className="px-6 py-5 border-b border-gray-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          Manage Job Postings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Review and manage your current job openings.
        </p>
      </div>

      <div className="text-sm text-gray-500">
        {jobs?.length || 0} job postings
      </div>

    </div>
  </div>


  {/* Table */}
  <div className="overflow-x-auto">

    <table className="w-full min-w-[900px] text-left">

      {/* Table Head */}
      <thead className="bg-gray-50/70">

        <tr className="border-b border-gray-100">

          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Job Posting
          </th>

          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Applicants
          </th>

          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Posted
          </th>

          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Deadline
          </th>

          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
            Actions
          </th>

        </tr>

      </thead>


      {/* Table Body */}
      <tbody className="divide-y divide-gray-100">

        {Array.isArray(jobs) && jobs.map((job) => (

          <tr
            key={job.id}
            className="group transition-colors hover:bg-gray-50/70"
          >

            {/* Job Posting */}
            <td className="px-6 py-5">

              <div className="flex items-start gap-3">

                {/* Job Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 font-semibold">
                  {job.title?.charAt(0)?.toUpperCase() || "J"}
                </div>

                {/* Job Details */}
                <div className="min-w-0">

                  <h3 className="font-semibold text-gray-900 truncate max-w-sm">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 truncate max-w-md">
                    {job.description || "No description available"}
                  </p>

                  {job.location && (
                    <p className="mt-1.5 text-xs text-gray-400">
                      📍 {job.location}
                    </p>
                  )}

                </div>

              </div>

            </td>


            {/* Applicants */}
            <td className="px-6 py-5">

              <div className="inline-flex items-center gap-2">

                <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                  {job.applicant_count || 0}
                </span>

                <span className="text-sm text-gray-500">
                  applicants
                </span>

              </div>

            </td>


            {/* Posted Date */}
            <td className="px-6 py-5 whitespace-nowrap">

              <p className="text-sm font-medium text-gray-700">
                {new Date(job.created_at).toLocaleDateString()}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Posted
              </p>

            </td>


            {/* Deadline */}
            <td className="px-6 py-5 whitespace-nowrap">

              {job.deadline ? (

                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {job.deadline}
                </span>

              ) : (

                <span className="text-sm text-gray-400">
                  No deadline
                </span>

              )}

            </td>


            {/* Actions */}
            <td className="px-6 py-5">

              <div className="flex items-center justify-end gap-2">

                {/* View Button */}
                <button
                  onClick={() => setSelectedJob(job)}
                  className="
                    inline-flex items-center justify-center
                    rounded-lg border border-gray-200
                    bg-white px-3.5 py-2
                    text-sm font-medium text-gray-700
                    shadow-sm
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    focus:outline-none
                    focus:ring-2 focus:ring-gray-200
                  "
                >
                  View
                </button>


                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(job.id)}
                  className="
                    inline-flex items-center justify-center
                    rounded-lg px-3.5 py-2
                    text-sm font-medium text-red-600
                    transition
                    hover:bg-red-50
                    focus:outline-none
                    focus:ring-2 focus:ring-red-100
                  "
                >
                  Delete
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>


  {/* Empty State */}
  {Array.isArray(jobs) && jobs.length === 0 && (

    <div className="px-6 py-16 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        📋
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-900">
        No job postings
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        You haven't created any job postings yet.
      </p>

    </div>

  )}


  {/* ============================= */}
  {/* Job Details Modal */}
  {/* ============================= */}

  {selectedJob && (

    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-gray-900/50 backdrop-blur-sm
        p-4
      "
    >

      <div
        className="
          w-full max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-5">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Job Posting
              </p>

              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                {selectedJob.title}
              </h3>

              {selectedJob.location && (
                <p className="mt-1 text-sm text-gray-500">
                  📍 {selectedJob.location}
                </p>
              )}

            </div>


            {/* Close Icon */}
            <button
              onClick={() => setSelectedJob(null)}
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-700
                transition
              "
            >
              ✕
            </button>

          </div>

        </div>


        {/* Modal Content */}
        <div className="px-6 py-6 space-y-6">


          {/* Description */}
          <div>

            <h4 className="text-sm font-semibold text-gray-900">
              Description
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {selectedJob.description || "N/A"}
            </p>

          </div>


          {/* Responsibilities */}
          <div>

            <h4 className="text-sm font-semibold text-gray-900">
              Responsibilities
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-600 whitespace-pre-line">
              {selectedJob.responsibilities || "N/A"}
            </p>

          </div>


          {/* Requirements */}
          <div>

            <h4 className="text-sm font-semibold text-gray-900">
              Requirements
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-600 whitespace-pre-line">
              {selectedJob.requirements || "N/A"}
            </p>

          </div>


          {/* Benefits */}
          <div>

            <h4 className="text-sm font-semibold text-gray-900">
              Benefits
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-600 whitespace-pre-line">
              {selectedJob.benefits || "N/A"}
            </p>

          </div>


          {/* Job Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


            {/* Location */}
            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-medium text-gray-500">
                Location
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {selectedJob.location || "N/A"}
              </p>

            </div>


            {/* Salary */}
            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-medium text-gray-500">
                Salary
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {selectedJob.salary_min || "N/A"} -{" "}
                {selectedJob.salary_max || "N/A"}
              </p>

            </div>


            {/* Applicants */}
            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-medium text-gray-500">
                Applicants
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {selectedJob.applicant_count || 0}
              </p>

            </div>


            {/* Deadline */}
            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-medium text-gray-500">
                Application Deadline
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {selectedJob.deadline || "No deadline"}
              </p>

            </div>

          </div>

        </div>


        {/* Modal Footer */}
        <div className="border-t border-gray-100 px-6 py-4">

          <button
            onClick={() => setSelectedJob(null)}
            className="
              w-full rounded-lg
              bg-gray-900 px-4 py-2.5
              text-sm font-semibold text-white
              transition
              hover:bg-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-gray-300
            "
          >
            Close
          </button>

        </div>

      </div>

    </div>

  )}

</div>
  );
};

export default ManageJobsPage;
