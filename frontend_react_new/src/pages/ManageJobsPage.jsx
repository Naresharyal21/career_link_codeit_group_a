import { useEffect, useState } from 'react';
import apiClient from '../api';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await apiClient.get('/jobs/manage/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const jobsData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const token = sessionStorage.getItem('access_token');
    try {
      await apiClient.delete('/jobs/manage/' + jobId + '/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse max-w-7xl mx-auto">
        <div className="h-10 bg-gray-200 rounded w-64 mb-8" />
        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wider">Employer</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Manage Postings</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Review and manage your current job openings.</p>
        </div>
        <div className="badge badge-default text-sm py-2 px-4 shadow-sm">
          {jobs?.length || 0} active postings
        </div>
      </div>

      {/* ─── Table Card ─── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Posting</th>
                <th>Applicants</th>
                <th>Posted Date</th>
                <th>Deadline</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(jobs) && jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-bold shadow-sm">
                          {job.title?.charAt(0)?.toUpperCase() || "J"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate max-w-sm hover:text-blue-700 transition-colors">
                            {job.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 truncate max-w-sm">
                            {job.description || "No description"}
                          </p>
                          {job.location && (
                            <p className="mt-1.5 text-xs font-medium text-gray-400 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {job.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        <span className="font-bold mr-1">{job.applicant_count || 0}</span>
                        applicants
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-700">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="whitespace-nowrap">
                      {job.deadline ? (
                        <span className="badge badge-warning">{job.deadline}</span>
                      ) : (
                        <span className="text-sm font-medium text-gray-400">No deadline</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedJob(job)} className="btn-secondary py-2 px-3 text-xs">
                          View
                        </button>
                        <button onClick={() => handleDelete(job.id)} className="btn-danger py-2 px-3 text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="empty-state-icon">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-gray-900">No job postings</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't created any job postings yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Job Details Modal ─── */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-box">
            
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Job Posting Details</p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">{selectedJob.title}</h3>
                {selectedJob.location && (
                  <p className="mt-1 text-sm font-medium text-gray-500">📍 {selectedJob.location}</p>
                )}
              </div>
              <button onClick={() => setSelectedJob(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                ✕
              </button>
            </div>

            <div className="px-8 py-8 space-y-8">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card !p-4 bg-gray-50/50">
                  <p className="text-xs font-semibold text-gray-500">Location</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{selectedJob.location || "N/A"}</p>
                </div>
                <div className="stat-card !p-4 bg-emerald-50/30">
                  <p className="text-xs font-semibold text-emerald-600">Salary Range</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {selectedJob.salary_min || "N/A"} - {selectedJob.salary_max || "N/A"}
                  </p>
                </div>
                <div className="stat-card !p-4 bg-blue-50/30">
                  <p className="text-xs font-semibold text-blue-600">Applicants</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{selectedJob.applicant_count || 0}</p>
                </div>
                <div className="stat-card !p-4 bg-amber-50/30">
                  <p className="text-xs font-semibold text-amber-600">Deadline</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{selectedJob.deadline || "None"}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Description
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 bg-gray-50 p-4 rounded-xl">{selectedJob.description || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Responsibilities
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-xl">{selectedJob.responsibilities || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Requirements
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-xl">{selectedJob.requirements || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Benefits
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-xl">{selectedJob.benefits || "N/A"}</p>
                </div>
              </div>

            </div>

            <div className="border-t border-gray-100 px-8 py-5 bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedJob(null)} className="btn-secondary px-6">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;
