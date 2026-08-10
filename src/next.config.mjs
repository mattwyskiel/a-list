/** @type {import('next').NextConfig} */
const nextConfig = {
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
