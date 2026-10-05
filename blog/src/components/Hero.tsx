"use client";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, TrendingUp } from "lucide-react";

export default function Hero({ siteName, siteDescription, postCount }: { siteName: string; siteDescription: string; postCount: number }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-aurora-50 via-white to-purple-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-aurora-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
        >
          <Sparkles className="w-4 h-4 text-aurora-500" />
          <span className="text-sm text-gray-600">欢迎来到</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-serif mb-6"
        >
          <span className="gradient-text">{siteName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed"
        >
          {siteDescription || "用技术记录生活，用文字分享思考。一个设计精美的前后端分离博客系统。"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-5 h-5 text-aurora-500" />
            <span className="font-medium">{postCount}</span> 篇文章
          </div>
          <div className="w-px h-6 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span>持续更新中</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
