import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import dynamicRoutes from "./routes/dynamics.js";
import projectRoutes from "./routes/projects.js";
import tagRoutes from "./routes/tags.js";
import imageRoutes from "./routes/images.js";
import settingsRoutes from "./routes/settings.js";
import { uploadDir } from "./utils/upload.js";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static: serve uploaded files
fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dynamics", dynamicRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/settings", settingsRoutes);

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

// Error handler
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[API Error]", err.message);
    res.status(err.status || 500).json({ error: err.message || "服务器内部错误" });
  }
);

app.listen(PORT, () => {
  console.log(`🌌 Aurora API running on http://localhost:${PORT}`);
});
