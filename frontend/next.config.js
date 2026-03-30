/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.idpcontable.com'],
  },
  output: 'standalone',
  // Desactivar exportación estática para páginas que usan React Router
  trailingSlash: false,
  env: {
    VITE_API_URL: process.env.VITE_API_URL,
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL,
    VITE_API_TIMEOUT: process.env.VITE_API_TIMEOUT,
    VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN,
    VITE_SENTRY_ENVIRONMENT: process.env.VITE_SENTRY_ENVIRONMENT,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:8000 https://api.idpcontable.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
