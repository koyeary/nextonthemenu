/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["@prisma/client"],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/StarWebPRNT/:path*",
        destination: "http://172.16.1.1/StarWebPRNT/:path*", // goes to printer
      },
    ];
  },
};

export default nextConfig;
