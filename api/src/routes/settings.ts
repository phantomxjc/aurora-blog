import { Router } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

// Get all settings (public)
router.get("/", async (_req, res) => {
  const settings = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  for (const s of settings) result[s.configKey] = s.value;
  res.json(result);
});

// Get single setting
router.get("/:key", async (req, res) => {
  const setting = await prisma.setting.findUnique({ where: { configKey: req.params.key } });
  res.json({ key: req.params.key, value: setting?.value || "" });
});

// Update setting (auth)
router.put("/:key", requireAuth, async (req, res) => {
  const { value } = req.body;
  const setting = await prisma.setting.upsert({
    where: { configKey: req.params.key },
    update: { value, updatedAt: new Date() },
    create: { configKey: req.params.key, value },
  });
  res.json(setting);
});

// Batch update settings
router.put("/", requireAuth, async (req, res) => {
  const entries = Object.entries(req.body);
  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { configKey: key },
      update: { value: String(value), updatedAt: new Date() },
      create: { configKey: key, value: String(value) },
    });
  }
  res.json({ message: "设置已保存" });
});

export default router;
