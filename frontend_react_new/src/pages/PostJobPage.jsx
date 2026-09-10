import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', responsibilities: '', requirements: '', benefits: '',
    location: '', salary_min: '', salary_max: '', job_type: 'FT', experience_level: 'EN',
    deadline: '', category: '', skills: []
  });
  const [categories, setCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, skillRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/jobs/categories/'),
          axios.get('http://localhost:8000/api/v1/jobs/skills/')
        ]);

        // Ensure array mapping
        setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data.results || []));
        setAllSkills(Array.isArray(skillRes.data) ? skillRes.data : (skillRes.data.results || []));
      } catch (err) {
        console.error("Error fetching form data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'skills') {
      const options = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, skills: options });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const cleanedData = { ...formData };
    if (!cleanedData.category) delete cleanedData.category;
    if (cleanedData.skills.length === 0) delete cleanedData.skills;
    if (!cleanedData.deadline) delete cleanedData.deadline;

    try {
      await axios.post('http://localhost:8000/api/v1/jobs/manage/', cleanedData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      navigate('/dashboard/manage-jobs');
    } catch (err) {
      console.error("Error posting job", err.response?.data);
      alert("Failed to post job: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Post a New Job
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a new job posting and find the right candidates for your team.
        </p>
      </div>


      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <form onSubmit={handleSubmit}>

          {/* ========================= */}
          {/* Basic Information */}
          {/* ========================= */}

          <div className="px-6 sm:px-8 py-7">

            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">
                Basic Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Start with the basic details about the position.
              </p>
            </div>


            {/* Job Title */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-800 mb-2">
                Job Title
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-sm text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-50
              hover:border-gray-300
            "
                required
              />

            </div>


            {/* Category + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Category */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
                w-full rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-sm text-gray-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4 focus:ring-blue-50
                hover:border-gray-300
              "
                  required
                >

                  <option value="">
                    Select a category
                  </option>

                  {Array.isArray(categories) &&
                    categories.map(function (cat) {
                      return (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      );
                    })}

                </select>

              </div>


              {/* Location */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="
                w-full rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-sm text-gray-900
                placeholder:text-gray-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4 focus:ring-blue-50
                hover:border-gray-300
              "
                />

              </div>

            </div>

          </div>


          {/* Divider */}
          <div className="border-t border-gray-100"></div>


          {/* ========================= */}
          {/* Job Description */}
          {/* ========================= */}

          <div className="px-6 sm:px-8 py-7">

            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">
                Job Description
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Provide candidates with a clear overview of the position.
              </p>
            </div>


            {/* Description */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, team, and what the successful candidate will be working on..."
                rows="5"
                className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-sm leading-6 text-gray-900
              placeholder:text-gray-400
              outline-none
              resize-y
              transition
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-50
              hover:border-gray-300
            "
                required
              />

            </div>


            {/* Responsibilities */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-800 mb-2">
                Responsibilities
                <span className="ml-2 text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="List the main responsibilities and day-to-day tasks..."
                rows="4"
                className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-sm leading-6 text-gray-900
              placeholder:text-gray-400
              outline-none
              resize-y
              transition
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-50
              hover:border-gray-300
            "
              />

            </div>


            {/* Requirements */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-800 mb-2">
                Requirements
                <span className="ml-2 text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Mention required qualifications, experience, education, or other requirements..."
                rows="4"
                className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-sm leading-6 text-gray-900
              placeholder:text-gray-400
              outline-none
              resize-y
              transition
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-50
              hover:border-gray-300
            "
              />

            </div>


            {/* Benefits */}
            <div>

              <label className="block text-sm font-medium text-gray-800 mb-2">
                Benefits
                <span className="ml-2 text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Describe salary benefits, flexible work, insurance, bonuses, or other perks..."
                rows="4"
                className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-sm leading-6 text-gray-900
              placeholder:text-gray-400
              outline-none
              resize-y
              transition
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-50
              hover:border-gray-300
            "
              />

            </div>

          </div>


          {/* Divider */}
          <div className="border-t border-gray-100"></div>


          {/* ========================= */}
          {/* Compensation & Deadline */}
          {/* ========================= */}

          <div className="px-6 sm:px-8 py-7">

            <div className="mb-6">

              <h3 className="text-base font-semibold text-gray-900">
                Compensation & Deadline
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Set the expected salary range and application deadline.
              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Minimum Salary */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Minimum Salary
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    $
                  </span>

                  <input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    placeholder="40,000"
                    className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-white
                  pl-8 pr-4 py-3
                  text-sm text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4 focus:ring-blue-50
                  hover:border-gray-300
                "
                  />

                </div>

              </div>


              {/* Maximum Salary */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Maximum Salary
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    $
                  </span>

                  <input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    placeholder="70,000"
                    className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-white
                  pl-8 pr-4 py-3
                  text-sm text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4 focus:ring-blue-50
                  hover:border-gray-300
                "
                  />

                </div>

              </div>


              {/* Deadline */}
              <div>

                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="
                w-full rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-sm text-gray-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4 focus:ring-blue-50
                hover:border-gray-300
              "
                />

              </div>

            </div>

          </div>


          {/* Divider */}
          <div className="border-t border-gray-100"></div>


          {/* ========================= */}
          {/* Skills */}
          {/* ========================= */}

          <div className="px-6 sm:px-8 py-7">

            <div className="mb-6">

              <h3 className="text-base font-semibold text-gray-900">
                Required Skills
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Select the skills that candidates should have for this position.
              </p>

            </div>


            <div>

              <label className="block text-sm font-medium text-gray-800 mb-2">
                Skills
              </label>

              <select
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleChange}
                className="
              w-full
              h-40
              rounded-xl
              border border-gray-200
              bg-white
              px-3 py-2
              text-sm text-gray-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-50
              hover:border-gray-300
            "
              >

                {Array.isArray(allSkills) &&
                  allSkills.map(function (skill) {
                    return (
                      <option
                        key={skill.id}
                        value={skill.id}
                        className="px-3 py-2 rounded-lg"
                      >
                        {skill.name}
                      </option>
                    );
                  })}

              </select>

              <p className="mt-2 text-xs text-gray-400">
                Hold Ctrl (Windows) or Command (Mac) to select multiple skills.
              </p>

            </div>

          </div>


          {/* ========================= */}
          {/* Form Footer */}
          {/* ========================= */}

          <div className="border-t border-gray-100 bg-gray-50/60 px-6 sm:px-8 py-5">

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">

              <p className="text-xs text-gray-400">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>

              <button
                type="submit"
                className="
              inline-flex items-center justify-center
              rounded-xl
              bg-gray-900
              px-6 py-3
              text-sm font-semibold text-white
              shadow-sm
              transition
              hover:bg-gray-800
              hover:shadow
              focus:outline-none
              focus:ring-4 focus:ring-gray-200
              active:scale-[0.99]
            "
              >
                Post Job
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>


  );
};

export default PostJobPage;
