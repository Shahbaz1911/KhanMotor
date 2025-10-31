
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useRef, useEffect } from "react";
import { Wrench, Paintbrush, Repeat, ShieldCheck, MessageCircle, X } from "lucide-react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";

const WhatsAppIcon = ({ className, ...props }: { className?: string, [key: string]: any }) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      fill="currentColor"
      {...props}
    >
      <title>WhatsApp</title>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const services = [
  { icon: Wrench, text: "Car Repair & Servicing" },
  { icon: Paintbrush, text: "Denting, Painting & Detailing" },
  { icon: Repeat, text: "Buy & Sell Used Cars" },
  { icon: ShieldCheck, text: "Car Maintenance" },
];

export function WhatsAppButton() {
  const { theme } = useTheme();
  const phoneNumber = "918595853918";
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const tl = useRef<gsap.core.Timeline | null>(null);
  const whatsappIconRef = useRef(null);
  const closeIconRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    gsap.set(closeIconRef.current, { rotation: 180, opacity: 0, scale: 0.5 });
    tl.current = gsap.timeline({ paused: true, reversed: true });

    if (whatsappIconRef.current && closeIconRef.current) {
      tl.current
        .to(whatsappIconRef.current, { rotation: -180, opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" })
        .to(closeIconRef.current, { rotation: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "-=0.2");
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isOpen, mounted]);

  const handleServiceClick = (serviceText: string) => {
    const message = `Hello! I'm interested in your ${serviceText}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };
  
  const handleGeneralInquiry = () => {
    const message = "Hello! I have a general inquiry.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }

  if (!mounted) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
             theme === 'dark'
              ? "bg-white text-black hover:bg-neutral-200"
              : "bg-black text-white hover:bg-neutral-800"
          )}
          aria-label="Chat on WhatsApp"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div ref={whatsappIconRef} className="absolute">
              <WhatsAppIcon />
            </div>
            <div ref={closeIconRef} className="absolute">
                <X className="h-6 w-6" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-4 mb-2" align="end" side="top">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Inquire on WhatsApp</h4>
            <p className="text-sm text-muted-foreground">
              What service are you interested in?
            </p>
          </div>
          <div className="grid gap-2">
            {services.map((service) => (
              <Button
                key={service.text}
                variant="outline"
                className="justify-start"
                onClick={() => handleServiceClick(service.text)}
              >
                <service.icon className="mr-2 h-4 w-4" />
                {service.text}
              </Button>
            ))}
             <Button
                variant="outline"
                className="justify-start"
                onClick={handleGeneralInquiry}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                General Inquiry
              </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
