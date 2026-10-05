const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({});
const PORT = process.env.PROXY_PORT || 8080;

const API_TARGET = process.env.API_TARGET || "http://localhost:3002";
const BLOG_TARGET = process.env.BLOG_TARGET || "http://localhost:3000";
const ADMIN_TARGET = process.env.ADMIN_TARGET || "http://localhost:5174";

const server = http.createServer((req, res) => {
  const url = req.url || "";

  // API requests
  if (url.startsWith("/api/") || url.startsWith("/uploads/")) {
    proxy.web(req, res, { target: API_TARGET, changeOrigin: true });
    return;
  }

  // Admin requests
  if (url.startsWith("/admin")) {
    proxy.web(req, res, { target: ADMIN_TARGET, changeOrigin: true });
    return;
  }

  // Everything else → Blog
  proxy.web(req, res, { target: BLOG_TARGET, changeOrigin: true });
});

proxy.on("error", (err, _req, res) => {
  console.error("Proxy error:", err.message);
  if (res.writeHead) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Proxy error: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Aurora Blog proxy on port ${PORT}`);
  console.log("   /        → Blog");
  console.log("   /admin   → Admin");
  console.log("   /api     → API");
});
