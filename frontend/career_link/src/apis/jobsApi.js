const API_BASE = "http://127.0.0.1:8000/api/v1/jobs";

export async function getJobs() {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function getJobById(id) {
  const res = await fetch(`${API_BASE}/${id}/`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch job");
  }
  return res.json();
}

export async function getSimilarJobs(currentId, limit = 2) {
  const all = await getJobs();
  const others = all.filter((j) => String(j.id) !== String(currentId));
  return others.slice(0, limit);
}

export const JOB_TYPE_LABELS = {
  FT: "Full-time",
  PT: "Part-time",
  RM: "Remote",
  CT: "Contract",
};
