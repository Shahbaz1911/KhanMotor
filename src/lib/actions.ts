
"use server";

import { z } from "zod";
import { contactFormSchema, appointmentFormSchema } from "@/types";

export type ContactFormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;

  console.log("Contact Form Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "Thank you for your message! We will get back to you soon.",
    success: true,
  };
}

export type AppointmentFormState = {
  message: string;
  success: boolean;
  errors?: z.infer<typeof appointmentFormSchema> extends Record<string, any> ? 
    { [K in keyof z.infer<typeof appointmentFormSchema>]?: string[] } : 
    Record<string, string[]>;
};

export async function submitAppointmentForm(
  prevState: AppointmentFormState,
  formData: FormData
): Promise<AppointmentFormState> {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredDate: formData.get("preferredDate") ? new Date(formData.get("preferredDate") as string) : undefined,
    preferredTime: formData.get("preferredTime"),
    vehicleOfInterest: formData.get("vehicleOfInterest"),
  };
  
  const validatedFields = appointmentFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input for the appointment.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors as AppointmentFormState["errors"],
    };
  }

  const { name, email, phone, preferredDate, preferredTime, vehicleOfInterest } = validatedFields.data;

  console.log("Appointment Form Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("Preferred Date:", preferredDate.toISOString().split('T')[0]);
  console.log("Preferred Time:", preferredTime);
  console.log("Vehicle of Interest:", vehicleOfInterest);

  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "Thank you for your appointment request! We will contact you shortly to confirm.",
    success: true,
  };
}
