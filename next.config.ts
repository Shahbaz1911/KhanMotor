
import type {NextConfig} from 'next';
import withSitemap from 'next-sitemap';

/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: 'https://motorkhan.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin/', '/api/'],
      }
    ],
    additionalSitemaps: [
      `https://motorkhan.com/server-sitemap.xml`,
    ],
  },
   exclude: ["/admin", "/admin/*", "/server-sitemap.xml"], 
};


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'armanautoxperts-in.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'delhi.motorkhan.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(png|jpg|jpeg|gif|webp|avif|svg|ico|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withSitemap(nextConfig, nextSitemapConfig);
