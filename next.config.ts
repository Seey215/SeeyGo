import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/seeygo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/seeygo/' : '',
};

export default nextConfig;