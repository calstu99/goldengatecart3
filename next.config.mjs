/** @type {import('next').NextConfig} */
const nextConfig = {

    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.pexels.com',
          port: '',
          pathname: '/*/**',
        },
        {
            protocol: 'https',
            hostname: 'i.postimg.cc',
            port: '',
            pathname: '/*/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn.shopify.com',
            port: '',
            pathname: '/*/**',
          },


      ],
    },

};

export default nextConfig;

