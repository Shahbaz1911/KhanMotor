
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("h-8 w-8", className)}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.407 3.481-2.24 2.24-5.226 3.48-8.407 3.48-6.555 0-11.893-5.335-11.893-11.891 0-2.096.547-4.142 1.587-5.946L.057 0l6.163 1.687C7.864.646 9.809.1 11.95.1s4.086.546 5.787 1.587L24 .057l-1.687 6.163c1.041 1.804 1.588 3.849 1.587 5.946-.003 6.556-5.338 11.891-11.893 11.891-3.181-.001-6.167-1.24-8.407-3.481 2.24-2.24 5.226-3.48 8.407-3.48 6.555 0 11.893-5.335 11.893-11.891 0-2.096-.547-4.142-1.587-5.946L24 24l-6.163-1.687c-1.701 1.041-3.646 1.587-5.787 1.587s-4.086-.546-5.787-1.587L0 24z" />
  </svg>
);


export function WhatsAppButton() {
  // Replace with your actual phone number
  const phoneNumber = "1234567890";
  const message = "Hello! I'm interested in your vehicles.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="icon"
        className="h-16 w-16 rounded-full bg-black border-2 border-white/20 text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 hover:shadow-2xl"
      >
        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <WhatsAppIcon />
        </Link>
      </Button>
    </div>
  );
}
