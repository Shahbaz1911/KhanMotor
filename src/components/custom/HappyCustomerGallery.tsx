
"use client";

import Image from "next/image";
import { ArrowRight, Loader2, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, query, limit, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;

    const galleryCollection = collection(firestore, "gallery");
    // Query for the 6 newest items
    const q = query(galleryCollection, orderBy("createdAt", "desc"), limit(6));
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
        gridRef.current?.children || [],
        {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.1,
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
          <h2 className="text-4xl tracking-tight lg:text-5xl text-foreground font-black">
            Happy Customers, Happy Cars
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl mt-4">
            Join our community of satisfied clients and their stunning vehicles.
          </p>
        </div>

        {loading || !firestore ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.length > 0 ? galleryItems.map((item) => (
                <div
                key={item.id}
                className="group relative block h-[400px] w-full overflow-hidden rounded-lg shadow-lg"
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
                        {item.customerName && <h3 className="text-xl font-black">{item.customerName}</h3>}
                        {item.rating && <div className="mt-1 flex">
                        {Array(item.rating)
                            .fill(0)
                            .map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>}
                    </div>
                    <p className="mt-2 text-sm font-medium">
                        {item.caption}
                    </p>
                    </div>
                </div>
                </div>
            )) : (
                 <div className="sm:col-span-2 lg:col-span-3 text-center text-muted-foreground p-12 border border-dashed rounded-lg">
                    No customer photos have been uploaded yet. Be the first!
                </div>
            )}
            </div>
        )}

        <div className="mt-12 text-center">
            <Button size="lg" variant="outline" onClick={() => router.push('/happy-customers')} className="group">
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
      </div>
    </section>
  );
}
