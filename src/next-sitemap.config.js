
const path = require('path');
const {glob} = require('glob');
const fs = require('fs');

const siteUrl = 'https://motorkhan.com';

// Function to generate video sitemap entries
const generateVideoSitemap = () => {
  return '';
};


// Function to generate image sitemap entries from placeholder-images.json
const generateImageSitemap = () => {
  return '';
};


module.exports = {
  siteUrl,
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
        disallow: ['/admin/', '/api/', '/server/'],
      }
    ],
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/server-sitemap.xml`,
    ],
  },
  // The transform function is used to generate the server-sitemap.xml
  transform: async (config, path) => {
    // Return null for all paths except the one for the server-sitemap
    if (path !== '/server-sitemap.xml') {
      return null;
    }

    const videoSitemap = generateVideoSitemap();
    const imageSitemap = generateImageSitemap();
    
    // Combine video and image sitemap into one string
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${videoSitemap}
  ${imageSitemap}
</urlset>`;

    // This is a bit of a workaround to inject a complete sitemap file
    // The library expects an object, but we are providing the raw XML content
    return {
      loc: path, 
      // other fields are not needed because we are creating a custom sitemap
      // and we will write it to the file system ourselves.
      __sitemapContent: sitemapContent,
    };
  },
  // After the build, we take our generated XML and write it to the file
  afterBuild: async (config) => {
    const sitemapPath = path.join(config.destDir, 'server-sitemap.xml');
    const sitemapResult = await config.transform(config, '/server-sitemap.xml');
    if (sitemapResult && sitemapResult.__sitemapContent) {
      fs.writeFileSync(sitemapPath, sitemapResult.__sitemapContent);
    }
  },
};
