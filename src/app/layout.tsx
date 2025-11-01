
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
  title: 'Motor Khan - Your Trusted Car Workshop in Rithala, Delhi',
  description: 'Expert car restoration, auto repair, and car maintenance at Motor Khan, the top car dealership in Rithala, Delhi. We specialize in classic car restoration, collision repair, denting and painting, and offer a curated car marketplace for certified pre-owned cars. Whether you want to buy used cars or sell your car, we are the best car mechanic for all your needs.',
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
    "logo": "https://delhi.motorkhan.com/images/motorkhandarktheme.png",
    "sameAs": [
      "https://www.instagram.com/motorkhan",
      "https://www.facebook.com/motorkhan"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Motor Khan",
    "image": "https://delhi.motorkhan.com/images/motorkhandarktheme.png",
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
    "openingHours": "Mo-Su 09:00-21:00"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://delhi.motorkhan.com/images/motorkhandarktheme.png" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
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
