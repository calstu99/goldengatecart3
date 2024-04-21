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

      ],
    },

};

export default nextConfig;
