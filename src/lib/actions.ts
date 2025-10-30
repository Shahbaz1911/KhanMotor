
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
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // --- Header ---
    const logoUrl = "https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack.png";
    const logoImageBytes = await axios.get(logoUrl, { responseType: 'arraybuffer' }).then(res => res.data);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.35);
    
    page.drawImage(logoImage, {
        x: (width / 2) - (logoDims.width / 2),
        y: height - 100,
        width: logoDims.width,
        height: logoDims.height,
    });
    
    const title = 'Test Drive Appointment';
    const titleWidth = helveticaBoldFont.widthOfTextAtSize(title, 20);
    page.drawText(title, {
        x: (width / 2) - (titleWidth / 2),
        y: height - 130,
        font: helveticaBoldFont,
        size: 20,
        color: rgb(0, 0, 0),
    });

    // --- Appointment Details Section ---
    const contentYStart = height - 180;
    const boxPadding = 40;
    const boxX = boxPadding;
    const boxWidth = width - (boxPadding * 2);

    const drawDetailRow = (y: number, label: string, value: string) => {
        const labelWidth = helveticaFont.widthOfTextAtSize(label, 12);
        page.drawText(label, { x: boxX + 20, y, font: helveticaFont, size: 12, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(value, { x: boxX + 150, y, font: helveticaBoldFont, size: 12, color: rgb(0, 0, 0) });
    };

    const formatTime = (time: string) => {
        if (!time || !time.includes(':')) return 'Not specified';
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    let currentY = contentYStart;
    drawDetailRow(currentY, 'Client Name:', data.name);
    currentY -= 40;
    drawDetailRow(currentY, 'Appointment Date:', format(data.preferredDate, 'EEEE, MMMM d, yyyy'));
    currentY -= 40;
    drawDetailRow(currentY, 'Appointment Time:', formatTime(data.preferredTime));
    if (data.vehicleOfInterest) {
        currentY -= 40;
        drawDetailRow(currentY, 'Vehicle of Interest:', data.vehicleOfInterest);
    }

    // --- Footer ---
    const footerY = 80;
    page.drawLine({
        start: { x: boxPadding, y: footerY + 30 },
        end: { x: width - boxPadding, y: footerY + 30 },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
    });

    const footerTextSize = 8;
    const footerLineHeight = 12;
    const leftX = boxPadding;
    const rightX = width - boxPadding;
    
    // Left: Contact Details
    let footerCurrentY = footerY;
    page.drawText('+91 8595853918', { x: leftX, y: footerCurrentY, font: helveticaFont, size: footerTextSize, color: rgb(0.3, 0.3, 0.3) });
    footerCurrentY -= footerLineHeight;
    page.drawText('contact@khanmotor.com', { x: leftX, y: footerCurrentY, font: helveticaFont, size: footerTextSize, color: rgb(0.3, 0.3, 0.3) });
    // Add social icons if you have them as images

    // Center: Website
    const website = 'www.motorkhan.com';
    const websiteWidth = helveticaBoldFont.widthOfTextAtSize(website, 10);
    page.drawText(website, {
        x: (width / 2) - (websiteWidth / 2),
        y: footerY - (footerLineHeight / 2),
        font: helveticaBoldFont,
        size: 10,
        color: rgb(0.76, 0.07, 0.15),
    });

    // Right: Address
    const addressLine1 = 'Shop No 12, Vijay Vihar Phase I, Block B';
    const addressLine2 = 'Rithala, Rohini, Delhi, 110085';
    const address1Width = helveticaFont.widthOfTextAtSize(addressLine1, footerTextSize);
    const address2Width = helveticaFont.widthOfTextAtSize(addressLine2, footerTextSize);
    
    footerCurrentY = footerY;
    page.drawText(addressLine1, { x: rightX - address1Width, y: footerCurrentY, font: helveticaFont, size: footerTextSize, color: rgb(0.3, 0.3, 0.3) });
    footerCurrentY -= footerLineHeight;
    page.drawText(addressLine2, { x: rightX - address2Width, y: footerCurrentY, font: helveticaFont, size: footerTextSize, color: rgb(0.3, 0.3, 0.3) });

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
