
"use server";

import { z } from "zod";
import { contactFormSchema, appointmentFormSchema } from "@/types";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { ContactFormEmail } from "@/components/emails/ContactFormEmail";
import { AppointmentFormEmail } from "@/components/emails/AppointmentFormEmail";
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
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
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  
  const logoUrl = "https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack.png";
  const logoImageResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
  const logoImageBuffer = Buffer.from(logoImageResponse.data, 'binary');

  // Header
  doc.image(logoImageBuffer, 40, 40, { width: 120 });
  doc.fontSize(10).fillColor('#4B5563').text('Motor Khan', { align: 'right' });
  doc.text('Rithala, Rohini, Delhi', { align: 'right' });
  doc.text('+91 8595853918', { align: 'right' });
  doc.moveTo(40, 100).lineTo(555, 100).strokeColor('#C31327').stroke();

  // Title
  doc.fontSize(28).fillColor('#1F2937').text('Test Drive Appointment Slip', { align: 'center', upper: true }).moveDown(0.5);
  doc.fontSize(12).fillColor('#4B5563').text("Please bring this slip (digital or printed) with you to your appointment.", { align: 'center' }).moveDown(2);

  // Details Section
  doc.rect(40, 220, 515, 120).fillAndStroke('#F9FAFB', '#E5E7EB');
  doc.fillColor('#C31327').fontSize(16).text('Appointment Details', 60, 240, { upper: true });

  const detailRow = (y: number, label: string, value: string) => {
    doc.fillColor('#4B5563').fontSize(11).text(label, 70, y, { continued: true }).font('Helvetica-Bold').text(value);
  }
  
  const formatTime = (time: string) => {
    if (!time || !time.includes(':')) return 'Not specified';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  detailRow(270, 'Client Name: ', data.name);
  detailRow(290, 'Appointment Date: ', format(data.preferredDate, 'EEEE, MMMM d, yyyy'));
  detailRow(310, 'Appointment Time: ', formatTime(data.preferredTime));
  if (data.vehicleOfInterest) {
    detailRow(330, 'Vehicle of Interest: ', data.vehicleOfInterest);
  }

  // QR Code Section
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://motorkhan.com/book-appointment";
  const qrImageResponse = await axios.get(qrUrl, { responseType: 'arraybuffer' });
  const qrImageBuffer = Buffer.from(qrImageResponse.data, 'binary');
  doc.image(qrImageBuffer, 247.5, 400, { width: 100 });
  doc.fontSize(10).fillColor('#6B7280').text('Scan to manage your appointment', { align: 'center' });

  // Footer
  doc.fontSize(9).fillColor('#9CA3AF').text('This is an automated confirmation slip. Our team will contact you to confirm your appointment.', 40, 780, { align: 'center' });
  
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    doc.end();
  });
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
