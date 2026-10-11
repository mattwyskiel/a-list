/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false, // the semantics generated are not true
  // build:next checks with Bun before and after Next.js generates build types.
  typescript: { ignoreBuildErrors: true },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.mattwyskiel.com",
      },
    ],
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
