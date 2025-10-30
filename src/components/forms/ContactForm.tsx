
"use client";

import { useActionState, useEffect, useRef, useState } from "react"; // Changed from react-dom to react and useFormState to useActionState
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { contactFormSchema } from "@/types";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Check } from "lucide-react";
import { useFormStatus } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";


const initialState: ContactFormState = {
  message: "",
  success: false,
};

function SubmitButton({ isSuccess }: { isSuccess: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending || isSuccess}
      className={cn(
        "w-full md:w-auto bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive uppercase",
        isSuccess && "bg-green-500 hover:bg-green-600 border-green-600 text-white"
      )}
    >
      {isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Success!
        </>
      ) : pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </>
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState); // Changed from useFormState
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setIsSuccess(true);
        form.reset(); 
        if (formRef.current) {
           formRef.current.reset(); 
        }
        setTimeout(() => setIsSuccess(false), 3000);
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
          <form ref={formRef} action={formAction} className="space-y-6">
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
            <SubmitButton isSuccess={isSuccess} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
