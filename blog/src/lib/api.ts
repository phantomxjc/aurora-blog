import axios from "axios";

// SSR uses internal URL, client uses relative path (through proxy)
const API_BASE =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || "http://localhost:3002"
    : "";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
});

export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  tags: { id: number; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
  views: number;
  pinned: boolean;
  draft: boolean;
  excerpt?: string;
  category?: string;
  published?: string;
  featured?: boolean;
  readingTime?: number;
}

export interface Dynamic {
  id: number;
  content: string;
  images: string;
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
  repoUrl: string;
  coverImage: string;
  tags: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Setting {
  key: string;
  value: string;
}

export interface Stats {
  totalPosts: number;
  totalDrafts: number;
  totalViews: number;
  totalTags: number;
  totalDynamics: number;
  totalProjects: number;
}

// Helper to get image URL
export const imageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = typeof window === "undefined" ? API_BASE : "";
  return `${base}${path}`;
};

// Settings cache
let settingsCache: Record<string, string> = {};
export async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await api.get("/settings");
    // API returns a flat object { key: value, ... }
    settingsCache = res.data || {};
    return settingsCache;
  } catch {
    return settingsCache;
  }
}

// Fetch posts with optional filtering
export async function getPosts(params?: { limit?: number; q?: string; tag?: string; category?: string }) {
  const res = await api.get("/posts", { params });
  return res.data;
}

// Fetch a single post by slug
export async function getPost(slug: string) {
  const res = await api.get(`/posts/${slug}`);
  return res.data;
}

// Fetch all tags
export async function getTags() {
  const res = await api.get("/tags");
  return res.data;
}

// Fetch all projects
export async function getProjects() {
  const res = await api.get("/projects");
  return res.data;
}

// Fetch dynamics (short posts/updates)
export async function getDynamics() {
  const res = await api.get("/dynamics");
  return res.data;
}
