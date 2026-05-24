/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co', 'images.ra.co', 'bandsintown.com', 's1.ticketm.net', 'resizing.flixster.com'],
  },
  env: {
    TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY,
  },
};

module.exports = nextConfig;
