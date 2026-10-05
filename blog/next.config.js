/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "api" },
      { protocol: "https", hostname: "**" },
    ],
  },
};
module.exports = nextConfig;
