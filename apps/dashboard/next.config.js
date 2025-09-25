/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'shared-utils',
    'shared-types', 
    'shared-config',
    'ui',
    'ui-components',
    'design-system',
    'analyzer',
    'orchestrator'
  ],
};

module.exports = nextConfig;
