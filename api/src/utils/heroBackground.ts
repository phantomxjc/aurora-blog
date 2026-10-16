import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { uploadDir } from "./upload.js";

const BG_FILE = path.join(uploadDir, "hero-bg.jpg");
const BG_TEMP = path.join(uploadDir, "hero-bg.tmp");

// 多个随机图片源，轮询 fallback
const IMAGE_SOURCES = [
  "https://picsum.photos/1920/1080",
  "https://source.unsplash.com/featured/1920x1080?nature,landscape",
  "https://loremflickr.com/1920/1080/landscape,nature",
];

function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      // Follow redirect (picsum returns 302)
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        const location = res.headers.location;
        if (location) {
          downloadImage(location, dest).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 10000) {
          reject(new Error("Image too small, probably error page"));
          return;
        }
        fs.writeFileSync(dest, buf);
        resolve();
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

/** Download a fresh random image, replacing the old one atomically */
export async function refreshHeroBackground(): Promise<boolean> {
  for (const src of IMAGE_SOURCES) {
    try {
      console.log(`[hero-bg] Downloading from ${src}...`);
      await downloadImage(src, BG_TEMP);
      // Atomic rename: temp → real
      fs.renameSync(BG_TEMP, BG_FILE);
      console.log(`[hero-bg] ✓ Saved (${(fs.statSync(BG_FILE).size / 1024).toFixed(0)} KB)`);
      return true;
    } catch (err: any) {
      console.warn(`[hero-bg] ✗ ${src} failed: ${err.message}`);
    }
  }
  // Clean up temp if all failed
  try { fs.unlinkSync(BG_TEMP); } catch {}
  return false;
}

/** Check if the current background is stale (> 24h old or missing) */
export function isHeroBackgroundStale(): boolean {
  if (!fs.existsSync(BG_FILE)) return true;
  const stat = fs.statSync(BG_FILE);
  const ageHours = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
  return ageHours >= 24;
}

/** Get the path to the hero background file */
export function getHeroBackgroundPath(): string {
  return BG_FILE;
}

/** Get the modification date string (for cache-busting) */
export function getHeroBackgroundVersion(): string {
  if (!fs.existsSync(BG_FILE)) return "none";
  return fs.statSync(BG_FILE).mtime.toISOString().slice(0, 10);
}
