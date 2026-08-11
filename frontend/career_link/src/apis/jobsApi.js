// Mock data — matches the JobPosting model fields from the backend.
// Swap getJobs()/getJobById() to real fetch() calls once the API is live.

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Full Stack Developer (MERN)",
    employer: { company_name: "CloudTech Solutions Nepal" },
    location: "Jawalakhel, Lalitpur",
    salary_min: 120000,
    salary_max: 180000,
    job_type: "FT",
    experience_level: "SR",
    skills: [{ name: "React" }, { name: "Node.js" }, { name: "MongoDB" }],
    is_urgent: true,
    is_featured: false,
    description: "Lead end-to-end feature development across our MERN stack platform.",
    responsibilities: "Build and maintain APIs. Collaborate with design and product teams.",
    requirements: "3+ years experience with React and Node.js.",
    benefits: "Health insurance, flexible hours, remote-friendly.",
    created_at: "2026-08-04",
  },
  {
    id: 2,
    title: "Product Marketing Specialist",
    employer: { company_name: "Horizon Media Group" },
    location: "Baneshwor, Kathmandu",
    salary_min: 45000,
    salary_max: 70000,
    job_type: "FT",
    experience_level: "MD",
    skills: [{ name: "SEO" }, { name: "Content Strategy" }],
    is_urgent: false,
    is_featured: false,
    description: "Own product marketing campaigns from concept to launch.",
    responsibilities: "Plan campaigns. Analyze performance metrics.",
    requirements: "2+ years in marketing, strong writing skills.",
    benefits: "Performance bonus, learning budget.",
    created_at: "2026-08-03",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    employer: { company_name: "FinFlow Nepal" },
    location: "Remote (Based in Pokhara)",
    salary_min: 80000,
    salary_max: 110000,
    job_type: "RM",
    experience_level: "MD",
    skills: [{ name: "Figma" }, { name: "Prototyping" }],
    is_urgent: false,
    is_featured: true,
    description: "Design intuitive interfaces for our fintech mobile app.",
    responsibilities: "Create wireframes, prototypes, and design systems.",
    requirements: "Portfolio required. 2+ years product design experience.",
    benefits: "Fully remote, equipment provided.",
    created_at: "2026-08-01",
  },
];

export async function getJobs() {
  // TODO: replace with real API call once backend endpoint is ready
  // return fetch("/api/jobs/").then((res) => res.json());
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_JOBS), 300));
}

export async function getJobById(id) {
  // TODO: replace with real API call
  // return fetch(`/api/jobs/${id}/`).then((res) => res.json());
  const job = MOCK_JOBS.find((j) => String(j.id) === String(id));
  return new Promise((resolve) => setTimeout(() => resolve(job), 300));
}

export const JOB_TYPE_LABELS = {
  FT: "Full-time",
  PT: "Part-time",
  RM: "Remote",
  CT: "Contract",
};
