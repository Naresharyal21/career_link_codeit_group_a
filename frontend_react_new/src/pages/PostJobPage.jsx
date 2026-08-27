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
        setCategories(catRes.data);
        setAllSkills(skillRes.data);
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
    
    // Clean up empty fields
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
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
          <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Benefits</label>
          <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary Min</label>
              <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary Max</label>
              <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg">
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (Ctrl+Click to select multiple)</label>
          <select name="skills" multiple value={formData.skills} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg h-32">
            {allSkills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Post Job</button>
      </form>
    </div>
  );
};

export default PostJobPage;
