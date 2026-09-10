import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileSettingsPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
    setError('');
    setMessage('');
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

  if (loading) return <div>Loading...</div>;
  if (!profileData) return <div>Error loading profile.</div>;

  const { role, profile, username, email } = profileData;
  const isEmployer = role === 'ep';

  return (
    <div className="max-w-4xl mx-auto">

      {/* ========================================= */}
      {/* Page Header */}
      {/* ========================================= */}

      <div className="mb-6">

        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Account & Profile Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and profile details.
        </p>

      </div>


      {/* ========================================= */}
      {/* Main Settings Card */}
      {/* ========================================= */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


        {/* ========================================= */}
        {/* Profile Header */}
        {/* ========================================= */}

        <div className="px-6 sm:px-8 py-6 bg-gray-50/60 border-b border-gray-100">

          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="
          flex h-14 w-14 shrink-0
          items-center justify-center
          rounded-2xl
          bg-gray-900
          text-lg font-semibold text-white
        ">
              {(username || "U").charAt(0).toUpperCase()}
            </div>


            <div className="min-w-0">

              <h3 className="text-base font-semibold text-gray-900 truncate">
                {username || "Your Account"}
              </h3>

              <p className="mt-0.5 text-sm text-gray-500 truncate">
                {email || "No email address"}
              </p>

              {/* Role */}
              <span className="
            inline-flex mt-2
            rounded-full
            bg-blue-50
            px-2.5 py-1
            text-xs font-medium
            text-blue-700
          ">
                {isEmployer ? "Employer Account" : "Job Seeker Account"}
              </span>

            </div>

          </div>

        </div>


        {/* ========================================= */}
        {/* Messages */}
        {/* ========================================= */}

        {(message || error) && (
          <div className="px-6 sm:px-8 pt-5">

            {/* Success */}
            {message && (
              <div className="
            flex items-start gap-3
            rounded-xl
            border border-green-200
            bg-green-50
            px-4 py-3
          ">

                <div className="
              flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-full
              bg-green-100
              text-sm font-bold
              text-green-600
            ">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Changes saved
                  </p>

                  <p className="mt-0.5 text-xs text-green-700">
                    {message}
                  </p>
                </div>

              </div>
            )}


            {/* Error */}
            {error && (
              <div className="
            flex items-start gap-3
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
          ">

                <div className="
              flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-full
              bg-red-100
              text-sm font-bold
              text-red-600
            ">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to save changes
                  </p>

                  <p className="mt-0.5 text-xs text-red-700">
                    {error}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}


        {/* ========================================= */}
        {/* Form */}
        {/* ========================================= */}

        <form onSubmit={handleUpdate}>


          {/* ========================================= */}
          {/* Account Information */}
          {/* ========================================= */}

          <section className="px-6 sm:px-8 py-7">

            {/* Section Header */}
            <div className="flex items-start gap-3 mb-6">

              <div className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            bg-gray-100
            text-gray-700
          ">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>

              </div>

              <div>

                <h3 className="text-base font-semibold text-gray-900">
                  Account Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Update your basic account and login information.
                </p>

              </div>

            </div>


            {/* Account Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


              {/* Username */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={username || ""}
                  onChange={handleUserChange}
                  placeholder="Enter your username"
                  className="
                w-full
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-sm text-gray-900
                placeholder:text-gray-400
                outline-none
                transition-all
                hover:border-gray-300
                focus:border-blue-500
                focus:ring-4 focus:ring-blue-50
              "
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  This name identifies your account.
                </p>

              </div>


              {/* Email */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={email || ""}
                  onChange={handleUserChange}
                  placeholder="you@example.com"
                  className="
                w-full
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-sm text-gray-900
                placeholder:text-gray-400
                outline-none
                transition-all
                hover:border-gray-300
                focus:border-blue-500
                focus:ring-4 focus:ring-blue-50
              "
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  We'll use this email for account notifications.
                </p>

              </div>

            </div>

          </section>


          {/* Divider */}
          <div className="border-t border-gray-100"></div>


          {/* ========================================= */}
          {/* Profile Information */}
          {/* ========================================= */}

          <section className="px-6 sm:px-8 py-7">


            {/* Section Header */}
            <div className="flex items-start gap-3 mb-6">

              <div className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            bg-blue-50
            text-blue-600
          ">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

              </div>

              <div>

                <h3 className="text-base font-semibold text-gray-900">
                  {isEmployer ? "Company Profile" : "Personal Profile"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {isEmployer
                    ? "Tell candidates more about your company."
                    : "Keep your personal profile information up to date."
                  }
                </p>

              </div>

            </div>


            {/* ========================================= */}
            {/* Employer */}
            {/* ========================================= */}

            {isEmployer ? (

              <div className="space-y-5">


                {/* Company Name */}
                <div>

                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="company_name"
                    value={profile.company_name || ""}
                    onChange={handleProfileChange}
                    placeholder="e.g. Acme Technologies"
                    className="
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition-all
                  hover:border-gray-300
                  focus:border-blue-500
                  focus:ring-4 focus:ring-blue-50
                "
                  />

                </div>


                {/* Company Description */}
                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-medium text-gray-800">
                      Company Description
                    </label>

                    <span className="text-xs text-gray-400">
                      Optional
                    </span>

                  </div>

                  <textarea
                    name="company_description"
                    value={profile.company_description || ""}
                    onChange={handleProfileChange}
                    placeholder="Describe your company, culture, mission, and what makes your organization unique..."
                    rows="5"
                    className="
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm leading-6 text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  resize-y
                  transition-all
                  hover:border-gray-300
                  focus:border-blue-500
                  focus:ring-4 focus:ring-blue-50
                "
                  />

                </div>


                {/* Website + Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                  {/* Website */}
                  <div>

                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Website
                    </label>

                    <input
                      type="url"
                      name="website"
                      value={profile.website || ""}
                      onChange={handleProfileChange}
                      placeholder="https://example.com"
                      className="
                    w-full rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    hover:border-gray-300
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-50
                  "
                    />

                  </div>


                  {/* Location */}
                  <div>

                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={profile.location || ""}
                      onChange={handleProfileChange}
                      placeholder="e.g. Kathmandu, Nepal"
                      className="
                    w-full rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    hover:border-gray-300
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-50
                  "
                    />

                  </div>

                </div>


                {/* Phone */}
                <div>

                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className="
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition-all
                  hover:border-gray-300
                  focus:border-blue-500
                  focus:ring-4 focus:ring-blue-50
                "
                  />

                </div>

              </div>


            ) : (


              /* ========================================= */
              /* Job Seeker */
              /* ========================================= */

              <div className="space-y-5">


                {/* Full Name */}
                <div>

                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name || ""}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition-all
                  hover:border-gray-300
                  focus:border-blue-500
                  focus:ring-4 focus:ring-blue-50
                "
                  />

                </div>


                {/* Phone + Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                  {/* Phone */}
                  <div>

                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleProfileChange}
                      placeholder="Enter your phone number"
                      className="
                    w-full rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    hover:border-gray-300
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-50
                  "
                    />

                  </div>


                  {/* Location */}
                  <div>

                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={profile.location || ""}
                      onChange={handleProfileChange}
                      placeholder="e.g. Kathmandu, Nepal"
                      className="
                    w-full rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    hover:border-gray-300
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-50
                  "
                    />

                  </div>

                </div>

              </div>

            )}

          </section>


          {/* ========================================= */}
          {/* Save Footer */}
          {/* ========================================= */}

          <div className="
        border-t border-gray-100
        bg-gray-50/60
        px-6 sm:px-8
        py-5
      ">

            <div className="
          flex flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        ">

              <div>

                <p className="text-sm font-medium text-gray-700">
                  Keep your information updated
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Your changes will be applied to your profile.
                </p>

              </div>


              <button
                type="submit"
                className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gray-900
              px-6 py-3
              text-sm font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-gray-800
              hover:shadow-md
              focus:outline-none
              focus:ring-4
              focus:ring-gray-200
              active:scale-[0.98]
            "
              >

                {/* Save Icon */}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                Update Settings

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>


  );
};

export default ProfileSettingsPage;
