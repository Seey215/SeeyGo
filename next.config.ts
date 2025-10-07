import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: '.next',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;