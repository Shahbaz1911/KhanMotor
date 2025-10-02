
"use client";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
];

const contactDetails = [
    { icon: MapPin, text: '123 Luxury Drive, Prestige City, 12345', href: 'https://maps.google.com' },
    { icon: Phone, text: '(123) 456-7890', href: 'tel:1234567890' },
    { icon: Mail, text: 'contact@khanmotor.com', href: 'mailto:contact@khanmotor.com' },
]

export default function ContactPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col justify-center"
        >
          <h1 className="text-4xl lg:text-5xl font-black mb-4">Connect With Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            We&apos;re here to help with all your automotive needs. Reach out today and let us know how we can assist you.
          </p>
          <div className="space-y-6">
              {contactDetails.map((item, index) => (
                  <Link key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-lg">
                      <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                         <item.icon className="h-6 w-6" />
                      </div>
                      <span className="group-hover:underline">{item.text}</span>
                  </Link>
              ))}
          </div>

           <Button onClick={() => router.push('/#contact')} size="lg" className="group mt-8">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Follow Our Journey</h3>
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
          </div>
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
  );
}
