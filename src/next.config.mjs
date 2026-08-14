/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false, // the semantics generated are not true
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
