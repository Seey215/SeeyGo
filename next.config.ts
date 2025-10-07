import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支持动态路由
  distDir: '.next',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;