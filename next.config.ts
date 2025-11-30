import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // GitHub Pages 部署时需要配置 basePath 和 assetPrefix
  basePath: isProd ? '/SeeyGo' : '',
  assetPrefix: isProd ? '/SeeyGo/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
