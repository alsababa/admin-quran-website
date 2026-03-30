/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    // Required for static export on some subdirectories
    trailingSlash: true,
};

export default nextConfig;
