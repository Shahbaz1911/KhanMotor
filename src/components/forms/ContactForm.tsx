
"use client";

import { useEffect, useRef, useState } from "react";
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

export function ContactForm() {
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
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    setFormStatus("loading");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("subject", data.subject);
    formData.append("message", data.message);

    const result = await submitContactForm(initialState, formData);

    if (result.success) {
      setFormStatus("success");
      // GTM event
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'form_submit_success',
          'form_name': 'contact_form'
        });
      }
      form.reset();
      setTimeout(() => setFormStatus("idle"), 3000);
    } else {
      setFormStatus("idle");
      toast({
        title: "Error",
        description: result.message || "Failed to send message.",
        variant: "destructive",
      });

      if (result.errors) {
        type FormSchema = z.infer<typeof contactFormSchema>;
        for (const key in result.errors) {
          if (Object.prototype.hasOwnProperty.call(result.errors, key)) {
            const formKey = key as keyof FormSchema;
            const errorMessages = (result.errors as any)[formKey];
            if (errorMessages && errorMessages.length > 0) {
              form.setError(formKey, { type: "server", message: errorMessages.join(", ") });
            }
          }
        }
      }
    }
  };

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
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase">Subject *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Car repairing and servicing">Car repairing and servicing</SelectItem>
                      <SelectItem value="Denting, painting, detailing">Denting, painting, detailing</SelectItem>
                      <SelectItem value="Buy/Sell related">Buy/Sell related</SelectItem>
                      <SelectItem value="Car maintenance">Car maintenance</SelectItem>
                      <SelectItem value="General inquiry">General inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
