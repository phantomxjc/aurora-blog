import { getSettings } from "@/lib/api";
export const dynamic = "force-dynamic";
import { MotionDiv } from "@/components/Motion";
import { Sparkles, Code, Palette, Rocket } from "lucide-react";

export default async function AboutPage() {
  let settings: any = {};
  try { settings = await getSettings(); } catch {}

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-block w-24 h-24 rounded-3xl bg-gradient-to-br from-aurora-400 via-purple-400 to-pink-400 flex items-center justify-center mb-6 shadow-xl shadow-aurora-300/30">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-serif gradient-text mb-4">{settings.siteName || "Aurora Blog"}</h1>
          <p className="text-lg text-gray-500 leading-relaxed">{settings.siteDescription || "一个设计精美的前后端分离博客系统"}</p>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose-aurora">
          <h2>关于本站</h2>
          <p>
            Aurora Blog 是一个基于 <strong>Next.js 14 + Express + Vue 3</strong> 的前后端分离博客系统。
            采用现代化的技术栈和精美的 UI 设计，让写作和阅读都成为一种享受。
          </p>

          <h2>技术特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
            {[
              { icon: Code, title: "前后端分离", desc: "API、前台、后台三端独立部署" },
              { icon: Palette, title: "极简美学", desc: "渐变、玻璃态、微动画设计" },
              { icon: Rocket, title: "高性能", desc: "SSR 渲染、SEO 友好" },
              { icon: Sparkles, title: "Markdown 写作", desc: "实时预览、图片拖拽上传" },
            ].map((feat) => (
              <div key={feat.title} className="p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all">
                <feat.icon className="w-8 h-8 text-aurora-500 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{feat.title}</h3>
                <p className="text-sm text-gray-500">{feat.desc}</p>
              </div>
            ))}
          </div>

          <h2>技术栈</h2>
          <ul>
            <li><strong>前台</strong>: Next.js 14, React 18, Tailwind CSS, Framer Motion</li>
            <li><strong>后端</strong>: Express, Prisma ORM, SQLite, JWT</li>
            <li><strong>后台</strong>: Vue 3, Tailwind CSS, Vite</li>
            <li><strong>部署</strong>: Docker Compose 一键部署</li>
          </ul>

          <h2>开发者</h2>
          <div className="not-prose my-4 p-5 rounded-2xl bg-gradient-to-br from-aurora-50 via-purple-50 to-pink-50 border border-aurora-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aurora-400 via-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                P
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-0.5">软件推送/phantomxjc</h3>
                <p className="text-sm text-gray-500">全栈开发者 · 博客维护者</p>
                <a
                  href="https://github.com/phantomxjc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-aurora-600 hover:text-aurora-700 font-medium transition-colors"
                >
                  GitHub: @phantomxjc →
                </a>
              </div>
            </div>
          </div>

          <h2>联系我</h2>
          <p>
            如果你对这个项目有任何问题或建议，欢迎通过以下方式联系我：
          </p>
          <div className="flex gap-4 not-prose my-4">
            <a href="https://github.com/phantomxjc" target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-xl bg-gray-900 text-white hover:shadow-lg transition-all">GitHub</a>
            <a href="mailto:admin@aurora.blog" className="px-5 py-3 rounded-xl bg-aurora-500 text-white hover:shadow-lg transition-all">Email</a>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
