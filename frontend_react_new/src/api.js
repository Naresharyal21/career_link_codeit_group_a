import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000/api/v1"
    : "/api/v1");

const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;

export const apiUrl = (path) => new URL(path, `${API_ORIGIN}/`).toString();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
