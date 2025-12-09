
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Car Care Blog | Motor Khan",
    description: "Tips, guides, and expert advice from Motor Khan on car servicing, repair, and maintenance in Delhi. Keep your vehicle running smoothly with our insights.",
    alternates: {
        canonical: "https://motorkhan.com/blog",
    }
};

const posts = [
  {
    slug: "why-regular-car-servicing-is-important-in-delhi",
    title: "Why Regular Car Servicing Is Crucial in Delhi",
    date: "2024-07-29",
    summary: "Discover how regular car servicing at our Rohini workshop can save you money, improve safety, and enhance performance, especially in demanding Delhi conditions.",
  },
  // Add more blog posts here as they are created
];

export default function BlogPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="mb-8">
            <Button variant="outline" asChild>
                <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
                </Link>
            </Button>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase mb-4">Motor Khan Blog</h1>
        <p className="mb-12 text-lg text-muted-foreground lowercase">
          Expert tips, guides, and information from our Delhi workshop on car servicing, repair, and maintenance to keep your vehicle in prime condition.
        </p>

        <ul className="space-y-8">
          {posts.map(post => (
            <li key={post.slug} className="border-b border-border pb-8">
              <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl md:text-3xl font-black uppercase text-primary group-hover:text-destructive transition-colors duration-300">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-3 text-md text-muted-foreground lowercase">{post.summary}</p>
              <Button variant="link" asChild className="mt-4 px-0">
                <Link href={`/blog/${post.slug}`}>
                  Read More &rarr;
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
