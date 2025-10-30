
"use server";

import { z } from "zod";
import { contactFormSchema, appointmentFormSchema } from "@/types";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { ContactFormEmail } from "@/components/emails/ContactFormEmail";
import { AppointmentFormEmail } from "@/components/emails/AppointmentFormEmail";
import { AppointmentSlipPdf } from "@/components/emails/AppointmentSlipPdf";
import { renderToBuffer } from '@react-pdf/renderer';

if (typeof window === 'undefined') {
  require('dotenv').config();
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = "noreply@updates.motorkhan.com";

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

  try {
    const { data, error } = await resend.emails.send({
      from: `Motor Khan <${fromEmail}>`,
      to: [email],
      subject: "Thank You for Contacting Motor Khan!",
      react: ContactFormEmail({ name, userEmail: email }),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        message: "An error occurred while sending your message. Please try again later.",
        success: false,
      };
    }

    return {
      message: "Thank you for your message! We will get back to you soon.",
      success: true,
    };
  } catch (error) {
    console.error("Resend execution error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
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
  const rawDate = formData.get('preferredDate');
  const dateToValidate = rawDate ? new Date(`${rawDate}T00:00:00`) : undefined;

  const validatedFields = appointmentFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredDate: dateToValidate,
    preferredTime: formData.get("preferredTime"),
    vehicleOfInterest: formData.get("vehicleOfInterest"),
  });
  
  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input for the appointment.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors as AppointmentFormState["errors"],
    };
  }

  const { name, email, phone, preferredDate, preferredTime, vehicleOfInterest } = validatedFields.data;
  
  try {
     // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      AppointmentSlipPdf({
        name,
        preferredDate,
        preferredTime,
        vehicleOfInterest,
      })
    );

     const { data, error } = await resend.emails.send({
      from: `Motor Khan <${fromEmail}>`,
      to: [email],
      subject: "Your Test Drive Appointment Request at Motor Khan",
      react: AppointmentFormEmail({ 
        name,
        preferredDate,
        preferredTime,
        vehicleOfInterest,
        userEmail: email 
      }),
      attachments: [
        {
          filename: 'Appointment_Slip_Motor_Khan.pdf',
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        message: "An error occurred while sending your request. Please try again later.",
        success: false,
      };
    }

    return {
      message: "Thank you for your appointment request! We will contact you shortly to confirm.",
      success: true,
    };

  } catch (error) {
    console.error("Resend execution error:", error);
     return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
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
