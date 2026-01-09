
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { contactFormSchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { StatefulButton } from "@/components/ui/stateful-button";


const initialState: ContactFormState = {
  message: "",
  success: false,
};

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if(cardRef.current) {
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 100,
            duration: 0.8,
            ease: "power3.out",
        });
      }
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleFormAction = (payload: FormData) => {
    setFormStatus("loading");
    formAction(payload);
  };
  
  useEffect(() => {
    if (state.message) {
      setFormStatus("idle"); // Reset loading state
      if (state.success) {
        setFormStatus("success");
        // Track GTM event on success
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'form_submit_success',
            'form_name': 'contact_form'
          });
        }
        form.reset(); 
        if (formRef.current) {
           formRef.current.reset(); 
        }
        setTimeout(() => setFormStatus("idle"), 3000);
      } else {
        toast({
          title: "Error",
          description: state.message || "Failed to send message.",
          variant: "destructive",
        });
        
        if (state.errors) {
          if (state.errors.name) form.setError("name", { type: "server", message: state.errors.name.join(", ") });
          if (state.errors.email) form.setError("email", { type: "server", message: state.errors.email.join(", ") });
          if (state.errors.phone) form.setError("phone", { type: "server", message: state.errors.phone.join(", ") });
          if (state.errors.message) form.setError("message", { type: "server", message: state.errors.message.join(", ") });
        }
      }
    }
  }, [state, toast, form]);

  return (
    <Card ref={cardRef} className="w-full max-w-2xl mx-auto shadow-xl bg-card/50 dark:bg-background/50 backdrop-blur-md border-border">
      <CardHeader>
        <CardTitle className="text-3xl uppercase">Get in Touch</CardTitle>
        <CardDescription className="uppercase">
          have questions or need assistance? fill out the form below, and we&apos;ll get back to you shortly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} action={handleFormAction} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase">Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <StatefulButton 
              type="submit"
              status={formStatus}
              className="w-full md:w-auto"
            >
              Send Message
            </StatefulButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
