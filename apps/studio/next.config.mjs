/** @type {import('next').NextConfig} */
const nextConfig = {
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
  compiler: {
    // Enable styled-components support
    styledComponents: true,
  },
  // Add support for importing SVGs as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
}

export default nextConfig;
