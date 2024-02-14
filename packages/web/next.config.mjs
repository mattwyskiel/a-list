/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.mattwyskiel.com"],
  },
  webpack: (config, options) => {
    if (!options.dev) {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
