import { getTags } from "@/lib/api";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Tag } from "lucide-react";
import { MotionDiv } from "@/components/Motion";

export default async function TagsPage() {
  let tags: any[] = [];
  try {
    const res = await getTags();
    tags = res.data || [];
  } catch {}

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Tag className="w-6 h-6 text-aurora-500" />
          <h1 className="text-3xl font-bold font-serif text-gray-900">标签</h1>
          <span className="text-gray-400 text-lg">({tags.length} 个)</span>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {tags.map((tag, i) => (
              <MotionDiv
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/tags?tag=${tag.slug}`}
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-100 hover:border-aurora-300 hover:shadow-lg transition-all"
                >
                  <span className="text-aurora-400">#</span>
                  <span className="font-medium text-gray-700 group-hover:text-aurora-600 transition-colors">{tag.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{tag.postCount}</span>
                </Link>
              </MotionDiv>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">暂无标签</div>
        )}
      </div>
    </div>
  );
}
