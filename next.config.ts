/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kim.uni-hohenheim.de",
      },
    ],
  },
};

module.exports = nextConfig;
