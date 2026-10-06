module.exports = {
  apps: [
    {
      name: 'api',
      cwd: '/app/api',
      script: 'node_modules/.bin/tsx',
      args: 'src/main.ts',
      env: {
        PORT: 3002,
        JWT_SECRET: 'aurora-secret-key-2026',
      },
    },
    {
      name: 'blog',
      cwd: '/app/blog',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        PORT: 3000,
        INTERNAL_API_URL: 'http://localhost:3002',
      },
    },
    {
      name: 'admin',
      script: 'serve',
      args: '/app/admin/dist -l 5174',
    },
    {
      name: 'proxy',
      cwd: '/app/app',
      script: 'proxy.js',
      env: {
        PROXY_PORT: 9090,
        API_TARGET: 'http://localhost:3002',
        BLOG_TARGET: 'http://localhost:3000',
        ADMIN_TARGET: 'http://localhost:5174',
      },
    },
  ],
};
