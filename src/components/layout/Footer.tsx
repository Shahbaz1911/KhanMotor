
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom-=100', // Start animation when footer is 100px from bottom
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 100,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-white/10 bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-y-10 md:gap-8">
          
          <div className="md:col-span-8 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-y-10 md:gap-8 order-2 md:order-1 w-full text-left">
            {/* Contact Info */}
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <h3 className="text-lg font-bold text-white uppercase">Contact Us</h3>
              <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start justify-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
                      <a href="https://maps.google.com/?q=Shop+No+12,+Vijay+Vihar+Phase+I,+Block+B,+Near+Rice+Mill,Rithala,+Rohini,+Delhi,+110085" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors lowercase">shop no 12, vijay vihar phase i, block b, near rice mill,rithala, rohini, delhi, 110085</a>
                  </li>
                  <li className="flex items-center justify-start gap-3">
                      <Phone className="h-5 w-5 text-destructive" />
                      <a href="tel:+918595853918" className="hover:text-white transition-colors">+91 8595853918</a>
                  </li>
                   <li className="flex items-center justify-start gap-3">
                      <Phone className="h-5 w-5 text-destructive" />
                      <a href="tel:+919871358670" className="hover:text-white transition-colors">+91 9871358670</a>
                  </li>
                  <li className="flex items-center justify-start gap-3">
                      <Mail className="h-5 w-5 text-destructive" />
                      <a href="mailto:contact@khanmotor.com" className="hover:text-white transition-colors">contact@khanmotor.com</a>
                  </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="w-full lg:w-1/2 flex flex-col items-start mt-10 sm:mt-0 lg:mt-0 lg:pl-4">
              <h3 className="text-lg font-bold text-white uppercase">Connect</h3>
              <div className="mt-4 flex gap-4 justify-start">
                {socialLinks.map((social) => (
                  <Button key={social.label} variant="outline" size="icon" asChild>
                      <a
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-transparent border-gray-600 hover:border-destructive hover:bg-destructive/20"
                      >
                      <social.icon className="h-5 w-5" />
                      </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
            {/* Logo and About */}
          <div className="md:col-span-4 text-center md:text-right order-1 md:order-2 flex flex-col items-center md:items-end">
             <Link href="/#home" className="mb-4 inline-block">
              <Image
                src="https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack.png"
                alt="Arman Autoxperts Logo"
                width={150}
                height={150}
                className="w-48 h-auto"
              />
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0 lowercase">&copy; {new Date().getFullYear()} armanautoxperts. all rights reserved.</p>
          <div className="flex justify-center gap-4 text-sm order-1 sm:order-2">
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline lowercase">privacy policy</Link>
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline lowercase">terms of service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
