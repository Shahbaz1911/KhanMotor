
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
  return videos.find((video) => video.slug === slug);
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

  return {
    title: video.title,
    description: video.description,
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
    },
    alternates: {
      canonical: `https://motorkhan.com/videos/${video.slug}`,
    }
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
                <video
                    src={video.contentUrl}
                    poster={video.thumbnailUrl}
                    controls
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    Your browser does not support the video tag.
                </video>
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none opacity-100 group-focus-within:opacity-0 group-hover:opacity-0 transition-opacity">
                    <PlayCircle className="h-20 w-20 text-white/80" />
                </div>
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
