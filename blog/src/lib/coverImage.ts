/**
 * 随机封面图工具
 *
 * 参考 Firefly 博客的随机封面设计：
 * 当文章没有封面图时，自动生成一个随机封面。
 *
 * 使用 Lorem Picsum (https://picsum.photos) 服务：
 * - 通过 seed 参数保证同一篇文章每次获得相同的封面图
 * - 无需 API Key，稳定可靠
 *
 * 同时支持 Firefly 风格的随机图 API 列表作为备选：
 * - https://t.alcy.cc/pc
 * - https://www.dmoe.cc/random.php
 * - https://uapis.cn/api/v1/random/image?category=acg&type=pc
 */

// 随机封面图 API 列表（Firefly 风格，用于 <img> 标签直接加载）
export const RANDOM_IMAGE_APIS = [
  "https://t.alcy.cc/pc",
  "https://www.dmoe.cc/random.php",
  "https://uapis.cn/api/v1/random/image?category=acg&type=pc",
];

/**
 * 根据种子生成确定性的随机封面图 URL
 * 使用 Lorem Picsum 的 seed 功能，保证同一篇文章总是显示相同的封面
 *
 * @param seed - 种子字符串（通常是文章 slug 或 id）
 * @param width - 图片宽度，默认 800
 * @param height - 图片高度，默认 450
 * @returns 封面图 URL
 */
export function getRandomCoverUrl(seed: string, width = 800, height = 450): string {
  // 使用 seed 参数，Lorem Picsum 会返回基于种子的确定性图片
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/**
 * 获取文章的封面图 URL
 * 如果文章已有封面图，直接返回；否则生成随机封面
 *
 * @param coverImage - 文章已有的封面图 URL
 * @param seed - 种子字符串（文章 slug 或 id）
 * @returns 封面图 URL
 */
export function getPostCover(coverImage: string | undefined | null, seed: string): string {
  if (coverImage && coverImage.trim()) {
    return coverImage;
  }
  return getRandomCoverUrl(seed);
}

/**
 * 从 API 列表中随机选择一个随机图 API URL
 * 用于需要每次刷新都获得不同图片的场景
 *
 * @returns 随机图 API URL
 */
export function getRandomApiCover(): string {
  return RANDOM_IMAGE_APIS[Math.floor(Math.random() * RANDOM_IMAGE_APIS.length)];
}
