export function slugify(text: string): string {
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  // If slug is empty (e.g. non-ASCII title like Chinese), use a timestamp fallback
  if (!slug) {
    return `post-${Date.now().toString(36)}`;
  }
  return slug;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function excerpt(content: string, length = 160): string {
  const plain = content
    .replace(/[#*`>\-\[\]\(\)!]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > length ? plain.slice(0, length) + "…" : plain;
}
