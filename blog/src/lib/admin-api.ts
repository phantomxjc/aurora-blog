import axios from "axios";

// Admin API client with JWT auth
const API_BASE =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || "http://localhost:3002"
    : "";

export const adminApi = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
});

// Attach token interceptor (client-side only)
if (typeof window !== "undefined") {
  adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.endsWith("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
      return Promise.reject(error);
    }
  );
}

// Auth helpers
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export async function login(username: string, password: string) {
  const res = await adminApi.post("/auth/login", { username, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { token, user };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
