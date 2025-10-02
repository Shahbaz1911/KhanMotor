
"use server";

import { z } from "zod";
import { contactFormSchema, appointmentFormSchema } from "@/types";
import { v2 as cloudinary } from "cloudinary";

export type ContactFormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
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
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, message } = validatedFields.data;

  console.log("Contact Form Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Phone:", phone);
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

export async function uploadToCloudinary(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary environment variables are not configured.");
      return { success: false, error: 'Server configuration error: Image hosting is not set up.' };
  }

  // Configure Cloudinary inside the function to ensure env vars are loaded.
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  try {
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'arman-autoxperts',
      resource_type: 'image',
    });

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
    return { success: false, error: errorMessage };
  }
}
