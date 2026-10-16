import { Router } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

/**
 * GET /api/traffic/overview — 总览统计
 * Returns: todayPV, todayUV, weekPV, weekUV, monthPV, monthUV, totalPV, totalUV
 */
router.get("/overview", requireAuth, async (_req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);

  const [todayPV, weekPV, monthPV, totalPV, todayUV, weekUV, monthUV, totalUV] = await Promise.all([
    prisma.accessLog.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.accessLog.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.accessLog.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.accessLog.count(),
    prisma.accessLog.groupBy({
      by: ["visitorId"],
      where: { createdAt: { gte: todayStart } },
      _count: { visitorId: true },
    }),
    prisma.accessLog.groupBy({
      by: ["visitorId"],
      where: { createdAt: { gte: weekStart } },
      _count: { visitorId: true },
    }),
    prisma.accessLog.groupBy({
      by: ["visitorId"],
      where: { createdAt: { gte: monthStart } },
      _count: { visitorId: true },
    }),
    prisma.accessLog.groupBy({
      by: ["visitorId"],
      _count: { visitorId: true },
    }),
  ]);

  res.json({
    todayPV,
    todayUV: todayUV.length,
    weekPV,
    weekUV: weekUV.length,
    monthPV,
    monthUV: monthUV.length,
    totalPV,
    totalUV: totalUV.length,
  });
});

/**
 * GET /api/traffic/trend?days=7 — 流量趋势
 * Returns array of { date, pv, uv } for last N days
 */
router.get("/trend", requireAuth, async (req, res) => {
  const days = Math.min(Number(req.query.days) || 7, 90);
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  startDate.setDate(startDate.getDate() - days + 1);

  const logs = await prisma.accessLog.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, visitorId: true },
  });

  // Group by date
  const trend: { date: string; pv: number; uv: Set<string> }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    trend.push({ date: d.toISOString().slice(0, 10), pv: 0, uv: new Set() });
  }

  for (const log of logs) {
    const dateStr = log.createdAt.toISOString().slice(0, 10);
    const entry = trend.find((t) => t.date === dateStr);
    if (entry) {
      entry.pv++;
      entry.uv.add(log.visitorId);
    }
  }

  res.json(trend.map((t) => ({ date: t.date, pv: t.pv, uv: t.uv.size })));
});

/**
 * GET /api/traffic/top-pages?limit=10 — 热门页面
 */
router.get("/top-pages", requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const logs = await prisma.accessLog.findMany({
    where: { path: { startsWith: "/api/posts/" }, status: 200 },
    select: { path: true, visitorId: true },
    take: 10000,
    orderBy: { createdAt: "desc" },
  });

  // Group by path
  const pageMap = new Map<string, { count: number; visitors: Set<string> }>();
  for (const log of logs) {
    const existing = pageMap.get(log.path) || { count: 0, visitors: new Set<string>() };
    existing.count++;
    existing.visitors.add(log.visitorId);
    pageMap.set(log.path, existing);
  }

  const result = Array.from(pageMap.entries())
    .map(([path, data]) => ({ path, count: data.count, uniqueVisitors: data.visitors.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  res.json(result);
});

/**
 * GET /api/traffic/recent?limit=20&page=1 — 最近访问记录
 */
router.get("/recent", requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const page = Number(req.query.page) || 1;

  const [total, logs] = await Promise.all([
    prisma.accessLog.count(),
    prisma.accessLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({ total, page, limit, data: logs });
});

/**
 * GET /api/traffic/hourly — 今日小时分布
 * Returns array of { hour, pv, uv } for today's 24 hours
 */
router.get("/hourly", requireAuth, async (_req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const logs = await prisma.accessLog.findMany({
    where: { createdAt: { gte: todayStart } },
    select: { createdAt: true, visitorId: true },
  });

  const hourly: { hour: number; pv: number; uv: Set<string> }[] = [];
  for (let h = 0; h < 24; h++) {
    hourly.push({ hour: h, pv: 0, uv: new Set() });
  }

  for (const log of logs) {
    const hour = log.createdAt.getHours();
    hourly[hour].pv++;
    hourly[hour].uv.add(log.visitorId);
  }

  res.json(hourly.map((h) => ({ hour: h.hour, pv: h.pv, uv: h.uv.size })));
});

/**
 * GET /api/traffic/visitors?limit=20 — 独立访客列表
 */
router.get("/visitors", requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  // Get recent distinct visitors with their last visit info
  const recentLogs = await prisma.accessLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: { ip: true, visitorId: true, userAgent: true, createdAt: true, path: true },
  });

  // Deduplicate by visitorId, keep first (most recent)
  const visitorMap = new Map<string, { ip: string; visitorId: string; userAgent: string; lastVisit: Date; visits: number; lastPath: string }>();
  for (const log of recentLogs) {
    const existing = visitorMap.get(log.visitorId);
    if (existing) {
      existing.visits++;
    } else {
      visitorMap.set(log.visitorId, {
        ip: log.ip,
        visitorId: log.visitorId,
        userAgent: log.userAgent,
        lastVisit: log.createdAt,
        visits: 1,
        lastPath: log.path,
      });
    }
  }

  const result = Array.from(visitorMap.values())
    .sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime())
    .slice(0, limit);

  res.json(result);
});

export default router;
