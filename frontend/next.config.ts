import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve all images through Next.js optimizer for automatic WebP/AVIF conversion,
    // responsive sizing, and lazy loading.
    remotePatterns: [
      // Unsplash (gallery placeholder images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Picsum (placeholder images)
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Cloudinary (optional CDN uploads)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Firebase Storage (admin-uploaded: logos, faculty, testimonial avatars)
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      // Google Cloud Storage direct bucket access
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      // Google user content (profile pictures / OAuth avatars)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Generate both WebP and AVIF for maximum browser coverage
    formats: ['image/avif', 'image/webp'],
    // Aggressive caching: images are cached for 1 year in the CDN/browser
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
