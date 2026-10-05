import { Router } from "express";
import { prisma, notifyFrontend } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";
import { slugify, excerpt, readingTime } from "../utils/helpers.js";
import { marked } from "marked";

const router = Router();
marked.setOptions({ gfm: true, breaks: false });

function formatPost(post: any) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    content: post.content,
    contentHtml: post.contentHtml,
    coverImage: post.coverImage,
    category: post.category,
    pinned: post.pinned,
    draft: post.draft,
    featured: post.featured,
    author: post.author,
    views: post.views,
    published: post.published,
    updated: post.updated,
    createdAt: post.createdAt,
    tags: post.tags?.map((pt: any) => pt.tag) || [],
    excerpt: excerpt(post.content),
    readingTime: readingTime(post.content),
  };
}

// Markdown preview
router.post("/preview", (req, res) => {
  const { content } = req.body;
  if (!content) return res.json({ html: "" });
  try {
    res.json({ html: marked.parse(content) as string });
  } catch {
    res.status(500).json({ error: "Markdown 渲染失败", html: "" });
  }
});

// List posts (public: excludes drafts)
router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const includeDrafts = req.query.draft === "true";
  const category = req.query.category as string | undefined;
  const tag = req.query.tag as string | undefined;
  const q = req.query.q as string | undefined;

  const where: any = {};
  if (!includeDrafts) where.draft = false;
  if (category) where.category = category;
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { content: { contains: q } },
    ];
  }

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      include: { tags: { include: { tag: true } } },
      orderBy: [{ pinned: "desc" }, { published: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({ total, page, limit, data: posts.map(formatPost) });
});

// Get single post by slug
router.get("/:slug", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    include: { tags: { include: { tag: true } } },
  });
  if (!post || (post.draft && !req.query.draft)) {
    return res.status(404).json({ error: "文章不存在" });
  }
  // Increment views
  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  res.json(formatPost(post));
});

// Create post (auth required)
router.post("/", requireAuth, async (req, res) => {
  const { title, content, description, coverImage, category, pinned, draft, featured, tags, slug: customSlug } = req.body;
  let slug = customSlug || slugify(title);
  // Ensure unique slug
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const contentHtml = marked.parse(content) as string;
  const post = await prisma.post.create({
    data: {
      slug,
      title,
      content,
      contentHtml,
      description: description || excerpt(content),
      coverImage: coverImage || "",
      category: category || null,
      pinned: pinned || false,
      draft: draft || false,
      featured: featured || false,
      published: new Date(),
      tags: tags?.length
        ? { create: await Promise.all(tags.map(async (tagName: string) => {
            let tag = await prisma.tag.findUnique({ where: { name: tagName } });
            if (!tag) tag = await prisma.tag.create({ data: { name: tagName, slug: slugify(tagName) } });
            return { tagId: tag.id };
          })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });
  await notifyFrontend("post-created", slug);
  res.json(formatPost(post));
});

// Update post
router.put("/:slug", requireAuth, async (req, res) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: "文章不存在" });

  const { title, content, description, coverImage, category, pinned, draft, featured, tags } = req.body;
  const contentHtml = content ? (marked.parse(content) as string) : undefined;

  // Update tags if provided
  if (tags !== undefined) {
    await prisma.postTag.deleteMany({ where: { postId: post.id } });
    for (const tagName of tags) {
      let tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (!tag) tag = await prisma.tag.create({ data: { name: tagName, slug: slugify(tagName) } });
      await prisma.postTag.create({ data: { postId: post.id, tagId: tag.id } });
    }
  }

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: {
      ...(title && { title }),
      ...(content && { content, contentHtml }),
      ...(description !== undefined && { description }),
      ...(coverImage !== undefined && { coverImage }),
      ...(category !== undefined && { category: category || null }),
      ...(pinned !== undefined && { pinned }),
      ...(draft !== undefined && { draft }),
      ...(featured !== undefined && { featured }),
      updated: new Date(),
    },
    include: { tags: { include: { tag: true } } },
  });
  await notifyFrontend("post-updated", post.slug);
  res.json(formatPost(updated));
});

// Delete post
router.delete("/:slug", requireAuth, async (req, res) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: "文章不存在" });
  await prisma.post.delete({ where: { id: post.id } });
  await notifyFrontend("post-deleted", post.slug);
  res.json({ message: "文章已删除" });
});

// Get stats for dashboard
router.get("/stats/summary", requireAuth, async (_req, res) => {
  const [totalPosts, totalDrafts, totalViews, totalTags, totalDynamics, totalProjects] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { draft: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.tag.count(),
    prisma.dynamic.count(),
    prisma.project.count(),
  ]);
  res.json({ totalPosts, totalDrafts, totalViews: totalViews._sum.views || 0, totalTags, totalDynamics, totalProjects });
});

export default router;
