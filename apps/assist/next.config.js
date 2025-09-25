/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
<<<<<<< HEAD
  transpilePackages: ['@oursynth/core'],
  // Allow importing from outside the app dir (monorepo packages)
  experimental: { externalDir: true }
};
module.exports = nextConfig;
=======
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
};
export default nextConfig;
>>>>>>> main
