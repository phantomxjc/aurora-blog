import { Router } from "express";
import { prisma, notifyFrontend } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";
import { slugify } from "../utils/helpers.js";

const router = Router();

// List projects (public)
router.get("/", async (req, res) => {
  const includeDrafts = req.query.draft === "true";
  const where: any = {};
  if (!includeDrafts) where.draft = false;
  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ featured: "desc" }, { published: "desc" }],
  });
  res.json({ data: projects.map((p) => ({ ...p, techStack: JSON.parse(p.techStack || "[]") })) });
});

// Get single project
router.get("/:slug", async (req, res) => {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
  if (!project || project.draft) return res.status(404).json({ error: "项目不存在" });
  res.json({ ...project, techStack: JSON.parse(project.techStack || "[]") });
});

// Create project
router.post("/", requireAuth, async (req, res) => {
  const { title, description, content, coverImage, techStack, demoUrl, repoUrl, status, featured, draft, slug: customSlug } = req.body;
  let slug = customSlug || slugify(title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const project = await prisma.project.create({
    data: {
      slug,
      title,
      description: description || "",
      content: content || "",
      coverImage: coverImage || "",
      techStack: JSON.stringify(techStack || []),
      demoUrl: demoUrl || "",
      repoUrl: repoUrl || "",
      status: status || "active",
      featured: featured || false,
      draft: draft || false,
      published: new Date(),
    },
  });
  await notifyFrontend("project-created", slug);
  res.json(project);
});

// Update project
router.put("/:slug", requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
  if (!project) return res.status(404).json({ error: "项目不存在" });
  const { title, description, content, coverImage, techStack, demoUrl, repoUrl, status, featured, draft } = req.body;
  const updated = await prisma.project.update({
    where: { id: project.id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(techStack && { techStack: JSON.stringify(techStack) }),
      ...(demoUrl !== undefined && { demoUrl }),
      ...(repoUrl !== undefined && { repoUrl }),
      ...(status !== undefined && { status }),
      ...(featured !== undefined && { featured }),
      ...(draft !== undefined && { draft }),
    },
  });
  await notifyFrontend("project-updated", project.slug);
  res.json(updated);
});

// Delete project
router.delete("/:slug", requireAuth, async (req, res) => {
  await prisma.project.delete({ where: { slug: req.params.slug } });
  await notifyFrontend("project-deleted", req.params.slug);
  res.json({ message: "项目已删除" });
});

export default router;
