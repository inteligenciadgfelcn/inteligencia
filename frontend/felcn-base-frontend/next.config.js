const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath:
    '' === process.env.NEXT_PUBLIC_PATH
      ? undefined
      : '/' + process.env.NEXT_PUBLIC_PATH,
  reactStrictMode: false, // se desactiva porque React 18 renderiza y llama useEffect 2 veces 🤷‍♂️
  poweredByHeader: false,
  webpack: (config, context) => {
    if (!context.isServer) {
      config.resolve.fallback.child_process = false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },
  output: 'standalone',
  eslint: {
    dirs: ['src', 'stories', 'test'],
  },
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_IMAGES_DOMAIN
      ? process.env.NEXT_PUBLIC_IMAGES_DOMAIN.split(',').map((domain) => ({
          protocol: domain === 'localhost' ? 'http' : 'https',
          hostname: domain,
          pathname: '**',
        }))
      : [
          {
            protocol: 'http',
            hostname: 'localhost',
            pathname: '**',
          },
        ],
  },
  transpilePackages: ['@mui/x-data-grid', '@mui/material'],
}

module.exports = withBundleAnalyzer(nextConfig)
