import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileSettingsPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:8000/api/v1/accounts/me/', {
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
    const token = localStorage.getItem('access_token');
    try {
      // Send both user and profile fields
      await axios.put('http://localhost:8000/api/v1/accounts/me/', {
        username: profileData.username,
        email: profileData.email,
        ...profileData.profile
      }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error updating settings", err);
      setMessage('Error updating settings.');
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

  if (loading) return <div>Loading...</div>;
  if (!profileData) return <div>Error loading profile.</div>;

  const { role, profile, username, email } = profileData;
  const isEmployer = role === 'ep';

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Account & Profile Settings</h2>
      {message && <p className="text-green-600 font-semibold">{message}</p>}
      
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">User Account</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" value={username || ''} onChange={handleUserChange} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={email || ''} onChange={handleUserChange} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Profile Details</h3>
            {isEmployer ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" name="company_name" value={profile.company_name || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Description</label>
                  <textarea name="company_description" value={profile.company_description || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input type="url" name="website" value={profile.website || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" value={profile.location || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" name="phone" value={profile.phone || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="full_name" value={profile.full_name || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" name="phone" value={profile.phone || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" value={profile.location || ''} onChange={handleProfileChange} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
              </>
            )}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Update Settings</button>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
