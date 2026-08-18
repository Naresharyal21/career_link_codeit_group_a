export const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/jobs`;

export async function getJobsPage(url = `${API_BASE}/`) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

async function getAllJobs(maxPages = 5) {
  let all = [];
  let url = `${API_BASE}/`;
  let pages = 0;
  while (url && pages < maxPages) {
    const data = await getJobsPage(url);
    all = all.concat(data.results);
    url = data.next;
    pages++;
  }
  return all;
}

export async function getJobs() {
  const data = await getJobsPage();
  return data.results;
}

export async function getJobById(id) {
  const res = await fetch(`${API_BASE}/${id}/`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch job");
  }
  return res.json();
}

export async function getSimilarJobs(currentJob, limit = 2) {
  const all = await getAllJobs();
  const others = all.filter((j) => String(j.id) !== String(currentJob.id));

  const currentSkillNames = new Set((currentJob.skills || []).map((s) => s.name));

  const scored = others.map((job) => {
    let score = 0;
    if (job.category_name && job.category_name === currentJob.category_name) {
      score += 2;
    }
    const sharedSkills = (job.skills || []).filter((s) => currentSkillNames.has(s.name)).length;
    score += sharedSkills;
    return { job, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topMatches = scored.filter((s) => s.score > 0).map((s) => s.job);

  if (topMatches.length >= limit) {
    return topMatches.slice(0, limit);
  }

  const usedIds = new Set(topMatches.map((j) => j.id));
  const fallback = others.filter((j) => !usedIds.has(j.id));
  return [...topMatches, ...fallback].slice(0, limit);
}

export const JOB_TYPE_LABELS = {
  FT: "Full-time",
  PT: "Part-time",
  RM: "Remote",
  CT: "Contract",
};
