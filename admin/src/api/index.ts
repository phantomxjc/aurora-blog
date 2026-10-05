import axios from "axios";

// Use relative path so Vite proxy handles API requests in dev
const API_BASE = "";

const api = axios.create({ baseURL: `${API_BASE}/api`, timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.endsWith("/login")) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
