import { prisma } from "../src/utils/db.js";

async function fix() {
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    if (!post.slug || post.slug.trim() === "") {
      const newSlug = `post-${post.id}-${Date.now().toString(36)}`;
      await prisma.post.update({ where: { id: post.id }, data: { slug: newSlug } });
      console.log(`Fixed post id=${post.id} title="${post.title}" slug="${newSlug}"`);
    } else {
      console.log(`OK post id=${post.id} slug="${post.slug}"`);
    }
  }
  await prisma.$disconnect();
}

fix();
