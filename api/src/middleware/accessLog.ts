import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db.js";
import crypto from "crypto";

/**
 * Extract real client IP from request, supporting proxies.
 */
function getClientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    return String(xff).split(",")[0].trim();
  }
  const xRealIp = req.headers["x-real-ip"];
  if (xRealIp) return String(xRealIp);

  // Fallback to socket address
  return req.socket.remoteAddress || "unknown";
}

/**
 * Generate a visitor ID from IP + date (daily unique).
 * Same IP on the same day = same visitorId.
 */
function getVisitorId(ip: string): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return crypto.createHash("sha256").update(`${ip}:${today}`).digest("hex").slice(0, 32);
}

/**
 * Try to extract a post slug from the URL path.
 * Matches /api/posts/:slug but excludes /api/posts/stats/summary etc.
 */
function extractPostSlug(path: string): string | null {
  const match = path.match(/^\/api\/posts\/([^\/]+)$/);
  if (!match) return null;
  const slug = match[1];
  // Exclude special routes
  if (slug === "stats" || slug.startsWith("stats/")) return null;
  return slug;
}

// Paths to skip logging (too frequent or not useful)
const SKIP_PATHS = ["/api/auth/captcha", "/api/health"];

/**
 * Access log middleware — records every API request to the database.
 * Uses fire-and-forget pattern: does not block the response.
 */
export async function accessLogMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Skip logging for certain paths
  if (SKIP_PATHS.some((p) => req.path.startsWith(p))) {
    return next();
  }

  // Only log API requests
  if (!req.path.startsWith("/api/")) {
    return next();
  }

  // Listen for response finish event
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const ip = getClientIp(req);
    const visitorId = getVisitorId(ip);
    const userAgent = req.headers["user-agent"] || "";
    const referer = req.headers["referer"] || "";
    const path = req.path;
    const method = req.method;
    const status = res.statusCode;

    // Extract post slug if applicable
    const postSlug = extractPostSlug(path);

    // Fire-and-forget: write to DB without blocking
    (async () => {
      try {
        let postId: number | null = null;
        if (postSlug) {
          const post = await prisma.post.findUnique({
            where: { slug: postSlug },
            select: { id: true },
          });
          postId = post?.id || null;
        }

        await prisma.accessLog.create({
          data: {
            ip,
            method,
            path,
            status,
            userAgent: String(userAgent).slice(0, 500),
            referer: String(referer).slice(0, 500),
            visitorId,
            postId,
            duration,
          },
        });
      } catch {
        // Silent fail — logging should never break the request
      }
    })();
  });

  next();
}
