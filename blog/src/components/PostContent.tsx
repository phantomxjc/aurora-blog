"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";

export default function PostContent({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="prose-aurora"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold font-serif text-gray-900 mt-8 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold font-serif text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-100">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold font-serif text-gray-900 mt-6 mb-3">{children}</h3>,
          p: ({ children }) => <p className="text-gray-700 leading-relaxed my-4">{children}</p>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-aurora-600 hover:text-aurora-700 underline decoration-aurora-300">{children}</a>,
          ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 my-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 my-4 space-y-1">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-aurora-300 bg-aurora-50/50 pl-4 py-2 my-4 rounded-r-lg text-gray-600 italic">{children}</blockquote>,
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) return <code className="px-2 py-0.5 rounded bg-aurora-50 text-aurora-700 text-sm font-mono">{children}</code>;
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono">{children}</pre>,
          img: ({ src, alt }) => <img src={src as string} alt={alt} className="rounded-xl my-4 w-full" />,
          table: ({ children }) => <table className="w-full my-4 border-collapse">{children}</table>,
          th: ({ children }) => <th className="border border-gray-200 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>,
          td: ({ children }) => <td className="border border-gray-200 px-4 py-2">{children}</td>,
          hr: () => <hr className="my-8 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
