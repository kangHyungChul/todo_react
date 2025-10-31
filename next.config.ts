import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'odp.airport.kr',
                pathname: '/apiPortal/**',
            },
        ],
    },
};

export default nextConfig;
