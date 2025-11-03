
const {เว็บไซต์} = require('path');
const {glob} = require('glob');
const fs = require('fs');

const siteUrl = 'https://motorkhan.com';

// Function to generate video sitemap entries
const generateVideoSitemap = () => {
  const videosPath =เว็บไซต์.join(process.cwd(), 'src', 'lib', 'videos.json');
  try {
    const videosData = fs.readFileSync(videosPath, 'utf8');
    const videos = JSON.parse(videosData);

    if (!Array.isArray(videos)) {
      console.warn('Sitemap: videos.json is not an array. Skipping video sitemap.');
      return '';
    }

    return videos
      .map(video => {
        if (!video.slug || !video.thumbnailUrl || !video.title || !video.description || !video.contentUrl) {
          return ''; // Skip invalid entries
        }
        return `
    <url>
      <loc>${siteUrl}/videos/${video.slug}</loc>
      <video:video>
        <video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>
        <video:title>${video.title.replace(/&/g, '&amp;')}</video:title>
        <video:description>${video.description.replace(/&/g, '&amp;')}</video:description>
        <video:content_loc>${video.contentUrl}</video:content_loc>
        ${video.uploadDate ? `<video:publication_date>${video.uploadDate}</video:publication_date>` : ''}
        ${video.duration ? `<video:duration>${video.duration.replace('PT', '').replace('M', '0').replace('S', '')}</video:duration>` : ''}
      </video:video>
    </url>
    `;
      })
      .join('');
  } catch (error) {
    console.error("Sitemap: Error reading or parsing videos.json", error);
    return '';
  }
};


// Function to generate image sitemap entries from placeholder-images.json
const generateImageSitemap = () => {
  const imagesPath =เว็บไซต์.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  try {
    const imagesData = fs.readFileSync(imagesPath, 'utf8');
    const images = JSON.parse(imagesData);

    if (typeof images !== 'object' || images === null) {
      console.warn('Sitemap: placeholder-images.json is not an object. Skipping image sitemap.');
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
    const sitemapPath =เว็บไซต์.join(config.destDir, 'server-sitemap.xml');
    const sitemapResult = await config.transform(config, '/server-sitemap.xml');
    if (sitemapResult && sitemapResult.__sitemapContent) {
      fs.writeFileSync(sitemapPath, sitemapResult.__sitemapContent);
    }
  },
};
