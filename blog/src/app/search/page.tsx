"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts, type Post } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getPosts({ q: query, limit: 20 });
        setResults(res.data || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
      setSearched(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8 flex items-center gap-3">
          <SearchIcon className="w-7 h-7 text-aurora-500" /> 搜索
        </h1>

        {/* Search input */}
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题、内容、标签..."
            autoFocus
            className="w-full px-5 py-4 pl-14 rounded-2xl bg-white border border-gray-200 focus:border-aurora-400 focus:ring-4 focus:ring-aurora-100 outline-none text-lg transition-all"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        {loading && <div className="text-center py-10 text-gray-400">搜索中...</div>}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">未找到相关文章</p>
          </div>
        )}

        <AnimatePresence>
          {results.length > 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">找到 {results.length} 篇相关文章</p>
              {results.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/posts/${post.slug}`} className="block p-5 rounded-2xl bg-white border border-gray-100 hover:border-aurora-200 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-aurora-600 transition-colors mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{post.description || post.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          {post.category && <span className="px-2 py-0.5 rounded bg-aurora-50 text-aurora-500">{post.category}</span>}
                          <span>{dayjs(post.published).format("YYYY-MM-DD")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
