
"use server";

import { z } from "zod";
import { contactFormSchema } from "@/types";

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

  // In a real application, you would send an email here.
  // For this example, we'll just log it to the console.
  console.log("Contact Form Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a possible error (e.g. 10% chance of failure)
  // if (Math.random() < 0.1) {
  //   return {
  //     message: "An unexpected error occurred while sending your message. Please try again later.",
  //     success: false,
  //   };
  // }

  return {
    message: "Thank you for your message! We will get back to you soon.",
    success: true,
  };
}

    