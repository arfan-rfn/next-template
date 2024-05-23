// import { fileURLToPath } from "node:url";
// import createJiti from "jiti";
// const jiti = createJiti(fileURLToPath(import.meta.url));

// jiti("./env");
import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default nextConfig
