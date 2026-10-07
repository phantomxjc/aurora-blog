"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";

const VALID_THEMES = [
  "aurora-default", "aurora-ocean", "aurora-mist", "aurora-twilight",
  "aurora-emerald", "aurora-sunset", "aurora-minimal", "aurora-night",
  "aurora-rose", "aurora-tech",
];

export default function PostContent({ content, theme = "aurora-default" }: { content: string; theme?: string }) {
  const themeClass = VALID_THEMES.includes(theme) ? `theme-${theme}` : "theme-aurora-default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={themeClass}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
