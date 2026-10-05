import { Router } from "express";
import { prisma, notifyFrontend } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

// List dynamics (public)
router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const [total, dynamics] = await Promise.all([
    prisma.dynamic.count(),
    prisma.dynamic.findMany({
      orderBy: [{ pinned: "desc" }, { published: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  res.json({ total, data: dynamics });
});

// Create dynamic (auth)
router.post("/", requireAuth, async (req, res) => {
  const { content, images, pinned } = req.body;
  if (!content) return res.status(400).json({ error: "内容不能为空" });
  const dynamic = await prisma.dynamic.create({
    data: { content, images: JSON.stringify(images || []), pinned: pinned || false, published: new Date() },
  });
  await notifyFrontend("dynamic-created");
  res.json(dynamic);
});

// Update dynamic
router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { content, images, pinned } = req.body;
  const dynamic = await prisma.dynamic.update({
    where: { id },
    data: { ...(content && { content }), ...(images && { images: JSON.stringify(images) }), ...(pinned !== undefined && { pinned }) },
  });
  await notifyFrontend("dynamic-updated");
  res.json(dynamic);
});

// Delete dynamic
router.delete("/:id", requireAuth, async (req, res) => {
  await prisma.dynamic.delete({ where: { id: Number(req.params.id) } });
  await notifyFrontend("dynamic-deleted");
  res.json({ message: "动态已删除" });
});

export default router;
