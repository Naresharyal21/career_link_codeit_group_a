const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// UNCHANGED: left as you had it
function forceLogout() {
  // localStorage.removeItem("accessToken");
  // window.location.href = "/login";
}

// Tells every useUnreadCount (page and navbar) to refetch
export function notifyChanged() {
  window.dispatchEvent(new Event("notifications:changed"));
}

// One place for the token, base URL, 401 check and error check
export async function request(path, { method = "GET", signal } = {}) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(path.startsWith("http") ? path : `${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (res.status === 401) forceLogout();
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.status === 204 ? null : res.json();
}