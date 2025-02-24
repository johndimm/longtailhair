/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "m.media-amazon.com",
      "image.tmdb.org",
      "images-na.ssl-images-amazon.com"
    ],
  }
};

export default nextConfig;
