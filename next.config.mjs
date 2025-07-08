import withPWA from 'next-pwa'

const isDev = process.env.NODE_ENV === 'development'

const baseConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
  ...baseConfig
})
