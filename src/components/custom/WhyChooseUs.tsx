
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
      title: "Selection",
      value: "selection",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-background border">
          <p className="uppercase">Curated Selection</p>
          <div className="text-sm md:text-base lg:text-lg font-normal mt-4 lowercase text-muted-foreground">
            We don't just sell cars; we offer a meticulously handpicked collection of luxury and performance vehicles. Each car is chosen for its quality, history, and character. <LinkPreview url="/gallery" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-gallery.png">Find your next car for sale</LinkPreview> from our curated collection at our premier car dealership. Your journey to owning an exceptional vehicle begins here.
          </div>
          <Car className="absolute -bottom-10 -right-10 h-48 w-48 text-foreground/10" strokeWidth={1.5} />
        </div>
      ),
    },
    {
      title: "Quality",
      value: "quality",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-background border">
          <p className="uppercase">Verified Quality</p>
           <div className="text-sm md:text-base lg:text-lg font-normal mt-4 lowercase text-muted-foreground">
            Peace of mind comes standard at Motor Khan. Every vehicle in our inventory undergoes a comprehensive, multi-point inspection by our certified technicians. We offer <LinkPreview url="/gallery" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-gallery.png">certified pre-owned cars</LinkPreview> with detailed history reports, ensuring transparency and guaranteeing your peace of mind.
          </div>
          <ShieldCheck className="absolute -bottom-10 -right-10 h-48 w-48 text-foreground/10" strokeWidth={1.5} />
        </div>
      ),
    },
    {
      title: "Expertise",
      value: "expertise",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-background border">
          <p className="uppercase">Expert Auto Maintenance</p>
           <div className="text-sm md:text-base lg:text-lg font-normal mt-4 lowercase text-muted-foreground">
            Our state-of-the-art <LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-contact.png">auto repair shop</LinkPreview> is equipped with the latest diagnostic tools and staffed by certified technicians. We handle everything from routine oil changes and brake services to complex transmission repairs and engine diagnostics, ensuring your vehicle performs at its peak.
          </div>
          <Wrench className="absolute -bottom-10 -right-10 h-48 w-48 text-foreground/10" strokeWidth={1.5} />
        </div>
      ),
    },
    {
      title: "Service",
      value: "service",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-background border">
          <p className="uppercase">Personalized Service</p>
          <div className="text-sm md:text-base lg:text-lg font-normal mt-4 lowercase text-muted-foreground">
            Experience a service tailored to you. Our trusted car workshop offers dedicated consultants to guide you through every step, whether you're buying, selling, or servicing. For your convenience, we even offer a <LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-contact.png">mobile mechanic</LinkPreview> service, bringing our expertise directly to your doorstep.
          </div>
          <MessageSquareHeart className="absolute -bottom-10 -right-10 h-48 w-48 text-foreground/10" strokeWidth={1.5} />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[30rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full  items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
}
