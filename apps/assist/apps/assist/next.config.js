/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  transpilePackages: ['@oursynth/core'],
  // Allow importing from outside the app dir (monorepo packages)
  experimental: { externalDir: true }
};
module.exports = nextConfig;
