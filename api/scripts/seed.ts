import { prisma } from "../src/utils/db.js";
import { hashPassword } from "../src/utils/auth.js";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: hashPassword("admin123"),
      email: "admin@aurora.blog",
      role: "admin",
    },
  });

  // Create tags
  const tags = ["前端", "后端", "设计", "随笔", "教程"];
  for (const name of tags) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    await prisma.tag.upsert({ where: { name }, update: {}, create: { name, slug } });
  }

  // Create sample post
  const existingPost = await prisma.post.findUnique({ where: { slug: "welcome-to-aurora" } });
  if (!existingPost) {
    await prisma.post.create({
      data: {
        slug: "welcome-to-aurora",
        title: "欢迎来到 Aurora Blog",
        description: "一个设计精美的前后端分离博客系统",
        content: `# 欢迎来到 Aurora Blog\n\n这是一个基于 **Next.js + Express + Vue 3** 的前后端分离博客系统。\n\n## ✨ 特性\n\n- 🎨 极简美学设计\n- 📝 Markdown 写作\n- 🔍 全文搜索\n- 🏷 标签与分类\n\n## 🚀 开始\n\n开始你的写作之旅吧！`,
        contentHtml: "<h1>欢迎来到 Aurora Blog</h1><p>这是一个基于 <strong>Next.js + Express + Vue 3</strong> 的前后端分离博客系统。</p>",
        category: "随笔",
        pinned: true,
        draft: false,
        published: new Date(),
        tags: { create: [{ tagId: (await prisma.tag.findUnique({ where: { name: "随笔" } }))!.id }] },
      },
    });
  }

  // Create settings
  const defaultSettings = {
    siteName: "Aurora Blog",
    siteDescription: "一个设计精美的前后端分离博客系统",
    siteAuthor: "Aurora",
    siteUrl: "http://localhost:3000",
    navLinks: JSON.stringify([
      { label: "首页", url: "/" },
      { label: "归档", url: "/archive" },
      { label: "标签", url: "/tags" },
      { label: "项目", url: "/projects" },
      { label: "关于", url: "/about" },
    ]),
    socialLinks: JSON.stringify({
      github: "https://github.com",
      twitter: "",
      email: "admin@aurora.blog",
    }),
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.setting.upsert({
      where: { configKey: key },
      update: {},
      create: { configKey: key, value },
    });
  }

  console.log("✅ Seed complete!");
  await prisma.$disconnect();
}

seed().catch(console.error);
