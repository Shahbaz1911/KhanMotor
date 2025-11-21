
"use client";

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { LinkPreview } from "@/components/ui/link-preview";
import ScrollReveal from "@/components/custom/ScrollReveal";
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

const AboutContent = () => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto py-16 md:py-24">
            <h2 className="mb-6 text-4xl tracking-tight lg:text-5xl font-black uppercase text-foreground">
                Your Trusted Auto Repair Shop & Car Dealership
            </h2>
            <div className="text-lg text-muted-foreground my-5 space-y-4">
                <span>
                  Since 1995, Motor Khan has been your trusted car workshop for premium used cars and expert auto repair.
                  As a leading car dealership in Rithala, Delhi, we specialize in{" "}
                  <LinkPreview
                    url="/gallery"
                    className="font-bold text-primary"
                    isStatic
                    imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-gallery.png"
                  >
                    certified pre-owned vehicles
                  </LinkPreview>
                  , ensuring quality and reliability.
                </span>
                <span>
                  Whether you need brake repair, denting, car painting, or{" "}
                  <LinkPreview
                    url="/contact"
                    className="font-bold text-primary"
                    isStatic
                    imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-contact.png"
                  >
                    want to sell your car
                  </LinkPreview>
                  , our expert team ensures affordable and reliable service across Rohini, Rithala, Vijay Vihar, and Budh Vihar.
                </span>
            </div>

            <Button
                variant="outline"
                size="lg"
                className="group bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                onClick={() => router.push("/contact")}
            >
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <section className="py-16 md:py-24">
              <ScrollReveal>
                At Motor Khan, we don’t just sell and service cars — we build relationships. Our passion for automotive
                excellence drives us to deliver the best car repair and restoration services in Delhi NCR.
              </ScrollReveal>
              <ScrollReveal>
                Visit us in Rohini or Rithala to experience top-tier craftsmanship, transparent pricing, and trusted service.
              </ScrollReveal>
            </section>
        </div>
    );
};

export function AboutPageClient() {
    useEffect(() => {
        window.scrollTo(0, 0);

        const resetEvent = new Event('resetSection');
        window.dispatchEvent(resetEvent);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <ScrollExpandMedia
                mediaType="video"
                mediaSrc="https://delhi.motorkhan.com/videos/motor-khan-rithala-rohini-delhi-about.mp4"
                bgImageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop"
                title="About Motor Khan"
                date="Since 1995"
                scrollToExpand="Scroll to Explore"
                textBlend
            >
                <AboutContent />
            </ScrollExpandMedia>
        </div>
    );
}

