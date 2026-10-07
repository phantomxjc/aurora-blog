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
    siteSlogan: "用技术记录生活，用文字分享思考",
    siteAuthor: "软件推手/phantomxjc",
    siteAuthorUrl: "https://github.com/phantomxjc",
    siteUrl: "http://localhost:3000",
    navLinks: JSON.stringify([
      { label: "首页", url: "/" },
      { label: "归档", url: "/archive" },
      { label: "标签", url: "/tags" },
      { label: "项目", url: "/projects" },
      { label: "动态", url: "/dynamics" },
      { label: "关于", url: "/about" },
    ]),
    // Homepage display text
    heroBadgeText: "欢迎来到",
    heroPostCountLabel: "篇文章",
    heroUpdateLabel: "持续更新中",
    ctaTitle: "开始你的写作之旅",
    ctaSubtitle: "用 Markdown 记录想法，用技术分享知识。{siteName} 让写作变得简单而美好。",
    ctaButtonText: "了解更多",
    featuredSectionTitle: "精选文章",
    latestSectionTitle: "最新文章",
    viewAllText: "查看全部",
    emptyPostText: "暂无文章，去后台发布第一篇吧！",
    // About page text
    aboutTitle: "关于本站",
    aboutDescription: "Aurora Blog 是一个基于 Next.js 14 + Express + Vue 3 的前后端分离博客系统。采用现代化的技术栈和精美的 UI 设计，让写作和阅读都成为一种享受。",
    aboutFeaturesTitle: "技术特性",
    aboutTechStackTitle: "技术栈",
    aboutDeveloperTitle: "开发者",
    aboutDeveloperRole: "全栈开发者 · 博客维护者",
    aboutContactTitle: "联系我",
    aboutContactText: "如果你对这个项目有任何问题或建议，欢迎通过以下方式联系我：",
    socialLinks: JSON.stringify({
      github: "https://github.com/phantomxjc",
      twitter: "",
      email: "admin@aurora.blog",
    }),
    // Security settings
    captchaEnabled: "true",
    autoLogoutEnabled: "true",
    autoLogoutMinutes: "30",
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
