"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, Pin } from "lucide-react";
import dayjs from "dayjs";
import type { Post } from "@/lib/api";
import { getPostCover } from "@/lib/coverImage";

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const cover = getPostCover(post.coverImage, post.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="card-hover relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
          {/* Cover Image (auto random cover if none) */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={cover}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {!post.coverImage && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/70 text-[10px]">
                随机封面
              </div>
            )}
          </div>

          {/* Pinned badge */}
          {post.pinned && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-aurora-500 text-white text-xs font-medium shadow-lg">
              <Pin className="w-3 h-3" /> 置顶
            </div>
          )}

          <div className="p-6">
            {/* Category & Tags */}
            <div className="flex items-center gap-2 mb-3">
              {post.category && (
                <span className="px-2.5 py-1 rounded-md bg-aurora-50 text-aurora-600 text-xs font-medium">
                  {post.category}
                </span>
              )}
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag.id} className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 text-xs">
                  #{tag.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold font-serif text-gray-900 mb-2 group-hover:text-aurora-600 transition-colors line-clamp-2">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {post.description || post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dayjs(post.published).format("YYYY-MM-DD")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} 分钟
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.views}
              </span>
            </div>
          </div>

          {/* Hover gradient border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-aurora-200 transition-all duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.article>
  );
}
