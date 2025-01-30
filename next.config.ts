import type {NextConfig} from 'next';

const isPreview = process.env.API_ENV === 'preview';

const urlBase = process.env.API_URL;

if (isPreview && !urlBase) {
  throw Error(
    'NEXT_PUBLIC_API_URL and API_URL needed in environment file if API_ENV=`preview`'
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // port: '',
        // search: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/gym',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    console.log('Preview', isPreview && urlBase);
    return (isPreview && urlBase)
      ? [
        {
          source: '/v0/:path*',
          destination: `${urlBase}/v0/:path*`,
        },
      ]
      : [];
  },
  async headers() {
    return [
      {
        source: '/v0/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, content-type, Authorization',
          },
        ],
      },
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ];
  },
  // reactProductionProfiling: !,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-left',
  },
  /* config options here */
};

export default nextConfig;
