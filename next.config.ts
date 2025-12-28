import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,       // ✅ verhindert Routing-Probleme
  images: {
    unoptimized: true,       // ✅ wichtig, wenn du next/image nutzt
  },
};

export default nextConfig;

