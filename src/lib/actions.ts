
"use server";

import { z } from "zod";
import { contactFormSchema, appointmentFormSchema } from "@/types";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { ContactFormEmail } from "@/components/emails/ContactFormEmail";
import { AppointmentFormEmail } from "@/components/emails/AppointmentFormEmail";
import { format } from 'date-fns';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';

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

async function generatePdfBuffer(data: z.infer<typeof appointmentFormSchema>): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const logoUrl = "https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack.png";
    const logoImageResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const logoImageBytes = logoImageResponse.data;
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.25);

    // Header
    page.drawImage(logoImage, {
        x: 50,
        y: height - 50 - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
    });

    page.drawText('Motor Khan', { x: width - 150, y: height - 60, font, size: 10, color: rgb(0.29, 0.33, 0.39) });
    page.drawText('Rithala, Rohini, Delhi', { x: width - 150, y: height - 75, font, size: 10, color: rgb(0.29, 0.33, 0.39) });
    page.drawText('+91 8595853918', { x: width - 150, y: height - 90, font, size: 10, color: rgb(0.29, 0.33, 0.39) });
    page.drawLine({
        start: { x: 50, y: height - 110 },
        end: { x: width - 50, y: height - 110 },
        thickness: 1,
        color: rgb(0.76, 0.07, 0.15),
    });

    // Title
    page.drawText('Test Drive Appointment Slip', { x: 50, y: height - 160, font: boldFont, size: 24, color: rgb(0.12, 0.16, 0.22), xJustification: 'center', yJustification: 'center' });
    page.drawText('Please bring this slip (digital or printed) with you to your appointment.', { x: width / 2, y: height - 185, font, size: 10, color: rgb(0.42, 0.45, 0.51), xJustification: 'center' });

    // Details Section
    page.drawRectangle({
        x: 50,
        y: height - 350,
        width: width - 100,
        height: 120,
        color: rgb(0.98, 0.98, 0.98),
        borderColor: rgb(0.9, 0.91, 0.92),
        borderWidth: 1,
    });
    page.drawText('Appointment Details', { x: 70, y: height - 250, font: boldFont, size: 14, color: rgb(0.76, 0.07, 0.15) });

    const formatTime = (time: string) => {
        if (!time || !time.includes(':')) return 'Not specified';
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const detailRow = (y: number, label: string, value: string) => {
        page.drawText(label, { x: 70, y, font, size: 11, color: rgb(0.29, 0.33, 0.39) });
        page.drawText(value, { x: 180, y, font: boldFont, size: 11, color: rgb(0.12, 0.16, 0.22) });
    };

    detailRow(height - 280, 'Client Name:', data.name);
    detailRow(height - 300, 'Appointment Date:', format(data.preferredDate, 'EEEE, MMMM d, yyyy'));
    detailRow(height - 320, 'Appointment Time:', formatTime(data.preferredTime));
    if (data.vehicleOfInterest) {
        detailRow(height - 340, 'Vehicle of Interest:', data.vehicleOfInterest);
    }
    
    // QR Code
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://motorkhan.com/book-appointment";
    const qrImageResponse = await axios.get(qrUrl, { responseType: 'arraybuffer' });
    const qrImageBytes = qrImageResponse.data;
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrImage, { x: (width / 2) - 50, y: 150, width: 100, height: 100 });
    page.drawText('Scan to manage your appointment', { x: width / 2, y: 135, font, size: 9, color: rgb(0.42, 0.45, 0.51), xJustification: 'center' });

    // Footer
    page.drawText('This is an automated confirmation slip. Our team will contact you to confirm your appointment.', { x: width / 2, y: 50, font, size: 9, color: rgb(0.6, 0.64, 0.68), xJustification: 'center' });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

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
     const pdfBuffer = await generatePdfBuffer(validatedFields.data);

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
    console.error("PDF or Resend execution error:", error);
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

    