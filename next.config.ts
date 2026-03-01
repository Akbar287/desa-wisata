import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@react-pdf/renderer', '@react-pdf/font', '@react-pdf/layout', '@react-pdf/pdfkit', '@react-pdf/primitives'],
};

export default nextConfig;
