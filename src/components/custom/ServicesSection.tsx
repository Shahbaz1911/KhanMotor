
"use client";

import React from "react";
import {
  Wrench,
  Paintbrush,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LinkPreview } from "@/components/ui/link-preview";

const services = [
  {
    icon: Wrench,
    title: "Car Repair & Servicing",
    description: "Comprehensive <a href='/contact'>auto repair and car servicing</a> from a trusted car workshop. We handle brake repair, transmission repair, and car engine diagnostics.",
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]"
  },
  {
    icon: Paintbrush,
    title: "Denting, Painting & Detailing",
    description: "Our auto body shop offers expert denting and painting services, paintless dent repair, scratch removal, and professional <a href='/contact'>car detailing</a>.",
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:1/7/2/13]"
  },
  {
    icon: Repeat,
    title: "Buy & Sell Used Cars",
    description: "Explore our car marketplace to <a href='/gallery'>buy used cars</a> or sell your car. We are a top used car dealer for certified pre-owned cars.",
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:2/1/3/7]"
  },
  {
    icon: ShieldCheck,
    title: "Car Maintenance",
    description: "Scheduled auto maintenance, including oil change service, tire replacement, wheel alignment, and <a href='/contact'>air conditioning repair</a>.",
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:2/7/3/13]"
  },
];

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <div className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold lowercase">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-foreground font-black uppercase">
            Our Auto Services
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl mt-4 lowercase">
            from classic car restoration to routine car maintenance, we are the best car mechanic for all your needs.
          </p>
        </div>
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 xl:max-h-[34rem]">
          {services.map((service, index) => (
            <GridItem
              key={index}
              area={service.area}
              icon={<service.icon className="h-4 w-4 text-black dark:text-neutral-400" />}
              title={service.title}
              description={
                <>
                  {service.title === "Car Repair & Servicing" && (
                     <>
                      Comprehensive <LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">auto repair and car servicing</LinkPreview> from a trusted car workshop. We handle brake repair, transmission repair, and car engine diagnostics.
                     </>
                  )}
                   {service.title === "Denting, Painting & Detailing" && (
                      <>
                      Our auto body shop offers expert denting and painting services, paintless dent repair, scratch removal, and professional <LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">car detailing</LinkPreview>.
                      </>
                  )}
                  {service.title === "Buy & Sell Used Cars" && (
                      <>
                      Explore our car marketplace to <LinkPreview url="/gallery" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/gallerypage.png">buy used cars</LinkPreview> or sell your car. We are a top used car dealer for certified pre-owned cars.
                      </>
                  )}
                  {service.title === "Car Maintenance" && (
                      <>
                      Scheduled auto maintenance, including oil change service, tire replacement, wheel alignment, and <LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">air conditioning repair</LinkPreview>.
                      </>
                  )}
                </>
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

    