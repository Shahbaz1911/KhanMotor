
"use client";

import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, MapPin, Phone, Mail, GalleryThumbnails } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import CircularText from "@/components/custom/CircularText";

export function ContactPageClient() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(
    "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png"
  );

  useEffect(() => {
    setLogoSrc(
      theme === "dark"
        ? "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png"
        : "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png"
    );
  }, [theme]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const showAnim = gsap
        .from(headerRef.current, {
          yPercent: -100,
          paused: true,
          duration: 0.2,
        })
        .progress(1);

      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          self.direction === -1 ? showAnim.play() : showAnim.reverse();
        },
      });
    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, []);

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/motorkhan", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/motorkhan", label: "Facebook" },
  ];

  const contactDetails = [
    {
      icon: MapPin,
      text: "Shop No. 12, Near Rice Mill, Vijay Vihar Phase I, Block B, Rithala, Rohini, Delhi 110085, India",
      href: "https://maps.app.goo.gl/WaAMeWr8BsjWmhhe8",
    },
    { icon: Phone, text: "+91 8595853918", href: "tel:+918595853918" },
    { icon: Phone, text: "+91 9871358670", href: "tel:+919871358670" },
    { icon: Mail, text: "motorkhandelhi@gmail.com", href: "mailto:motorkhandelhi@gmail.com" },
  ];

  const listVariants = {
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
    hidden: { opacity: 0 },
  };

  const itemVariants = { visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -20 } };

  return (
    <div ref={pageRef} className="bg-background font-cairo">
      <header ref={headerRef} className="fixed top-0 w-full z-50">
        <div className="relative flex justify-between items-center px-4 pt-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-foreground text-sm uppercase">
                MENU
                <AnimatedMenuIcon isOpen={isSheetOpen} className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-full bg-white dark:bg-black/80 dark:backdrop-blur-lg border-t dark:border-white/10 p-0"
              srTitle="Navigation Menu"
            >
              <AppSidebar onNavigate={() => setIsSheetOpen(false)} />
              <Button
                variant="ghost"
                onClick={() => setIsSheetOpen(false)}
                className="absolute top-4 right-4 text-black dark:text-white hover:bg-transparent text-sm"
                aria-label="Close menu"
              >
                CLOSE
                <AnimatedMenuIcon isOpen={true} className="ml-2 h-4 w-4" />
              </Button>
            </SheetContent>
          </Sheet>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image
                src={logoSrc}
                alt="Motor Khan Logo"
                width={150}
                height={150}
                className="w-16 md:w-20 h-auto"
              />
            </Link>
          </div>

          <Button variant="ghost" className="text-foreground text-sm uppercase" onClick={() => router.push("/gallery")}>
            <GalleryThumbnails className="mr-2 h-4 w-4" />
            GALLERY
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
          <motion.div initial="hidden" animate="visible" variants={listVariants} className="flex flex-col justify-center">
            <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl font-black mb-4 uppercase">
              Connect With Us
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 lowercase">
              We are here to assist with all your automotive inquiries. Whether you're looking to purchase a certified pre-owned vehicle, schedule a major repair, or simply ask for advice, our team is ready to provide expert guidance. Your journey to automotive excellence starts with a conversation, so don't hesitate to reach out. We look forward to hearing from you. Our team of dedicated professionals is committed to providing you with the highest level of service and support. We understand that every customer is unique, and we take the time to listen to your needs and concerns.
            </motion.p>
            <motion.div variants={listVariants} className="space-y-6">
              {contactDetails.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-lg"
                  >
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span
                      className={cn(
                        "group-hover:underline uppercase",
                        (item.icon === Phone || item.icon === MapPin) && "font-cairo"
                      )}
                    >
                      {item.text}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12">
              <h3 className="text-xl font-bold mb-4 uppercase">Connect</h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Button key={social.label} variant="outline" size="icon" asChild>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12"
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex justify-center lg:justify-start">
              <Link href="/#contact">
                <CircularText text="GET✧IN✧TOUCH✧" onHover="speedUp" spinDuration={20} className="text-sm text-foreground" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
