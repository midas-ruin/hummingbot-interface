const withTwin = require('./withTwin.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now the default in Next.js 14.1.0+
  experimental: {
    forceSwcTransforms: false
  },
  compiler: {
    styledComponents: true
  },
  transpilePackages: ['@hummingbot/hbui'],
  reactStrictMode: true,
  poweredByHeader: false,
  // Remove conflicting port settings to avoid issues
  // Let Next.js choose a port automatically if default is used
  env: {
    PORT: process.env.PORT || '3000'
  },
  webpack: (config, { isServer }) => {
    // Fix for path resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    return config;
  }
};

module.exports = withTwin(nextConfig);
