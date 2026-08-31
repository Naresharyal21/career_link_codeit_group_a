import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { getCategories, getSkills, createJobPosting } from "../../apis/employerJobsApi";

const JOB_TYPES = [
  { value: "FT", label: "Full-time" },
  { value: "PT", label: "Part-time" },
  { value: "RM", label: "Remote" },
  { value: "CT", label: "Contract" },
];

const EXPERIENCE_LEVELS = [
  { value: "EN", label: "Entry Level" },
  { value: "MD", label: "Mid Level" },
  { value: "SR", label: "Senior Level" },
];

const PostJobPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    Promise.all([getCategories(), getSkills()])
      .then(([cats, sks]) => {
        setCategories(cats);
        setSkills(sks);
      })
      .catch(() => setSubmitError("Couldn't load categories/skills."))
      .finally(() => setLoadingOptions(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      category: "",
      skills: [],
      job_type: "FT",
      experience_level: "EN",
      location: "",
      salary_min: "",
      salary_max: "",
      is_urgent: false,
      is_featured: false,
      is_active: true,
      deadline: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Job title is required"),
      description: Yup.string().required("Description is required"),
      location: Yup.string().required("Location is required"),
      job_type: Yup.string().required(),
      experience_level: Yup.string().required(),
      salary_min: Yup.number().nullable().min(0, "Must be positive"),
      salary_max: Yup.number()
        .nullable()
        .min(0, "Must be positive")
        .when("salary_min", (salary_min, schema) =>
          salary_min
            ? schema.min(salary_min, "Max must be greater than min")
            : schema
        ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError(null);
      try {
        const payload = {
          ...values,
          category: values.category || null,
          salary_min: values.salary_min || null,
          salary_max: values.salary_max || null,
          deadline: values.deadline || null,
        };
        await createJobPosting(payload);
        resetForm();
        navigate("/employer/jobs");
      } catch (err) {
        setSubmitError(err.message || "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const toggleSkill = (skillId) => {
    const current = formik.values.skills;
    if (current.includes(skillId)) {
      formik.setFieldValue(
        "skills",
        current.filter((id) => id !== skillId)
      );
    } else {
      formik.setFieldValue("skills", [...current, skillId]);
    }
  };

  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

      {submitError && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 mb-4 text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Senior Full Stack Developer"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-700 text-sm">{formik.errors.title}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Describe the role"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-700 text-sm">{formik.errors.description}</p>
          )}
        </div>

        {/* RESPONSIBILITIES / REQUIREMENTS / BENEFITS */}
        <div>
          <label className="block text-sm font-medium mb-1">Responsibilities</label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            rows="3"
            value={formik.values.responsibilities}
            onChange={formik.handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            rows="3"
            value={formik.values.requirements}
            onChange={formik.handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Benefits</label>
          <textarea
            id="benefits"
            name="benefits"
            rows="3"
            value={formik.values.benefits}
            onChange={formik.handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* CATEGORY + JOB TYPE + EXPERIENCE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              className="border rounded p-2 w-full"
              disabled={loadingOptions}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select
              id="job_type"
              name="job_type"
              value={formik.values.job_type}
              onChange={formik.handleChange}
              className="border rounded p-2 w-full"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <select
              id="experience_level"
              name="experience_level"
              value={formik.values.experience_level}
              onChange={formik.handleChange}
              className="border rounded p-2 w-full"
            >
              {EXPERIENCE_LEVELS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Kathmandu, Nepal"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-red-700 text-sm">{formik.errors.location}</p>
          )}
        </div>

        {/* SALARY */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Salary Min</label>
            <input
              id="salary_min"
              name="salary_min"
              type="number"
              placeholder="e.g. 45000"
              value={formik.values.salary_min}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2 w-full"
            />
            {formik.touched.salary_min && formik.errors.salary_min && (
              <p className="text-red-700 text-sm">{formik.errors.salary_min}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary Max</label>
            <input
              id="salary_max"
              name="salary_max"
              type="number"
              placeholder="e.g. 70000"
              value={formik.values.salary_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2 w-full"
            />
            {formik.touched.salary_max && formik.errors.salary_max && (
              <p className="text-red-700 text-sm">{formik.errors.salary_max}</p>
            )}
          </div>
        </div>

        {/* SKILLS */}
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleSkill(s.id)}
                className={
                  formik.values.skills.includes(s.id)
                    ? "px-3 py-1 rounded-full text-sm bg-[#0f2a52] text-white cursor-pointer"
                    : "px-3 py-1 rounded-full text-sm border border-gray-300 hover:bg-gray-100 cursor-pointer"
                }
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* DEADLINE */}
        <div>
          <label className="block text-sm font-medium mb-1">Application Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formik.values.deadline}
            onChange={formik.handleChange}
            className="border rounded p-2 w-full sm:w-64"
          />
        </div>

        {/* FLAGS */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_urgent"
              checked={formik.values.is_urgent}
              onChange={formik.handleChange}
            />
            Urgent hiring
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_featured"
              checked={formik.values.is_featured}
              onChange={formik.handleChange}
            />
            Featured listing
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              checked={formik.values.is_active}
              onChange={formik.handleChange}
            />
            Active (visible to candidates)
          </label>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-[#0f2a52] text-white px-6 py-2 rounded hover:bg-[#173a6e] transition-colors cursor-pointer disabled:opacity-50"
        >
          {formik.isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJobPage;
