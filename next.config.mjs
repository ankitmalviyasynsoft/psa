/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'api.ts', 'mw.ts'],
  images: {
    domains: ['product-images.tcgplayer.com'],
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/customer/dashboard',
      },
    ]
  },
}

export default nextConfig
