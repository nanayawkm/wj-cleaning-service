/** @type {import('next').NextConfig} */
const nextConfig = {
  // The PDF renderer embeds font binaries and resolves them from disk at call
  // time. Bundling it into the server build breaks that resolution, so it is
  // left as a real node_modules import.
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next re-encodes on delivery, so its quality is the one the visitor sees.
    // The default 75 on top of an already-compressed source was compressing
    // every photograph twice and showing it.
    qualities: [75, 90],
  },
}

export default nextConfig
