import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Configure asset handling to allow .md files to be served
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/markdown/[path][name][ext]',
      },
    });
    return config;
  },
  // Additional headers to serve markdown files properly
  async headers() {
    return [
      {
        source: '/:path*.md',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=UTF-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=UTF-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=UTF-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
  // Set environment variables for build time and runtime
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://github.com/cloud-media-forge',
  },
};

export default withMDX(config);
