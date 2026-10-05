/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost" }, { protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/api/:path*` },
    ];
  },
};
module.exports = nextConfig;
