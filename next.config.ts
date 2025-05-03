// import "./env.mjs"

// /** @type {import('next').NextConfig} */

import { fileURLToPath } from "node:url";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      hostname: "*.amazonaws.com"
    }],
  },
}

export default nextConfig
