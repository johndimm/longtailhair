/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    GITHUB_ID: "Ov23liHVksBzgnKRlBMD",
    GITHUB_SECRET: "92abd461a97858a27a3103ce742acd7dc442ffb4",
  },
  images: {
    domains: [
      "m.media-amazon.com",
      "image.tmdb.org",
      "images-na.ssl-images-amazon.com",
      "avatars.githubusercontent.com"
    ],
  }
};

export default nextConfig;
