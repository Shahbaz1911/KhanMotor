
"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Carousel from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import CircularText from "./CircularText";
import Link from "next/link";

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
  const router = useRouter();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;

    const galleryCollection = collection(firestore, "gallery");
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
      })
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);
  
  const carouselSlides = galleryItems.map(item => ({
    title: item.customerName || item.caption,
    button: "View Details",
    src: item.imageUrl,
  }));

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
                  <div className="relative overflow-hidden w-full h-full py-20">
                      <Carousel slides={carouselSlides} />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-12 border border-dashed rounded-lg lowercase">
                      no customer photos have been uploaded yet. be the first!
                  </div>
                )}
                 <div className="mt-12 flex justify-center">
                    <Link href="/happy-customers">
                      <CircularText
                        text="VIEW*FULL*GALLERY*"
                        onHover="speedUp"
                        spinDuration={20}
                        className="text-sm text-foreground"
                      />
                    </Link>
                </div>
            </>
        )}
      </div>
    </section>
  );
}
