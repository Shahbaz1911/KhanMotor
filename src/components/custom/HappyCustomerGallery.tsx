
"use client";

import Image from "next/image";
import { ArrowRight, Loader2, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface GalleryItem {
  id: string;
  caption: string;
  imageUrl: string;
  customerName?: string;
  rating?: number;
  aiHint?: string;
}

export function HappyCustomerGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!firestore) return;

    const galleryCollection = collection(firestore, "gallery");
    // Query for all items, newest first
    const q = query(galleryCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const galleryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
            setGalleryItems(galleryData);
            setLoading(false);
            ScrollTrigger.refresh();
        }, 
        (error) => {
            const permissionError = new FirestorePermissionError({
                path: galleryCollection.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );
    
    return () => unsubscribe();
  }, [firestore]);


  useEffect(() => {
    if (loading) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        carouselRef.current,
        {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <section ref={sectionRef} id="customer-gallery" className="bg-background relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-foreground font-black uppercase">
            Happy Customers, Happy Cars
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl mt-4 lowercase">
            join our community of satisfied clients and their stunning vehicles.
          </p>
        </div>

        {loading || !firestore ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            <>
                {galleryItems.length > 0 ? (
                  <div ref={carouselRef}>
                    <Carousel
                      plugins={[plugin.current]}
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {galleryItems.map((item, index) => (
                          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                              <div
                                className={cn(
                                  "group relative block h-[450px] w-full overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:z-10 hover:scale-105",
                                )}
                              >
                                <Image
                                  src={item.imageUrl}
                                  alt={`Customer photo: ${item.caption}`}
                                  fill
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  data-ai-hint={item.aiHint || 'customer car'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                  <div className="relative z-10 text-white">
                                    <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                      {item.customerName && <h3 className="text-xl font-black uppercase">{item.customerName}</h3>}
                                      {item.rating && <div className="mt-1 flex">
                                        {Array(item.rating)
                                          .fill(0)
                                          .map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                          ))}
                                      </div>}
                                    </div>
                                    <p className="mt-2 text-sm font-medium lowercase">
                                      {item.caption}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselDots />
                    </Carousel>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-12 border border-dashed rounded-lg lowercase">
                      no customer photos have been uploaded yet. be the first!
                  </div>
                )}
                 <div className="mt-12 text-center">
                    <Button size="lg" variant="outline" onClick={() => router.push('/happy-customers')} className="group">
                        View Full Gallery
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </>
        )}
      </div>
    </section>
  );
}
