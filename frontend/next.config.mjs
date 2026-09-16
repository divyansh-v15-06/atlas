/** @type {import('next').NextConfig} */

const nextConfig = {
    // Self-contained server bundle for the Docker runtime image
    output: 'standalone',
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'portfolios.nith.ac.in',
            },
            {
                protocol: 'http',
                hostname: 'portfolios.nith.ac.in',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    typescript: {
        // Ignore legacy typescript compilation errors on build
        ignoreBuildErrors: true,
    },
}

export default nextConfig
