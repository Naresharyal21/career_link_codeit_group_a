import apiClient from "./apiClient";

const JOBS_ENDPOINT = "/jobs/";

const unwrapList = (data) => (
  Array.isArray(data) ? data : data?.results || []
);

export async function getJobs() {
  const data = await apiClient.get(JOBS_ENDPOINT);
  return unwrapList(data);
}

export async function getJobById(id) {
  try {
    return await apiClient.get(`/jobs/${id}/`);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
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
