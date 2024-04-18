/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggresiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: `${process.env.PROXY_API_HOST}/:path*`,
            },
        ]
    },
}

module.exports = withPWA(nextConfig)
