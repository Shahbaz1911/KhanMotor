
"use server";

import { z } from "zod";
import { contactFormSchema, appointmentFormSchema } from "@/types";
import { format } from 'date-fns';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ImageKit from "imagekit";
import { transporter, mailOptions } from "@/lib/mail";

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
  
  if (!process.env.ZOHO_APP_PASSWORD) {
    console.error("Zoho App Password is not set. Cannot send email.");
    return {
      message: "Server configuration error: Email service is not available.",
      success: false,
    };
  }

  const { name, email, phone, message } = validatedFields.data;
  
  try {
    // Send confirmation to the user
    await transporter.sendMail({
      ...mailOptions,
      to: email, // Override 'to' for the user
      subject: "Thank You for Contacting Motor Khan!",
      html: `<h1>Thank You for Contacting Us, ${name}!</h1><p>We have successfully received your message. Our team is reviewing your inquiry and will get back to you at ${email} as soon as possible.</p>`,
    });

    // Send notification to the owner
    await transporter.sendMail({
        ...mailOptions,
        subject: `New Inquiry from ${name}`,
        html: `<p>You have a new contact form submission from:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
    });

    return {
      message: "Thank you for your message! We will get back to you soon.",
      success: true,
    };
  } catch (error) {
    console.error("Nodemailer execution error:", error);
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
    const redColor = rgb(0.76, 0.07, 0.15);
    const whiteColor = rgb(1, 1, 1);
    const blackColor = rgb(0, 0, 0);
    const grayColor = rgb(0.3, 0.3, 0.3);

    page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: whiteColor,
    });

    const logoUrl = "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png";
    try {
        const logoImageResponse = await fetch(logoUrl);
        if (logoImageResponse.ok) {
            const logoImageBytes = await logoImageResponse.arrayBuffer();
            const logoImage = await pdfDoc.embedPng(logoImageBytes);
            const logoDims = logoImage.scale(0.25);
            page.drawImage(logoImage, {
                x: (width / 2) - (logoDims.width / 2),
                y: height - 100,
                width: logoDims.width,
                height: logoDims.height,
            });
        } else {
            console.warn(`Failed to fetch logo for PDF: ${logoImageResponse.statusText}`);
        }
    } catch (e) {
        console.error("Error fetching or embedding logo for PDF:", e);
    }
    
    const title = 'Test Drive Appointment';
    const titleWidth = helveticaBoldFont.widthOfTextAtSize(title, 20);
    page.drawText(title, {
        x: (width / 2) - (titleWidth / 2),
        y: height - 130,
        font: helveticaBoldFont,
        size: 20,
        color: blackColor,
    });
    
    page.drawLine({
        start: { x: 50, y: height - 150 },
        end: { x: width - 50, y: height - 150 },
        thickness: 1.5,
        color: redColor,
    });

    const contentYStart = height - 200;
    
    page.drawRectangle({
        x: 50,
        y: contentYStart - 170,
        width: width - 100,
        height: 200,
        color: rgb(0.98, 0.98, 0.98),
        borderColor: rgb(0.9, 0.9, 0.9),
        borderWidth: 1,
    });


    const drawDetailRow = (y: number, label: string, value: string) => {
        page.drawText(label, { x: 70, y, font: helveticaBoldFont, size: 12, color: grayColor });
        page.drawText(value, { x: 220, y, font: helveticaFont, size: 12, color: blackColor });
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
    drawDetailRow(currentY, 'Client Phone:', data.phone);
    currentY -= 40;
    drawDetailRow(currentY, 'Appointment Date:', format(data.preferredDate, 'EEEE, MMMM d, yyyy'));
    currentY -= 40;
    drawDetailRow(currentY, 'Appointment Time:', formatTime(data.preferredTime));
    if (data.vehicleOfInterest) {
        currentY -= 40;
        drawDetailRow(currentY, 'Vehicle of Interest:', data.vehicleOfInterest);
    }

    const footerHeight = 120;
    page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: footerHeight,
        color: blackColor,
    });

    const footerTextSize = 8;
    const footerLineHeight = 14;
    const footerStartY = footerHeight - 30;
    const leftX = 50;
    const rightX = width - 50;

    let leftY = footerStartY;
    page.drawText('Phone Number', { x: leftX, y: leftY, font: helveticaBoldFont, size: footerTextSize, color: whiteColor });
    leftY -= footerLineHeight;
    page.drawText('+91 8595853918 / +91 9871358670', { x: leftX, y: leftY, font: helveticaFont, size: footerTextSize, color: whiteColor });
    leftY -= (footerLineHeight * 1.5);
    page.drawText('Email', { x: leftX, y: leftY, font: helveticaBoldFont, size: footerTextSize, color: whiteColor });
    leftY -= footerLineHeight;
    page.drawText('contact@motorkhan.com', { x: leftX, y: leftY, font: helveticaFont, size: footerTextSize, color: whiteColor });
    leftY -= (footerLineHeight * 1.5);
    page.drawText('Socials', { x: leftX, y: leftY, font: helveticaBoldFont, size: footerTextSize, color: whiteColor });
    leftY -= footerLineHeight;
    page.drawText('Facebook / Instagram', { x: leftX, y: leftY, font: helveticaFont, size: footerTextSize, color: whiteColor });
    
    const website = 'www.motorkhan.com';
    const websiteWidth = helveticaBoldFont.widthOfTextAtSize(website, 10);
    page.drawText(website, {
        x: (width / 2) - (websiteWidth / 2),
        y: footerHeight / 2,
        font: helveticaBoldFont,
        size: 10,
        color: redColor,
    });

    let rightY = footerStartY;
    page.drawText('Address', { x: rightX - helveticaBoldFont.widthOfTextAtSize('Address', footerTextSize), y: rightY, font: helveticaBoldFont, size: footerTextSize, color: whiteColor });
    rightY -= footerLineHeight;
    const addressLine1 = 'Shop No. 12, Near Rice Mill, Vijay Vihar Phase I, Block B';
    const addressLine2 = 'Rithala, Rohini, Delhi 110085, India';
    page.drawText(addressLine1, { x: rightX - helveticaFont.widthOfTextAtSize(addressLine1, footerTextSize), y: rightY, font: helveticaFont, size: footerTextSize, color: whiteColor });
    rightY -= footerLineHeight;
    page.drawText(addressLine2, { x: rightX - helveticaFont.widthOfTextAtSize(addressLine2, footerTextSize), y: rightY, font: helveticaFont, size: footerTextSize, color: whiteColor });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

export async function submitAppointmentForm(
  prevState: AppointmentFormState,
  formData: FormData
): Promise<AppointmentFormState> {
  const rawDate = formData.get('preferredDate');
  const dateToValidate = typeof rawDate === 'string' ? new Date(`${rawDate}T00:00:00`) : undefined;

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

  if (!process.env.ZOHO_APP_PASSWORD) {
    console.error("Zoho App Password is not set. Cannot send email.");
    return {
      message: "Server configuration error: Email service is not available.",
      success: false,
    };
  }

  const { name, email, phone, preferredDate, preferredTime, vehicleOfInterest } = validatedFields.data;
  
  try {
     const pdfBuffer = await generatePdfBuffer(validatedFields.data);

    // Send confirmation email to client with PDF
    await transporter.sendMail({
        ...mailOptions,
        to: email,
        subject: `Your Test Drive Appointment at Motor Khan`,
        html: `<h1>Thanks for Your Interest, ${name}!</h1><p>We've received your request for a test drive appointment. We're excited to get you behind the wheel! Our team will contact you shortly at ${email} to confirm your appointment details.</p>
                <h3>Your Request Summary</h3>
                <p><strong>Date:</strong> ${format(preferredDate, 'PPP')}</p>
                <p><strong>Time:</strong> ${preferredTime}</p>
                ${vehicleOfInterest ? `<p><strong>Vehicle of Interest:</strong> ${vehicleOfInterest}</p>` : ''}`,
        attachments: [
            {
              filename: 'Appointment_Slip_Motor_Khan.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
        ],
    });

    // Send text-based notification to owner
    await transporter.sendMail({
        ...mailOptions,
        subject: `New Test Drive Request from ${name}`,
        html: `<p>You have a new test drive request:</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Preferred Date:</strong> ${format(preferredDate, 'PPP')}</p>
                <p><strong>Preferred Time:</strong> ${preferredTime}</p>
                <p><strong>Vehicle:</strong> ${vehicleOfInterest || 'Not specified'}</p>`,
    });

    return {
      message: "Thank you for your appointment request! We will contact you shortly to confirm.",
      success: true,
    };

  } catch (error) {
    console.error("PDF or Nodemailer execution error:", error);
     return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

export async function getIKAuth() {
  if (
    !process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    console.error("ImageKit server credentials are not configured.");
    return { success: false, error: "File upload service is not configured on the server." };
  }

  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  try {
    const authParams = imagekit.getAuthenticationParameters();
    return { success: true, ...authParams };
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during authentication.";
    return { success: false, error: errorMessage };
  }
}
