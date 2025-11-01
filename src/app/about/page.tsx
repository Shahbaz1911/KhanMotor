
import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

// ✅ SEO Metadata - This now correctly resides in a Server Component.
export const metadata: Metadata = {
  title: "About Motor Khan - Expert Car Repair, Painting & Restoration in Delhi (Rohini, Rithala, Vijay Vihar, Budh Vihar)",
  description:
    "Learn about Motor Khan — Delhi’s trusted car workshop for denting, painting, restoration, and used car sales. Serving Rohini, Rithala, Vijay Vihar, Budh Vihar & nearby Delhi areas.",
  keywords: [
    "car denting painting in Rohini",
    "car restoration services Rohini Delhi",
    "car body shop in Rohini",
    "auto body repair Rohini Delhi",
    "paintless dent repair Rohini",
    "car paint shop Rohini",
    "car repair shops in Rohini Delhi",
    "vehicle restoration Rohini Delhi",
    "car service center Rohini",
    "used cars for sale Rohini Delhi",
    "buy used car in Rohini",
    "sell car in Rohini Delhi",
    "second hand car dealers Rohini",
    "car buyers Rohini Delhi",
    "old car sale Rohini",
    "pre-owned car purchase Rohini",
    "car trade-in Rohini Delhi",
    "affordable car denting painting in Rohini",
    "expert car restoration delhi Rohini",
    "best car repair shop Rohini",
    "instant dent repair Rohini Delhi",
    "multi-brand car service Rohini",
    "premium car painting Rohini",
    "trusted used car dealer Rohini",
    "quick car sale Rohini Delhi",
    "vijay vihar car repair",
    "budh vihar car restoration",
    "rithala car service center",
    "delhi auto repair workshop"
  ],
  openGraph: {
    title:
      "About Motor Khan - Leading Car Workshop in Delhi (Rohini, Rithala, Vijay Vihar, Budh Vihar)",
    description:
      "Motor Khan is your trusted auto workshop in Delhi, specializing in car denting, painting, restoration, and used car sales. Visit our Rohini & Rithala branch today.",
    url: "https://motorkhan.com/about",
    siteName: "Motor Khan",
    images: [
      {
        url: "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png",
        width: 1200,
        height: 630,
        alt: "Motor Khan Car Workshop Delhi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://motorkhan.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
