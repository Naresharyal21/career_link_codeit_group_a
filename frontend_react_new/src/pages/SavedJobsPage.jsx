import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: 'Bearer ' + token } };
        const response = await axios.get('http://localhost:8000/api/v1/applications/saved-jobs/', config);
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        console.log("First job item structure:", data[0]);
        setSavedJobs(data);
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      }
    };
    fetchSavedJobs();
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
      <div className="grid gap-4">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <div key={job.id} className="p-4 bg-white rounded shadow border">
              {job ? (
                <>
                  <h2 className="text-lg font-semibold">{job.job_title}</h2>
                  <p className="text-gray-600">Job ID: {job.job}</p>
                </>
              ) : (
                <p className="text-red-500">Job details unavailable</p>
              )}
            </div>
          ))
        ) : (
          <p>No saved jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
