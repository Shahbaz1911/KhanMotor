
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Facebook, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { href: '/#home', label: 'Home' },
    { href: '/#about-us', label: 'About Us' },
    { href: '/vehicles', label: 'Vehicles' },
    { href: '/#testimonials', label: 'Testimonials' },
    { href: '/book-appointment', label: 'Book a Drive' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-white/10 bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-300 hover:text-white hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
             <h3 className="text-lg font-bold text-white">Contact Us</h3>
             <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                    <span>123 Luxury Drive, Prestige City, 12345</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    <span>(123) 456-7890</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <span>contact@khanmotor.com</span>
                </li>
             </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-white">Follow Us</h3>
            <p className="mt-4 text-sm text-gray-400">Stay connected for the latest arrivals and news.</p>
            <div className="mt-4 flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-full bg-white/10 text-white/80 transition-all duration-300 hover:bg-white/20 hover:text-white hover:-translate-y-1 hover:scale-110"
                >
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
           <div className="mb-8 flex justify-center">
            <Link href="/#home">
              <Image
                src="https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png"
                alt="Arman Autoxperts Logo"
                width={150}
                height={150}
                className="w-96 h-auto"
              />
            </Link>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Arman Autoxperts. All Rights Reserved.</p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
