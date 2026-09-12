/** @type {import('next').NextConfig} */

const nextConfig = {
    // Self-contained server bundle for the Docker runtime image
    output: 'standalone',
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
