import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-white/10 bg-black/30 text-white backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Link href="/#home" className="w-full">
            <span className="text-3xl font-black text-white transition-colors hover:text-primary">
              Khan Motor
            </span>
          </Link>

          <div className="flex space-x-2">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full text-white/80 hover:bg-white/10 hover:text-white"
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
    </footer>
  );
}
