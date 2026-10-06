import { Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-3">Aurora Blog</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              一个设计精美的前后端分离博客系统，用技术记录生活，用文字分享思考。
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">导航</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-aurora-600 transition-colors">首页</a></li>
              <li><a href="/archive" className="hover:text-aurora-600 transition-colors">归档</a></li>
              <li><a href="/tags" className="hover:text-aurora-600 transition-colors">标签</a></li>
              <li><a href="/about" className="hover:text-aurora-600 transition-colors">关于</a></li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">关注</h4>
            <div className="flex gap-3 mb-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-aurora-100 flex items-center justify-center text-gray-600 hover:text-aurora-600 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:admin@aurora.blog"
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-aurora-100 flex items-center justify-center text-gray-600 hover:text-aurora-600 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            {/* 开发者信息 */}
            <div className="text-sm text-gray-500">
              <span className="text-gray-400">开发者：</span>
              <a
                href="https://github.com/phantomxjc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aurora-600 hover:text-aurora-700 font-medium transition-colors"
              >
                软件推送/phantomxjc
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Aurora Blog · Powered by Next.js + Express + Vue 3
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> by{" "}
            <a
              href="https://github.com/phantomxjc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aurora-600 hover:text-aurora-700 font-medium transition-colors"
            >
              软件推送/phantomxjc
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
