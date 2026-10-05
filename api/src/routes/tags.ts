import { Router } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";
import { slugify } from "../utils/helpers.js";

const router = Router();

// List all tags
router.get("/", async (_req, res) => {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  res.json({ data: tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug, postCount: t._count.posts, createdAt: t.createdAt })) });
});

// Create tag
router.post("/", requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "标签名不能为空" });
  let tag = await prisma.tag.findUnique({ where: { name } });
  if (tag) return res.status(409).json({ error: "标签已存在" });
  tag = await prisma.tag.create({ data: { name, slug: slugify(name) } });
  res.json(tag);
});

// Update tag
router.put("/:id", requireAuth, async (req, res) => {
  const { name } = req.body;
  const tag = await prisma.tag.update({ where: { id: Number(req.params.id) }, data: { name, slug: slugify(name) } });
  res.json(tag);
});

// Delete tag
router.delete("/:id", requireAuth, async (req, res) => {
  await prisma.tag.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "标签已删除" });
});

export default router;
