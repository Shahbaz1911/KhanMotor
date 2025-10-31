
module.exports = {
  siteUrl: 'https://motorkhan.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin/', '/api/', '/server/'],
      }
    ]
  }
};
