import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SmoothScroll } from '@/components/custom/SmoothScroll';
import { WhatsAppButton } from '@/components/custom/WhatsAppButton';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { CookieConsentBanner } from '@/components/custom/CookieConsentBanner';

export const metadata: Metadata = {
  title: 'Motor Khan - Car Denting, Painting & Restoration in Rohini, Rithala, Delhi',
  description:
    'Motor Khan offers expert car denting painting, auto body repair, and full car restoration services in Rohini, Rithala, Vijay Vihar, Budh Vihar, and across Delhi. Trusted car body shop for paintless dent repair, used car sales, and premium car service center in Delhi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Motor Khan",
    "url": "https://motorkhan.com",
    "logo": "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png",
    "sameAs": [
      "https://www.instagram.com/motorkhan",
      "https://www.facebook.com/motorkhan"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Motor Khan",
    "image": "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png",
    "url": "https://motorkhan.com",
    "telephone": "+918595853918",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No 12, Vijay Vihar Phase I, Block B, Near Rice Mill, Rithala, Rohini",
      "addressLocality": "Delhi",
      "postalCode": "110085",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.7369,
      "longitude": 77.1209
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "areaServed": [
      { "@type": "Place", "name": "Rohini, Delhi" },
      { "@type": "Place", "name": "Rithala, Delhi" },
      { "@type": "Place", "name": "Vijay Vihar, Delhi" },
      { "@type": "Place", "name": "Budh Vihar, Delhi" }
    ],
    "serviceType": [
      "Car denting painting in Rohini",
      "Car restoration services Rohini Delhi",
      "Car body shop in Rohini",
      "Auto body repair Rohini Delhi",
      "Paintless dent repair Rohini",
      "Car paint shop Rohini",
      "Car repair shops in Rohini Delhi",
      "Vehicle restoration Rohini Delhi",
      "Car service center Rohini",
      "Used cars for sale Rohini Delhi",
      "Buy used car in Rohini",
      "Sell car in Rohini Delhi",
      "Second hand car dealers Rohini",
      "Car buyers Rohini Delhi",
      "Old car sale Rohini",
      "Pre-owned car purchase Rohini",
      "Car trade-in Rohini Delhi",
      "Affordable car denting painting in Rohini",
      "Expert car restoration Delhi Rohini",
      "Best car repair shop Rohini",
      "Instant dent repair Rohini Delhi",
      "Multi-brand car service Rohini",
      "Premium car painting Rohini",
      "Trusted used car dealer Rohini",
      "Quick car sale Rohini Delhi"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png"
          sizes="any"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SmoothScroll>
                <FirebaseErrorListener />
                <div className="flex min-h-screen flex-col">
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <WhatsAppButton />
                <CookieConsentBanner />
                <Toaster />
              </SmoothScroll>
            </ThemeProvider>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
