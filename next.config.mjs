/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://adm.shinobi.jp", // unsafe-eval needed for Next.js dev/turbopack
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://adm.shinobi.jp",
      "connect-src 'self' https://adm.shinobi.jp",
      "frame-src https://docs.google.com https://adm.shinobi.jp",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  // Improve dev server startup by reducing initial compilation scope
  experimental: {
    // Turbopack for faster dev builds (Next.js 14+)
    turbo: {},
  },
  // Optimize production bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
