
"use client";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function BookAppointmentPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
      <Card ref={cardRef} className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-kajiro md:font-headline">Schedule Your Test Drive</CardTitle>
          <CardDescription className="text-md md:text-lg">
            Choose your preferred date and time. We&apos;re excited to get you behind the wheel!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
