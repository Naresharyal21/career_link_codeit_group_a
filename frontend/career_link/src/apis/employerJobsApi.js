const API_BASE = "http://127.0.0.1:8000/api/v1/jobs";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.results ?? data;
}

export async function getSkills() {
  const res = await fetch(`${API_BASE}/skills/`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  const data = await res.json();
  return data.results ?? data;
}

export async function getMyJobPostings() {
  const res = await fetch(`${API_BASE}/manage/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch your job postings");
  const data = await res.json();
  return data.results ?? data;
}

export async function createJobPosting(payload) {
  const res = await fetch(`${API_BASE}/manage/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to create job posting");
  }
  return res.json();
}
