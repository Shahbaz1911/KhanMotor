
import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Contact Motor Khan - Best Car Repair & Restoration in Delhi (Rohini, Rithala, Vijay Vihar, Budh Vihar)",
  description:
    "Get in touch with Motor Khan for expert car repair, denting painting, restoration, and used car deals in Rohini, Rithala, Vijay Vihar, Budh Vihar & Delhi. Visit our workshop or call +91 8595853918 today!",
  keywords: [
    "car repair in rithala",
    "car repair in rohini",
    "car repair in vijay vihar",
    "car repair in budh vihar",
    "car denting painting in rohini",
    "car restoration services rohini delhi",
    "car body shop in rohini",
    "auto body repair rohini delhi",
    "paintless dent repair rohini",
    "contact car repair rohini",
    "motor khan contact",
    "auto repair rohini",
    "car denting painting rohini",
    "car restoration services rohini delhi",
    "car body shop rohini",
    "auto body repair rohini delhi",
    "paintless dent repair rohini",
    "car paint shop rohini",
    "car repair shops rohini delhi",
    "vehicle restoration rohini delhi",
    "car service center rohini",
    "used cars for sale rohini delhi",
    "buy used car in rohini",
    "sell car in rohini delhi",
    "second hand car dealers rohini",
    "car buyers rohini delhi",
    "old car sale rohini",
    "pre-owned car purchase rohini",
    "car trade-in rohini delhi",
    "affordable car denting painting rohini",
    "expert car restoration delhi rohini",
    "best car repair shop rohini",
    "multi-brand car service rohini",
    "premium car painting rohini",
    "trusted used car dealer rohini",
    "quick car sale rohini delhi",
    "vijay vihar car repair",
    "budh vihar car restoration",
    "rithala car service center",
    "delhi auto repair workshop",
    "car repair near me",
    "rithala car repair",
    "car shop"
  ],
  openGraph: {
    title: "Contact Motor Khan - Trusted Car Workshop in Delhi (Rohini, Rithala, Vijay Vihar, Budh Vihar)",
    description:
      "Reach out to Motor Khan for professional car repair, painting, and restoration services in Delhi NCR. Visit our workshop in Rohini or call +91 8595853918.",
    url: "https://motorkhan.com/contact",
    siteName: "Motor Khan",
    images: [
      {
        url: "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png",
        width: 1200,
        height: 630,
        alt: "Motor Khan Car Workshop Rohini Delhi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://motorkhan.com/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
