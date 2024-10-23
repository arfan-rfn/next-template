// import "./env.mjs"

// /** @type {import('next').NextConfig} */

import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./env");
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      hostname: "*.amazonaws.com"
    }],
  },
}

export default nextConfig
