
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Loader2, Send, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredTime: "09:00-12:00",
      vehicleOfInterest: "",
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setIsSuccess(true);
        form.reset();
        formRef.current?.reset();
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        toast({
          title: "Error",
          description: state.message || "Failed to submit appointment request.",
          variant: "destructive",
        });
        if (state.errors) {
          type FormSchema = z.infer<typeof appointmentFormSchema>;
          for (const key in state.errors) {
            if (Object.prototype.hasOwnProperty.call(state.errors, key)) {
                const formKey = key as keyof FormSchema;
                const errorMessages = state.errors[formKey];
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time Slot</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="09:00-12:00">Morning (9am - 12pm)</SelectItem>
                  <SelectItem value="12:00-15:00">Afternoon (12pm - 3pm)</SelectItem>
                  <SelectItem value="15:00-18:00">Late Afternoon (3pm - 6pm)</SelectItem>
                </SelectContent>
              </Select>
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
              <FormDescription>
                let us know if you have a specific vehicle in mind for your test drive.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isSuccess={isSuccess} />
      </form>
    </Form>
  );
}
