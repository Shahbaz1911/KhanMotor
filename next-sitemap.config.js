
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
  const imagesPath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  try {
    const imagesData = fs.readFileSync(imagesPath, 'utf8');
    const images = JSON.parse(imagesData);

    if (typeof images !== 'object' || images === null || Object.keys(images).length === 0) {
      console.warn('Sitemap: placeholder-images.json is not a valid, non-empty object. Skipping image sitemap.');
      return '';
    }

    return Object.values(images)
      .map(image => {
        if (typeof image !== 'object' || image === null || !image.url) {
          return ''; // Skip invalid entries
        }
        return `
    <url>
      <loc>${image.url}</loc>
      <image:image>
        <image:loc>${image.url}</image:loc>
      </image:image>
    </url>
    `;
      })
      .join('');
  } catch (error) {
    console.error("Sitemap: Error reading or parsing placeholder-images.json", error);
    return '';
  }
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
      `${siteUrl}/server-sitemap.xml`,
    ],
  },
  // The transform function is used to generate the server-sitemap.xml
  transform: async (config, path) => {
    // Return null for all paths except the one for the server-sitemap
    if (path !== '/server-sitemap.xml') {
      return null;
    }

    const imageSitemap = generateImageSitemap();
    
    // Combine video and image sitemap into one string
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
