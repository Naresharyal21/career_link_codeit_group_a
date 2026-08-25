import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const config = token ? { headers: { Authorization: 'Bearer ' + token } } : {};
        
        // Fetch Job Details
        const jobRes = await axios.get('http://localhost:8000/api/v1/jobs/' + id + '/');
        setJob(jobRes.data);

        // Check if already applied
        if (token) {
            const appRes = await axios.get('http://localhost:8000/api/v1/applications/', config);
            const applied = appRes.data.some(app => String(app.job) === String(id));
            setHasApplied(applied);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        navigate('/login');
        return;
    }
    try {
        await axios.post('http://localhost:8000/api/v1/applications/', 
            { job: id }, 
            { headers: { Authorization: 'Bearer ' + token } }
        );
        
        setHasApplied(true);
        setSuccessMessage('Application submitted successfully!');
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);

    } catch (err) {
        console.error("Error applying for job", err);
        alert('Failed to apply. You might have already applied.');
    }
  };

  if (!job) return <div className="p-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow rounded-lg mt-8 relative">
      {successMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
            {successMessage}
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
      <p className="text-xl text-gray-600 mb-6">{job.employer ? job.employer.company_name : 'N/A'}</p>
      
      <div className="prose max-w-none mb-8">
        <h3 className="font-semibold text-lg">Description</h3>
        <p>{job.description}</p>
        <h3 className="font-semibold text-lg mt-4">Requirements</h3>
        <p>{job.requirements}</p>
      </div>

      {hasApplied ? (
        <button 
            disabled
            className="bg-gray-400 text-white px-8 py-3 rounded-lg font-bold cursor-not-allowed"
        >
            Applied
        </button>
      ) : (
        <button 
            onClick={handleApply}
            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition"
        >
            Apply Now
        </button>
      )}
    </div>
  );
};

export default JobDetailPage;
