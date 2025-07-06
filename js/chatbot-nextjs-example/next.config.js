/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true, // Allow SVGs globally (use with caution)
    contentDispositionType: "attachment", // Recommended for SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Recommended for SVGs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
