
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
        <div className="flex flex-wrap justify-between gap-8">
          
          {/* Contact Info */}
          <div className="w-full sm:w-auto">
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
          <div className="w-full sm:w-auto">
            <h3 className="text-lg font-bold text-white">Follow Us</h3>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-300 hover:text-white"
                  >
                    <social.icon className="h-5 w-5 transition-colors duration-300 group-hover:text-destructive" />
                    <span>{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
           <div className="mb-4 flex justify-center">
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
          <p className="text-sm text-gray-400 text-center">&copy; {new Date().getFullYear()} Arman Autoxperts. All Rights Reserved.</p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 transition-colors duration-300 hover:text-white hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
