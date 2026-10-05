import { getPost, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { Calendar, Clock, Eye, ArrowLeft, Tag as TagIcon } from "lucide-react";
import PostContent from "@/components/PostContent";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug);
    return { title: `${post.title} - Aurora Blog`, description: post.description };
  } catch {
    return { title: "Aurora Blog" };
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

  return (
    <div className="pt-16">
      {/* Hero header */}
      <header className="relative overflow-hidden">
        {post.coverImage ? (
          <div className="relative h-[50vh] min-h-[400px]">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ) : (
          <div className="relative h-[40vh] min-h-[300px] bg-gradient-to-br from-aurora-100 via-purple-100 to-pink-100">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><circle cx=%2230%22 cy=%2230%22 r=%2225%22 fill=%22none%22 stroke=%22%23333%22 stroke-opacity=%220.05%22/></svg>')]" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-3xl w-full text-center">
            {post.coverImage && (
              <>
                {post.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm mb-4">
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6 leading-tight">{post.title}</h1>
              </>
            )}
            {!post.coverImage && (
              <>
                {post.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-white/60 backdrop-blur-md text-aurora-700 text-sm mb-4">
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6 leading-tight">{post.title}</h1>
              </>
            )}
            <div className={`flex items-center justify-center gap-5 text-sm ${post.coverImage ? "text-white/80" : "text-gray-500"}`}>
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

        {!post.coverImage && <p className="text-lg text-gray-500 mb-8 leading-relaxed">{post.description}</p>}

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
