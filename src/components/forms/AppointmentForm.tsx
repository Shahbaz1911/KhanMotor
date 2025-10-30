
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { CalendarIcon, Loader2, Send, Check } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitAppointmentForm, type AppointmentFormState } from "@/lib/actions";
import { appointmentFormSchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

const initialState: AppointmentFormState = {
  message: "",
  success: false,
};

function SubmitButton({ isSuccess }: { isSuccess: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || isSuccess}
      className={cn("w-full md:w-auto", isSuccess && "bg-green-500 hover:bg-green-600")}
    >
      {isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Success!
        </>
      ) : pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Requesting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Request Appointment
        </>
      )}
    </Button>
  );
}

export function AppointmentForm() {
  const [state, formAction] = useActionState(submitAppointmentForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: new Date(),
      preferredTime: "",
      vehicleOfInterest: "",
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
          variant: "success",
        });
        form.reset();
        formRef.current?.reset();
      } else {
        toast({
          title: "Error",
          description: state.message || "Failed to submit appointment request.",
          variant: "destructive",
        });
        if (state.errors) {
          if (state.errors.name) form.setError("name", { type: "server", message: state.errors.name.join(", ") });
          if (state.errors.email) form.setError("email", { type: "server", message: state.errors.email.join(", ") });
          if (state.errors.phone) form.setError("phone", { type: "server", message: state.errors.phone.join(", ") });
          if (state.errors.preferredDate) form.setError("preferredDate", { type: "server", message: state.errors.preferredDate.join(", ") });
          if (state.errors.preferredTime) form.setError("preferredTime", { type: "server", message: state.errors.preferredTime.join(", ") });
          if (state.errors.vehicleOfInterest) form.setError("vehicleOfInterest", { type: "server", message: state.errors.vehicleOfInterest.join(", ") });
        }
      }
    }
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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
              <FormLabel>Email Address</FormLabel>
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Preferred Date</FormLabel>
               <FormControl>
                 <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(new Date(e.target.value))}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleOfInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle of Interest (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Audi R8 Spyder, BMW M4, etc."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="lowercase">
                let us know if you have a specific vehicle in mind for your test drive.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isSuccess={state.success} />
      </form>
    </Form>
  );
}
