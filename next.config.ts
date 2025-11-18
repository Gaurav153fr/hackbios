import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  experimental: {
    serverActions: {
      // edit: updated to new key. Was previously `allowedForwardedHosts`
      allowedOrigins: ['https://7jkjxkfp-3000.inc1.devtunnels.ms'],
    },
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://7jkjxkfp-3000.inc1.devtunnels.ms", // your dev tunnel URL
  ],
};

export default nextConfig;
