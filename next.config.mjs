/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // تم التعطيل لدعم Server Actions والأمان
    images: {
        unoptimized: true,
    },
    // Required for static export on some subdirectories
    trailingSlash: true,
};

export default nextConfig;
