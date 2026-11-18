const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.gunesmetaltest.com", pathname: "/wp-content/uploads/**" }],
    formats: ["image/webp"],
  },
};
export default nextConfig;
