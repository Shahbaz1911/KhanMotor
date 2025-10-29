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

export const metadata: Metadata = {
  title: 'Motor Khan - Car Restoration, Auto Repair, and Used Cars in Rithala, Delhi',
  description: 'Your trusted car workshop in Rithala, Delhi for classic car restoration, auto repair, and car maintenance. We are a top car dealership to buy used cars or sell your car. Visit our auto body shop for denting, painting, and car detailing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://armanautoxperts-in.vercel.app/armanautoxperts/armanautoxperts-1.png" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
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
                <Toaster />
              </SmoothScroll>
            </ThemeProvider>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
