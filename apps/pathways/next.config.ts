import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
