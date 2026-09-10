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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Manage Job Postings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-600">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Posted</th>
              <th className="py-3 px-4">Deadline</th>
              <th className="py-3 px-4">Applicants</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(jobs) && jobs.map(function(job) {
              return (
                <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{job.description}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{new Date(job.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{job.deadline || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-blue-600">{job.applicant_count || 0}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => setSelectedJob(job)} className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                    <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Job Details */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{selectedJob.title}</h3>
            <div className="space-y-3 text-gray-700">
                <p><strong>Description:</strong> {selectedJob.description}</p>
                <p><strong>Responsibilities:</strong> {selectedJob.responsibilities || 'N/A'}</p>
                <p><strong>Requirements:</strong> {selectedJob.requirements || 'N/A'}</p>
                <p><strong>Benefits:</strong> {selectedJob.benefits || 'N/A'}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Salary:</strong> {selectedJob.salary_min} - {selectedJob.salary_max}</p>
            </div>
            <button 
                onClick={() => setSelectedJob(null)} 
                className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
                Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;
