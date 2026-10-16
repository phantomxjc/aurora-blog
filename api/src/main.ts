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
import trafficRoutes from "./routes/traffic.js";
import { accessLogMiddleware } from "./middleware/accessLog.js";
import { uploadDir } from "./utils/upload.js";
import {
  refreshHeroBackground,
  isHeroBackgroundStale,
  getHeroBackgroundPath,
  getHeroBackgroundVersion,
} from "./utils/heroBackground.js";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Access log middleware — records every API request
app.use(accessLogMiddleware);

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
app.use("/api/traffic", trafficRoutes);

// Hero background image — served from local file, refreshed daily
app.get("/api/hero-bg", (_req, res) => {
  const filePath = getHeroBackgroundPath();
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Background not available" });
    return;
  }
  // Cache for 1 hour; browser revalidates after that
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Content-Type", "image/jpeg");
  res.sendFile(filePath);
});

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

app.listen(PORT, async () => {
  console.log(`🌌 Aurora API running on http://localhost:${PORT}`);

  // On startup: download hero background if stale or missing
  if (isHeroBackgroundStale()) {
    console.log("[hero-bg] Background missing or stale, downloading...");
    const ok = await refreshHeroBackground();
    if (!ok) console.warn("[hero-bg] All sources failed, will retry later");
  } else {
    console.log(`[hero-bg] Current background is fresh (v=${getHeroBackgroundVersion()})`);
  }

  // Every hour: check if background is stale (> 24h), refresh if so
  setInterval(async () => {
    if (isHeroBackgroundStale()) {
      console.log("[hero-bg] Daily refresh triggered");
      await refreshHeroBackground();
    }
  }, 60 * 60 * 1000); // 1 hour
});
