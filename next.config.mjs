/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/control-center',
        destination: '/control-centre',
        permanent: true,
      },
      {
        source: '/control-center/:slug',
        destination: '/control-centre/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
