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
  keywords:
    'car denting painting in Rohini, car restoration services Rohini Delhi, car body shop in Rohini, auto body repair Rohini Delhi, paintless dent repair Rohini, car paint shop Rohini, car repair shops in Rohini Delhi, vehicle restoration Rohini Delhi, car service center Rohini, used cars for sale Rohini Delhi, buy used car in Rohini, sell car in Rohini Delhi, second hand car dealers Rohini, car buyers Rohini Delhi, old car sale Rohini, pre-owned car purchase Rohini, car trade-in Rohini Delhi, affordable car denting painting in Rohini, expert car restoration Delhi Rohini, best car repair shop Rohini, instant dent repair Rohini Delhi, multi-brand car service Rohini, premium car painting Rohini, trusted used car dealer Rohini, quick car sale Rohini Delhi',
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
      "latitude": 28.71634404381768,
      "longitude": 77.0963242650032
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "areaServed": [
      { "@type": "Place", "name": "Rohini, Delhi" },
      { "@type": "Place", "name": "Rithala, Delhi" },
      { "@type": "Place", "name": "Vijay Vihar, Delhi" },
      { "@type": "Place", "name": "Budh Vihar, Delhi" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you offer car denting and painting in Rohini?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Motor Khan specializes in professional car denting and painting services in Rohini, Rithala, and nearby Delhi areas."
        }
      },
      {
        "@type": "Question",
        "name": "Can I sell my old car at Motor Khan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Motor Khan offers a trusted platform for buying and selling used cars in Rohini and across Delhi."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide car restoration services for classic cars?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide complete restoration services for vintage and classic cars with expert craftsmanship and attention to detail."
        }
      },
      {
        "@type": "Question",
        "name": "What are your workshop hours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Motor Khan is open seven days a week from 9 AM to 9 PM."
        }
      }
    ]
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
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@100..900&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featureSnippet) }} />
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
