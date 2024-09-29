/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/drngufzyf/image/upload/**", // Update this to match the correct account path
      },
    ],
  },
};

export default nextConfig;
