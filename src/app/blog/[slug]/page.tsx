
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from 'next';

const posts: { [key: string]: { title: string; metadata: Metadata; content: string[] } } = {
  "why-regular-car-servicing-is-important-in-delhi": {
    title: "Why Regular Car Servicing Is Crucial in Delhi",
    metadata: {
        title: "Why Regular Car Servicing Is Crucial in Delhi | Motor Khan",
        description: "Learn why regular car servicing at our Rohini, Delhi workshop is essential for your vehicle's health, safety, and longevity. Expert tips from Motor Khan.",
        keywords: ["car servicing delhi", "car repair rohini", "vehicle maintenance delhi", "Motor Khan blog", "car service center delhi"],
        alternates: {
            canonical: "https://motorkhan.com/blog/why-regular-car-servicing-is-important-in-delhi",
        },
        openGraph: {
            title: "Why Regular Car Servicing Is Crucial in Delhi | Motor Khan",
            description: "Expert insights on the importance of regular car maintenance for navigating Delhi's challenging road conditions.",
            url: "https://motorkhan.com/blog/why-regular-car-servicing-is-important-in-delhi",
            images: [
                {
                    url: "https://delhi.motorkhan.com/images/og/motor-khan-car-servicing.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Car being serviced at Motor Khan workshop in Delhi",
                },
            ]
        }
    },
    content: [
      "Regular car servicing isn't just a recommendation; it's a vital investment in your vehicle's health, safety, and longevity. In a bustling city like Delhi, where traffic, pollution, and extreme weather conditions put immense stress on your car, routine maintenance becomes even more critical. Skipping a service might seem like a way to save money in the short term, but it often leads to costlier repairs and compromises your safety on the road.",
      "<h2>Why is Regular Servicing So Important in Delhi?</h2>",
      "Delhi's unique environment presents several challenges for your vehicle:",
      "<ul><li><strong>Heavy Traffic:</strong> Constant stop-and-go driving puts extra strain on your engine, brakes, and transmission.</li><li><strong>Poor Road Conditions:</strong> Potholes and uneven surfaces can misalign your wheels and damage your suspension.</li><li><strong>Extreme Weather:</strong> Scorching summers can degrade engine oil and coolant faster, while monsoon humidity can affect electrical components.</li><li><strong>High Pollution:</strong> Dust and pollutants clog air and oil filters, reducing engine efficiency and cabin air quality.</li></ul>",
      "<h2>Key Benefits of Timely Car Servicing</h2>",
      "Here are the top reasons to stick to your car's recommended service schedule:",
      "<ul><li><strong>Enhanced Safety:</strong> A thorough service includes checks on critical safety components like brakes, tires, and steering. Identifying and fixing issues early can prevent accidents.</li><li><strong>Improved Fuel Efficiency:</strong> A well-maintained engine with clean filters, fresh oil, and properly inflated tires consumes less fuel, saving you money at the pump.</li><li><strong>Increased Reliability:</strong> Regular checks significantly reduce the risk of unexpected breakdowns, ensuring your car is reliable for your daily commute and long road trips from Delhi.</li><li><strong>Higher Resale Value:</strong> A car with a complete and documented service history, like one from Motor Khan, commands a better price in the second-hand market.</li><li><strong>Extended Vehicle Lifespan:</strong> Routine maintenance prevents minor issues from becoming major, expensive problems, ultimately extending the life of your car.</li></ul>",
      "<h2>How Can Motor Khan Help?</h2>",
      "At Motor Khan, our state-of-the-art workshop in Rohini, Delhi, is equipped to handle all your car servicing needs. Our certified technicians perform a comprehensive check-up that covers everything from engine performance to AC service.",
      "<p>We offer:</p><ul><li><strong>Comprehensive Service Packages:</strong> Tailored to your car's make, model, and age.</li><li><strong>Expert Diagnostics:</strong> Using the latest tools to identify any underlying issues.</li><li><strong>Genuine Parts:</strong> We use only high-quality, genuine parts for all replacements.</li></ul>",
      "<p>Don't wait for a warning light to appear. Proactive maintenance is the key to a healthy car. <a href='/contact'>Contact Motor Khan today</a> to book your next car service and experience the peace of mind that comes with expert care.</p>",
      "<h3>Frequently Asked Questions (FAQ)</h3>",
      "<h4>How often should I service my car in Delhi?</h4>",
      "<p>We recommend a full service every 10,000 kilometers or at least once a year, whichever comes first. Given Delhi's conditions, more frequent check-ups can be beneficial.</p>",
      "<h4>What is included in a standard car service at Motor Khan?</h4>",
      "<p>Our standard service includes an oil and filter change, brake inspection, tire check, fluid top-ups, and a comprehensive diagnostic scan of all major systems.</p>",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) {
    return {};
  }
  return post.metadata;
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];

  if (!post) {
    return notFound();
  }

  return (
    <main className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                    </Link>
                </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase mb-4 text-primary">{post.title}</h1>
            <article className="prose prose-lg dark:prose-invert prose-p:lowercase prose-headings:uppercase">
                {post.content.map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: block }} />
                ))}
            </article>
        </div>
    </main>
  );
}
