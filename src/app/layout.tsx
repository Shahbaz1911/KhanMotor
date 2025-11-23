
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
import { ScrollProgressBar } from '@/components/custom/ScrollProgressBar';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Motor Khan - Car Denting, Painting & Restoration in Rohini, Rithala, Delhi',
  description:
    'Motor Khan offers expert car denting, painting, auto body repair, and full car restoration services in Rohini, Rithala, Vijay Vihar, and Budh Vihar. Your trusted Delhi-based car body shop for paintless dent repair, used car sales, and premium car service.',
  keywords:
    'car repair near me,car reapir near me,car repair in rithala ,car repair in rohini,car repair in vijay vihar ,car repair in budh vihar ,car denting painting in Rohini, car restoration services Rohini Delhi, car body shop in Rohini, auto body repair Rohini Delhi, paintless dent repair Rohini, car paint shop Rohini, car repair shops in Rohini Delhi, vehicle restoration Rohini Delhi, car service center Rohini, used cars for sale Rohini Delhi, buy used car in Rohini, sell car in Rohini Delhi, second hand car dealers Rohini, car buyers Rohini Delhi, old car sale Rohini, pre-owned car purchase Rohini, car trade-in Rohini Delhi, affordable car denting painting in Rohini, expert car restoration Delhi Rohini, best car repair shop Rohini, instant dent repair Rohini Delhi, multi-brand car service Rohini, premium car painting Rohini, trusted used car dealer Rohini, quick car sale Rohini Delhi, rithala car repair, car shop',
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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Motor Khan",
    "image": "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png",
    "url": "https://motorkhan.com",
    "telephone": "+918595853918",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 12, Near Rice Mill, Vijay Vihar Phase I, Block B",
      "addressLocality": "Rithala, Rohini, Delhi",
      "postalCode": "110085",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "280"
    },
    "review": [
        {
        "@type": "Review",
        "author": {
            "@type": "Person",
            "name": "Ayesha Khan"
        },
        "datePublished": "2024-04-15",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
        },
        "reviewBody": "Motor Khan provided an unparalleled buying experience. Their attention to detail and customer service is top-notch."
        },
        {
        "@type": "Review",
        "author": {
            "@type": "Person",
            "name": "Rohan Sharma"
        },
        "datePublished": "2024-03-22",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
        },
        "reviewBody": "The team at Motor Khan made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure."
        }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W7F348D7');`}}></script>
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
      </head>

      <body className="font-body antialiased">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W7F348D7"
height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
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
                  <ScrollProgressBar />
                  <Toaster />
              </SmoothScroll>
            </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
