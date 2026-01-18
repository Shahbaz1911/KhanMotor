
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatefulButton } from "@/components/ui/stateful-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const initialState: ContactFormState = {
  message: "",
  success: false,
};

const countries = [
    { code: "+91", name: "India" },
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+971", name: "UAE" },
    { code: "+61", name: "Australia" },
    { code: "+65", name: "Singapore" },
];

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
      countryCode: "+91",
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
            type FormSchema = z.infer<typeof contactFormSchema>;
            for (const key in state.errors) {
                if (Object.prototype.hasOwnProperty.call(state.errors, key)) {
                    const formKey = key as keyof FormSchema;
                    const errorMessages = (state.errors as any)[formKey];
                    if (errorMessages && errorMessages.length > 0) {
                        form.setError(formKey, { type: "server", message: errorMessages.join(", ") });
                    }
                }
            }
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
                  <FormLabel className="uppercase">Full Name *</FormLabel>
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
                  <FormLabel className="uppercase">Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
                <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase">Country Code *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Code" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase">Phone Number *</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase">Your Message *</FormLabel>
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
