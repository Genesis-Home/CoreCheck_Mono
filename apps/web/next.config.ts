import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    // Same arrangement as CoreStock: the browser calls /api/* on this origin
    // and Next forwards it to the API, so the API needs no CORS setup.
    // BACKEND_URL defaults to the API running locally; point it at staging to
    // work against that instead.
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
