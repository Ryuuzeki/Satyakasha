import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Prevent Clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // Prevent MIME typing sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    // Mengizinkan Midtrans scripts & frames. Mengizinkan blob/data URLs untuk gambar IPFS preview.
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self' https: wss:; frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com;",
  }
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.18.18", "localhost", "127.0.0.1"],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
