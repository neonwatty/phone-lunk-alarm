/** @type {import('next').NextConfig} */

// For GitHub Pages deployment to username.github.io/repo-name, set NEXT_PUBLIC_BASE_PATH=/repo-name
// For root domain deployment (username.github.io or custom domain), leave empty or unset
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
