"use client";

import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { initializeFirebase } from ".";

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    firestore: null,
    storage: null,
  });

  useEffect(() => {
    const services = initializeFirebase();
    setFirebase(services);
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase(): FirebaseContextType {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function useFirestore(): Firestore | null {
  const { firestore } = useFirebase();
  return firestore;
}

export function useAuth(): Auth | null {
  const { auth } = useFirebase();
  return auth;
}

export function useStorage(): FirebaseStorage | null {
  const { storage } = useFirebase();
  return storage;
}
