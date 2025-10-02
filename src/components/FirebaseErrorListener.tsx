"use client";

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a real app, you might use a more sophisticated logging service.
      // For this development environment, we'll log it and throw to show the Next.js overlay.
      console.error("A Firestore permission error was caught:", error.message, error.context);
      
      // We throw the error to make it visible in the Next.js development overlay.
      // This is for development purposes only. In production, you would handle this gracefully.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        // In production, show a friendly toast message.
         toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to perform this action.",
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  // This component does not render anything to the DOM.
  return null;
}
    