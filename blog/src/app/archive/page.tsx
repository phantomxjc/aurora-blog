import { getPosts } from "@/lib/api";
export const dynamic = "force-dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import { Archive } from "lucide-react";
import { MotionDiv } from "@/components/Motion";

export default async function ArchivePage() {
  let posts: any[] = [];
  try {
    const res = await getPosts({ limit: 100 });
    posts = res.data || [];
  } catch {}

  // Group by year
  const grouped: Record<string, any[]> = {};
  for (const post of posts) {
    const year = dayjs(post.published).format("YYYY");
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Archive className="w-6 h-6 text-aurora-500" />
          <h1 className="text-3xl font-bold font-serif text-gray-900">归档</h1>
          <span className="text-gray-400 text-lg">({posts.length} 篇)</span>
        </div>

        {years.length > 0 ? (
          years.map((year, yi) => (
            <MotionDiv
              key={year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: yi * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold gradient-text mb-6">{year}</h2>
              <div className="space-y-3 border-l-2 border-gray-100 pl-6">
                {grouped[year].map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group flex items-baseline gap-4 hover:translate-x-1 transition-transform"
                  >
                    <span className="text-sm text-gray-400 font-mono w-20 flex-shrink-0">
                      {dayjs(post.published).format("MM-DD")}
                    </span>
                    <span className="text-gray-700 group-hover:text-aurora-600 transition-colors font-medium">
                      {post.title}
                    </span>
                    {post.category && (
                      <span className="px-2 py-0.5 rounded text-xs bg-aurora-50 text-aurora-500">{post.category}</span>
                    )}
                  </Link>
                ))}
              </div>
            </MotionDiv>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">暂无文章</div>
        )}
      </div>
    </div>
  );
}
