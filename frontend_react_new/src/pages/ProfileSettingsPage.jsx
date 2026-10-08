import { useEffect, useState } from 'react';
import apiClient from '../api';

const ProfileSettingsPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await apiClient.get('/accounts/me/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setProfileData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile", err);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('access_token');
    setError('');
    setMessage('');
    try {
      await apiClient.put('/accounts/me/', {
        username: profileData.username,
        email: profileData.email,
        ...profileData.profile
      }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error updating settings", err.response?.data);
      setError('Error updating settings: ' + JSON.stringify(err.response?.data));
    }
  };

  const handleUserChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      profile: { ...profileData.profile, [e.target.name]: e.target.value }
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-[400px] bg-gray-200 rounded-3xl" />
      </div>
    );
  }
  
  if (!profileData) return <div className="text-gray-500">Error loading profile.</div>;

  const { role, profile, username, email } = profileData;
  const isEmployer = role === 'ep';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* ─── Header ─── */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Account & Profile Settings</h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">Manage your account information and profile details.</p>
      </div>

      {/* ─── Main Card ─── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
        
        {/* Profile Banner */}
        <div className="px-6 sm:px-8 py-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-100 z-10" style={{ background: 'linear-gradient(135deg, #1d4ed8, #4338ca)' }}>
            {(username || "U").charAt(0).toUpperCase()}
          </div>
          
          <div className="min-w-0 z-10">
            <h3 className="text-xl font-bold text-gray-900 truncate">{username || "Your Account"}</h3>
            <p className="text-sm font-medium text-gray-500 truncate">{email || "No email address"}</p>
            <span className="badge badge-info mt-2">{isEmployer ? "Employer Account" : "Job Seeker Account"}</span>
          </div>
        </div>

        {/* Alerts */}
        {(message || error) && (
          <div className="px-6 sm:px-8 pt-6">
            {message && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-fade-in-up">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">✓</div>
                <div>
                  <p className="text-sm font-bold text-green-800">Changes saved</p>
                  <p className="text-xs text-green-700 mt-0.5">{message}</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in-up">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold text-sm">!</div>
                <div>
                  <p className="text-sm font-bold text-red-800">Unable to save changes</p>
                  <p className="text-xs text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdate}>

          {/* Account Info */}
          <div className="px-6 sm:px-8 py-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
                <p className="text-sm font-medium text-gray-500">Update your basic account and login information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Username</label>
                <input type="text" name="username" value={username || ""} onChange={handleUserChange} placeholder="Enter your username" className="form-input" />
              </div>
              <div>
                <label className="form-label" htmlFor="profile-email">Email Address</label>
                <input id="profile-email" type="email" name="email" value={email || ""} readOnly aria-describedby="email-change-help" className="form-input bg-gray-100" />
                <p id="email-change-help" className="mt-1 text-xs text-gray-500">
                  Email changes require verification.
                </p>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Profile Info */}
          <div className="px-6 sm:px-8 py-8 bg-gray-50/30">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{isEmployer ? "Company Profile" : "Personal Profile"}</h3>
                <p className="text-sm font-medium text-gray-500">{isEmployer ? "Tell candidates more about your company." : "Keep your personal profile information up to date."}</p>
              </div>
            </div>

            {isEmployer ? (
              <div className="space-y-5">
                <div>
                  <label className="form-label">Company Name</label>
                  <input type="text" name="company_name" value={profile.company_name || ""} onChange={handleProfileChange} placeholder="e.g. Acme Corp" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Company Description</label>
                  <textarea name="company_description" value={profile.company_description || ""} onChange={handleProfileChange} placeholder="Describe your company..." rows="4" className="form-input" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Website</label>
                    <input type="url" name="website" value={profile.website || ""} onChange={handleProfileChange} placeholder="https://example.com" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Location</label>
                    <input type="text" name="location" value={profile.location || ""} onChange={handleProfileChange} placeholder="e.g. Kathmandu" className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input type="text" name="phone" value={profile.phone || ""} onChange={handleProfileChange} placeholder="Phone number" className="form-input" />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="full_name" value={profile.full_name || ""} onChange={handleProfileChange} placeholder="Enter your full name" className="form-input" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input type="text" name="phone" value={profile.phone || ""} onChange={handleProfileChange} placeholder="Enter your phone number" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Location</label>
                    <input type="text" name="location" value={profile.location || ""} onChange={handleProfileChange} placeholder="e.g. Kathmandu, Nepal" className="form-input" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 sm:px-8 py-5 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Keep your information updated.</p>
            <button type="submit" className="btn-primary">Update Settings</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
