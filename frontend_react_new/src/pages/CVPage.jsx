import { useEffect, useState } from 'react';
import axios from 'axios';

const CVPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:8000/api/v1/accounts/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Error fetching profile", err);
      setError("Failed to load CV information.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    
    const token = sessionStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('resume_file', file);

    setUploading(true);
    setError('');
    setMessage('');

    try {
      // Use PUT since the backend only defines get and put for UserProfileView
      const res = await axios.put('http://localhost:8000/api/v1/accounts/me/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage("CV uploaded successfully!");
      setFile(null);
      fetchProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error uploading CV", err.response?.data);
      setError("Failed to upload CV. " + (err.response?.data?.error || ""));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">My CV / Resume</h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">Manage your resume to apply for jobs quickly.</p>
      </div>

      {/* Alerts */}
      {(message || error) && (
        <div className="pt-2">
          {message && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-fade-in-up">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">✓</div>
              <div>
                <p className="text-sm font-bold text-green-800">Success</p>
                <p className="text-xs text-green-700 mt-0.5">{message}</p>
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in-up">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold text-sm">!</div>
              <div>
                <p className="text-sm font-bold text-red-800">Upload failed</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8">
        
        {/* Current CV Display */}
        {profile?.resume_file ? (
          <div className="mb-8">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 truncate">Current Resume</h3>
                <p className="text-xs text-gray-500 mt-0.5">Uploaded successfully</p>
              </div>
              <a 
                href={profile.resume_file.startsWith('http') ? profile.resume_file : `http://localhost:8000${profile.resume_file}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary py-2 px-4 text-xs shrink-0"
              >
                View CV
              </a>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center py-6 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-300">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-900">No CV found</p>
            <p className="text-xs text-gray-500 mt-1">You haven't uploaded a CV yet. Employers cannot review your application properly without one.</p>
          </div>
        )}

        {/* Upload Form */}
        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {profile?.resume_file ? "Update CV" : "Upload CV"}
          </h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select File (PDF, DOC, DOCX)</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                required
              />
            </div>
            <button type="submit" disabled={uploading || !file} className="btn-primary mt-2">
              {uploading ? "Uploading..." : "Upload CV"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CVPage;
