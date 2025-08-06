import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    reactCompiler: true,
  },

  devIndicators: false,
}

export default nextConfig
