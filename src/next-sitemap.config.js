
const siteUrl = 'https://motorkhan.com';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
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
      `${siteUrl}/server-sitemap.xml`,
    ],
  },
   exclude: ["/admin", "/admin/*", "/server-sitemap.xml"],
};
