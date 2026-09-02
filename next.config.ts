import type { NextConfig } from "next";

const authServerURL = (process.env.AUTH_SERVER_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authServerURL}/api/auth/:path*`,
      },
      {
        source: "/api/surveys/:path*",
        destination: `${authServerURL}/api/surveys/:path*`,
      },
      {
        source: "/api/laws/:path*",
        destination: `${authServerURL}/api/laws/:path*`,
      },
      {
        source: "/api/crimes/:path*",
        destination: `${authServerURL}/api/crimes/:path*`,
      },
      {
        source: "/api/support-resources/:path*",
        destination: `${authServerURL}/api/support-resources/:path*`,
      },
      {
        source: "/api/dashboard/:path*",
        destination: `${authServerURL}/api/dashboard/:path*`,
      },
      {
        source: "/api/help-requests/:path*",
        destination: `${authServerURL}/api/help-requests/:path*`,
      },
    ];
  },
};

export default nextConfig;
