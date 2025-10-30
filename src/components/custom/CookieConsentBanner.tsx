
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Cookie } from "lucide-react";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given.
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Use a timeout to delay the banner appearance slightly for a better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (consent: "accepted" | "rejected") => {
    localStorage.setItem("cookie_consent", consent);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <Card className="w-full max-w-4xl mx-auto bg-background/80 dark:bg-black/80 backdrop-blur-lg border-border shadow-2xl">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                    <div className="flex items-start gap-4">
                        <Cookie className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-black uppercase">Privacy Settings</h3>
                            <p className="text-sm text-muted-foreground mt-1 lowercase">
                                We use cookies and other technologies to make our website work. We also use optional technologies to help us to improve it, display personalized content and provide you with an unforgettable experience. For more detailed information about the technologies we use, please see our{' '}
                                <Link href="/privacy-policy" className="underline hover:text-primary">Cookies policy</Link>.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                        <Button
                            variant="destructive"
                            onClick={() => handleConsent("accepted")}
                            className="w-full sm:w-auto"
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleConsent("rejected")}
                             className="w-full sm:w-auto"
                        >
                            Reject
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
