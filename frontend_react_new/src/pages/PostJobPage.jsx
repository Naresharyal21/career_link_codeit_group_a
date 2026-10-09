import { useState, useEffect } from 'react';
import apiClient from '../api';
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
          apiClient.get('/jobs/categories/'),
          apiClient.get('/jobs/skills/')
        ]);
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
    const token = sessionStorage.getItem('access_token');

    const cleanedData = { ...formData };
    if (!cleanedData.category) delete cleanedData.category;
    if (cleanedData.skills.length === 0) delete cleanedData.skills;
    if (!cleanedData.deadline) delete cleanedData.deadline;

    try {
      await apiClient.post('/jobs/manage/', cleanedData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      navigate('/dashboard/manage-jobs');
    } catch (err) {
      console.error("Error posting job", err.response?.data);
      alert("Failed to post job: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* ─── Header ─── */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Post a New Job</h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">Create a new job posting and find the right candidates for your team.</p>
      </div>

      {/* ─── Form Card ─── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <div className="px-6 sm:px-8 py-7">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
              Basic Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="form-label">Job Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Software Engineer" className="form-input" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Category <span className="text-red-500">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className="form-input" required>
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kathmandu, Nepal" className="form-input" />
                </div>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Details */}
          <div className="px-6 sm:px-8 py-7 bg-gray-50/30">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
              Job Description
            </h3>

            <div className="space-y-5">
              <div>
                <label className="form-label">Description <span className="text-red-500">*</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the role, team, and what the successful candidate will be working on..." rows="5" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Responsibilities <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="List the main responsibilities..." rows="4" className="form-input" />
              </div>
              <div>
                <label className="form-label">Requirements <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Required qualifications..." rows="4" className="form-input" />
              </div>
              <div>
                <label className="form-label">Benefits <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} placeholder="Describe salary benefits, perks..." rows="4" className="form-input" />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Comp & Deadline */}
          <div className="px-6 sm:px-8 py-7">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
              Compensation & Deadline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="form-label">Min Salary (NPR)</label>
                <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} placeholder="40000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Max Salary (NPR)</label>
                <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} placeholder="70000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Deadline</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Skills */}
          <div className="px-6 sm:px-8 py-7 bg-gray-50/30">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">4</span>
              Skills Required
            </h3>
            <div>
              <label className="form-label">Select multiple skills</label>
              <select name="skills" multiple value={formData.skills} onChange={handleChange} className="form-input h-40">
                {allSkills.map(skill => (
                  <option key={skill.id} value={skill.id} className="p-2 mb-1 rounded-md cursor-pointer hover:bg-gray-100">{skill.name}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500 font-medium">Hold Ctrl (Windows) or Command (Mac) to select multiple.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 sm:px-8 py-5 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium"><span className="text-red-500 font-bold">*</span> indicates required field</p>
            <button type="submit" className="btn-primary">Post Job</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
