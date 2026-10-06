import { getPosts, getSettings } from "@/lib/api";
export const dynamic = "force-dynamic";
import PostCard from "@/components/PostCard";
import Hero from "@/components/Hero";
import { MotionDiv } from "@/components/Motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

export default async function HomePage() {
  let posts: any[] = [];
  let settings: any = {};
  try {
    const [postsRes, settingsRes] = await Promise.all([getPosts({ limit: 9 }), getSettings().catch(() => ({}))]);
    posts = postsRes.data || [];
    settings = settingsRes;
  } catch {
    // API not available
  }

  const featuredPosts = posts.filter((p) => p.pinned || p.featured).slice(0, 3);
  const latestPosts = posts.filter((p) => !p.pinned).slice(0, 6);

  return (
    <div className="pt-16">
      <Hero siteName={settings.siteName || "Aurora Blog"} siteDescription={settings.siteDescription || ""} postCount={posts.length} />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-aurora-500" />
            <h2 className="text-2xl font-bold font-serif text-gray-900">精选文章</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900">最新文章</h2>
          <Link href="/archive" className="flex items-center gap-1 text-sm text-aurora-600 hover:text-aurora-700 transition-colors">
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌌</div>
            <p className="text-gray-400 text-lg">暂无文章，去后台发布第一篇吧！</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aurora-500 via-purple-500 to-pink-500 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22none%22 stroke=%22white%22 stroke-opacity=%220.1%22/></svg>')] opacity-30" />
          <h2 className="text-3xl font-bold font-serif text-white mb-4 relative">开始你的写作之旅</h2>
          <p className="text-white/80 mb-6 relative max-w-xl mx-auto">
            用 Markdown 记录想法，用技术分享知识。Aurora Blog 让写作变得简单而美好。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-aurora-600 font-medium hover:shadow-xl transition-all relative"
          >
            了解更多 <ArrowRight className="w-4 h-4" />
          </Link>
        </MotionDiv>
      </section>
    </div>
  );
}
