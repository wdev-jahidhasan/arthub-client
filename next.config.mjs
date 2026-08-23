/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    
    remotePatterns: [
      // all sites

      {
        protocol: 'https',
        hostname: '**',
      },

      // {
      //   protocol: 'https',
      //   hostname: 'i.ibb.co',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'flagcdn.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'picsum.photos',
      // },
    ],
  },
};

export default nextConfig;
