import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="text-center">
        <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
          Welcome to Khan Motor
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Discover our exclusive collection of premium vehicles. We offer the finest selection and unparalleled customer service.
        </p>
        <div className="relative mx-auto mb-12 h-64 w-full max-w-4xl overflow-hidden rounded-lg shadow-xl md:h-96">
          <Image
            src="https://placehold.co/1200x600.png"
            alt="Luxury cars showcase"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="luxury cars"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Find Your Dream Car</h2>
          </div>
        </div>
        <Button asChild size="lg" className="group">
          <Link href="/vehicles">
            Explore Our Gallery
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </section>

      <section className="mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-3 text-2xl font-semibold font-headline">Premium Selection</h3>
          <p className="text-muted-foreground">
            Handpicked vehicles from the world&apos;s most prestigious brands. Quality and luxury guaranteed.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-3 text-2xl font-semibold font-headline">Expert Service</h3>
          <p className="text-muted-foreground">
            Our knowledgeable team is here to assist you every step of the way, ensuring a seamless experience.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-3 text-2xl font-semibold font-headline">AI-Powered Support</h3>
          <p className="text-muted-foreground">
            Get quick and personalized responses to your inquiries with our advanced AI reply assistant.
          </p>
        </div>
      </section>
    </div>
  );
}
