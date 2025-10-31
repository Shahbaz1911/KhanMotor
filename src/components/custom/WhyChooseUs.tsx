
"use client";

import React from "react";
import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { LinkPreview } from "@/components/ui/link-preview";

export function WhyChooseUs() {
   const tabs = [
    {
      title: "Premium Selection",
      value: "selection",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-red-700 to-red-900">
          <p className="uppercase">Premium Vehicle Selection</p>
          <div className="text-sm font-normal mt-4 lowercase">
            Handpicked luxury and performance cars. <LinkPreview url="/gallery" className="font-bold text-white" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/gallerypage.png">Find your next car for sale</LinkPreview> from our curated collection at our car dealership.
          </div>
          <Car className="absolute -bottom-10 -right-10 h-48 w-48 text-white/10" strokeWidth={1.5} />
        </div>
      ),
    },
    {
      title: "Quality",
      value: "quality",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-700 to-blue-900">
          <p className="uppercase">Verified Quality</p>
           <div className="text-sm font-normal mt-4 lowercase">
            Each vehicle undergoes a rigorous quality check. We offer <LinkPreview url="/gallery" className="font-bold text-white" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/gallerypage.png">certified pre-owned cars</LinkPreview> for your peace of mind.
          </div>
          <ShieldCheck className="absolute -bottom-10 -right-10 h-48 w-48 text-white/10" strokeWidth={1.5} />
        </div>
      ),
    },
    {
      title: "Expertise",
      value: "expertise",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-emerald-700 to-emerald-900">
          <p className="uppercase">Expert Auto Maintenance</p>
           <div className="text-sm font-normal mt-4 lowercase">
            State-of-the-art <LinkPreview url="/contact" className="font-bold text-white" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">auto repair shop</LinkPreview> with certified technicians for all your auto maintenance needs, from oil change service to transmission repair.
          </div>
          <Wrench className="absolute -bottom-10 -right-10 h-48 w-48 text-white/10" strokeWidth={1.5} />
        </div>
      ),
    },
    {
      title: "Service",
      value: "service",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-amber-700 to-amber-900">
          <p className="uppercase">Personalized Service</p>
          <div className="text-sm font-normal mt-4 lowercase">
            Our trusted car workshop offers dedicated consultants to guide you. We even offer a <LinkPreview url="/contact" className="font-bold text-white" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">mobile mechanic</LinkPreview> for your convenience.
          </div>
          <MessageSquareHeart className="absolute -bottom-10 -right-10 h-48 w-48 text-white/10" strokeWidth={1.5} />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full  items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
}
    