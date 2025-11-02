
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import videos from '@/lib/videos.json';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VideoPageProps {
  params: {
    slug: string;
  };
}

// Find the video data based on the slug
const getVideoData = (slug: string) => {
  return videos.find((video) => video.slug === slug) as (typeof videos)[0] | undefined;
};

// Generate static pages for each video at build time
export async function generateStaticParams() {
  return videos.map((video) => ({
    slug: video.slug,
  }));
}

// Generate metadata for each video page
export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const video = getVideoData(params.slug);

  if (!video) {
    return {};
  }

  const defaultDescription = `Watch how Motor Khan provides professional car denting, painting, and body restoration services in Rohini, Delhi. Call us for affordable car repair today.`;

  return {
    title: video.title,
    description: video.description || defaultDescription,
    openGraph: {
      title: video.title,
      description: video.description,
      type: 'video.other',
      url: `https://motorkhan.com/videos/${video.slug}`,
      images: [
        {
          url: video.thumbnailUrl,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
      videos: video.embedUrl ? [{ url: video.embedUrl }] : [],
    },
    alternates: {
      canonical: `https://motorkhan.com/videos/${video.slug}`,
    },
    twitter: video.embedUrl ? {
        card: "player",
        player: video.embedUrl,
    } : undefined,
  };
}

export default function VideoPage({ params }: VideoPageProps) {
  const video = getVideoData(params.slug);

  if (!video) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    duration: video.duration,
    publisher: {
      '@type': 'Organization',
      name: 'Motor Khan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png',
      },
    },
  };

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden shadow-2xl">
            <div className="relative aspect-video w-full">
               {video.embedUrl ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`${video.embedUrl}?si=Ghw7Ar8R1xlteTTf&autoplay=1&modestbranding=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                      src={video.contentUrl}
                      poster={video.thumbnailUrl}
                      controls
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                  >
                      Your browser does not support the video tag.
                  </video>
                )}
            </div>
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl uppercase">{video.title}</CardTitle>
                <CardDescription className="pt-2">{video.description}</CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}
