
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="border-t border-white/10 bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo and About */}
          <div className="lg:col-span-2">
             <Link href="/#home" className="mb-4 inline-block">
              <Image
                src="https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png"
                alt="Arman Autoxperts Logo"
                width={150}
                height={150}
                className="w-48 h-auto"
              />
            </Link>
            <p className="text-sm max-w-md text-gray-400">
              Your premier destination for luxury and performance vehicles. We offer sales, service, and a bespoke customer experience.
            </p>
          </div>

          {/* Contact Info */}
          <div className="w-full sm:w-auto">
             <h3 className="text-lg font-bold text-white">Contact Us</h3>
             <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">123 Luxury Drive, Prestige City, 12345</a>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-destructive" />
                    <a href="tel:1234567890" className="hover:text-white transition-colors">(123) 456-7890</a>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-destructive" />
                    <a href="mailto:contact@khanmotor.com" className="hover:text-white transition-colors">contact@khanmotor.com</a>
                </li>
             </ul>
          </div>

          {/* Social Media */}
          <div className="w-full sm:w-auto">
            <h3 className="text-lg font-bold text-white">Follow Us</h3>
            <div className="mt-4 flex gap-4">
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

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} ArmanAutoXperts. All Rights Reserved.</p>
          <div className="flex justify-center gap-4 text-sm order-1 sm:order-2">
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
