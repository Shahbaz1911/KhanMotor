
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SmoothScroll } from '@/components/custom/SmoothScroll';
import { WhatsAppButton } from '@/components/custom/WhatsAppButton';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { CookieConsentBanner } from '@/components/custom/CookieConsentBanner';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Motor Khan - Car Denting, Painting & Restoration in Rohini, Rithala, Delhi',
  description:
    'Motor Khan offers expert car denting painting, auto body repair, and full car restoration services in Rohini, Rithala, Vijay Vihar, Budh Vihar, and across Delhi. Trusted car body shop for paintless dent repair, used car sales, and premium car service center in Delhi.',
  keywords:
    'car repair near me,car repair in rithala ,car repair in rohini,car repair in vijay vihar ,car repair in budh vihar ,car denting painting in Rohini, car restoration services Rohini Delhi, car body shop in Rohini, auto body repair Rohini Delhi, paintless dent repair Rohini, car paint shop Rohini, car repair shops in Rohini Delhi, vehicle restoration Rohini Delhi, car service center Rohini, used cars for sale Rohini Delhi, buy used car in Rohini, sell car in Rohini Delhi, second hand car dealers Rohini, car buyers Rohini Delhi, old car sale Rohini, pre-owned car purchase Rohini, car trade-in Rohini Delhi, affordable car denting painting in Rohini, expert car restoration Delhi Rohini, best car repair shop Rohini, instant dent repair Rohini Delhi, multi-brand car service Rohini, premium car painting Rohini, trusted used car dealer Rohini, quick car sale Rohini Delhi',
  icons: {
    icon: [
      { url: 'https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-white.png', sizes: 'any', type: 'image/png' },
      { url: 'https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-white.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-white.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: 'https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-white.png', sizes: '180x180', type: 'image/png' },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "AutoRepair"],
    "name": "Motor Khan",
    "url": "https://motorkhan.com",
    "logo": "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png",
    "sameAs": [
      "https://www.instagram.com/motorkhan",
      "https://www.facebook.com/motorkhan"
    ],
    "telephone": "+918595853918",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 12, Near Rice Mill, Vijay Vihar Phase I, Block B",
      "addressLocality": "Rithala, Rohini, Delhi",
      "postalCode": "110085",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.71634404381768,
      "longitude": 77.0963242650032
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+918595853918",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": [
      "Car Denting and Painting",
      "Paintless Dent Repair",
      "Auto Body Repair",
      "Car Restoration",
      "Used Car Sales and Purchase",
      "Premium Car Painting",
      "Multi-brand Car Service"
    ],
    "provider": {
      "@type": "AutoRepair",
      "name": "Motor Khan",
      "url": "https://motorkhan.com"
    },
    "areaServed": "Rohini, Rithala, Vijay Vihar, Budh Vihar, Delhi"
  };

  const featureSnippet = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Motor Khan - Car Workshop in Rohini, Delhi",
    "description": "Trusted car denting, painting, and restoration service in Rohini, Delhi. Expert mechanics, affordable prices, and quick service for all car brands.",
    "mainEntity": {
      "@type": "Product",
      "name": "Car Repair & Restoration Services",
      "brand": "Motor Khan",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "280"
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Motor Khan offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We specialize in car restoration, detailing, denting and painting, car repair, servicing, and buying/selling certified pre-owned cars."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Motor Khan located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MotorKhan is located at Shop No. 12, Near Rice Mill, Vijay Vihar Phase I, Block B, Rithala, Rohini, Delhi, 110085, India."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer financing options?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we work with multiple partners to provide flexible financing options for your vehicle purchase."
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@100..900&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featureSnippet) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </head>

      <body className="font-body antialiased">
        <FirebaseClientProvider>
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
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
