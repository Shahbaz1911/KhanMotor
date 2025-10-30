
"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { StatefulButton } from "@/components/ui/stateful-button";
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
import { submitAppointmentForm } from "@/lib/actions";
import { appointmentFormSchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 20; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
        if (i < 20) {
            slots.push(`${i.toString().padStart(2, '0')}:30`);
        }
    }
    return slots;
};

const formatTimeForDisplay = (time: string) => {
    if (!time || !time.includes(':')) return 'Select a time';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${ampm}`;
};

export function AppointmentForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const timeSlots = generateTimeSlots();
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  
  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: new Date(),
      preferredTime: "09:30",
      vehicleOfInterest: "",
    },
  });

  const watchedDate = useWatch({ control: form.control, name: 'preferredDate' });

  const handleFormSubmit = async (values: z.infer<typeof appointmentFormSchema>) => {
    setFormStatus("loading");

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (key === 'preferredDate' && value instanceof Date) {
          formData.append(key, format(value, 'yyyy-MM-dd'));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const result = await submitAppointmentForm(undefined as any, formData);

    if (result.success) {
      setFormStatus("success");
      setTimeout(() => {
        form.reset();
        setFormStatus("idle");
      }, 2500);
    } else {
      setFormStatus("idle");
      toast({
        title: "Error",
        description: result.message || "Failed to submit appointment request.",
        variant: "destructive",
      });
       if (result.errors) {
          type FormSchema = z.infer<typeof appointmentFormSchema>;
          for (const key in result.errors) {
            if (Object.prototype.hasOwnProperty.call(result.errors, key)) {
                const formKey = key as keyof FormSchema;
                const errorMessages = result.errors[formKey];
                if (errorMessages && errorMessages.length > 0) {
                    form.setError(formKey, { type: "server", message: errorMessages.join(", ") });
                }
            }
          }
        }
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleFormSubmit)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          "w-full pl-3 text-left font-normal font-cairo",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MM/dd/yyyy")
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
                      onSelect={(date) => {
                        if(date) field.onChange(date)
                      }}
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
                <FormLabel>Preferred Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="font-cairo">
                            <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                         {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot} className="font-cairo">
                                {formatTimeForDisplay(slot)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <StatefulButton type="submit" status={formStatus}>
          Request Appointment
        </StatefulButton>
      </form>
    </Form>
  );
}
