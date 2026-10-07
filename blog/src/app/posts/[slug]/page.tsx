import { getPost, getPosts, getSettings } from "@/lib/api";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { Calendar, Clock, Eye, ArrowLeft, Tag as TagIcon } from "lucide-react";
import PostContent from "@/components/PostContent";
import { getPostCover } from "@/lib/coverImage";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug);
    const s = await getSettings().catch(() => ({})); return { title: `${post.title} - ${s.siteName || "Aurora Blog"}`, description: post.description };
  } catch {
    const s = await getSettings().catch(() => ({})); return { title: s.siteName || "Aurora Blog" };
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let post: any;
  let relatedPosts: any[] = [];
  try {
    post = await getPost(params.slug);
    const all = await getPosts({ limit: 20 });
    relatedPosts = (all.data || []).filter((p: any) => p.slug !== params.slug && p.category === post.category).slice(0, 3);
  } catch {
    notFound();
  }

  // 自动封面：无封面时使用随机封面图
  const cover = getPostCover(post.coverImage, post.slug);
  const hasCover = !!post.coverImage;

  return (
    <div className="pt-16">
      {/* Hero header */}
      <header className="relative overflow-hidden">
        <div className="relative h-[50vh] min-h-[400px]">
          <img src={cover} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          {!hasCover && (
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/60 text-xs">
              随机封面
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-3xl w-full text-center">
            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-center gap-5 text-sm text-white/80">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{dayjs(post.published).format("YYYY-MM-DD")}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readingTime} 分钟阅读</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{post.views} 次浏览</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-aurora-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        <PostContent content={post.content} />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="w-4 h-4 text-gray-400" />
              {post.tags.map((tag: any) => (
                <Link key={tag.id} href={`/tags?tag=${tag.slug}`} className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-aurora-50 text-gray-600 hover:text-aurora-600 text-sm transition-all">
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-8 text-center">相关文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <Link key={p.id} href={`/posts/${p.slug}`} className="card-hover rounded-xl bg-white border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
