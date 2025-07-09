/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use modern build optimizations
  experimental: {
    // Reserved for future experimental features
  },
  // Ensure we're using the modern build system
  swcMinify: true,
}

export default nextConfig
