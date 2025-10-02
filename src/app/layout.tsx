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
  title: 'ArmanAutoxperts',
  description: 'Explore premium vehicles, contact us, or use our AI tools. All in one place.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400;700;900&display=swap" rel="stylesheet" />
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
