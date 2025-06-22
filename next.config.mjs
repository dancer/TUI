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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'cpu-features': false,
      };
    }
    
    config.externals = config.externals || [];
    config.externals.push({
      "cpu-features": "cpu-features",
    });

    return config;
  },
};

export default nextConfig;
