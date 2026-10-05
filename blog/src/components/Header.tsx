"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "首页", href: "/" },
  { label: "归档", href: "/archive" },
  { label: "标签", href: "/tags" },
  { label: "项目", href: "/projects" },
  { label: "动态", href: "/dynamics" },
  { label: "关于", href: "/about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg shadow-aurora-100/20" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-aurora-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-aurora-300/40"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-lg font-bold gradient-text">Aurora</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-aurora-600 rounded-lg hover:bg-aurora-50 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="ml-2 p-2 text-gray-500 hover:text-aurora-600 rounded-lg hover:bg-aurora-50 transition-all">
            <Search className="w-4 h-4" />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <nav className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-aurora-600 rounded-lg hover:bg-aurora-50 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
