import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">页面未找到</h1>
        <p className="text-gray-500 mb-8">你访问的页面可能已被移动或删除</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-aurora-500 text-white hover:bg-aurora-600 transition-all">
          <Home className="w-4 h-4" /> 返回首页
        </Link>
      </div>
    </div>
  );
}
