
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import firebaseConfig from "./config";
import { useFirebase, useFirestore as useFirestoreService, useAuth as useAuthService } from "./provider";

// Frameworks like Next.js reference this to avoid loading the SDK on the server.
const IS_CLIENT = typeof window !== "undefined";

function initializeFirebase() {
  if (IS_CLIENT) {
    if (!getApps().length) {
      try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        const storage = getStorage(app);
        return { app, auth, firestore, storage };
      } catch (e) {
        console.error("Firebase initialization error", e);
        // Avoid throwing an error that could crash the app, just log it.
        return { app: null, auth: null, firestore: null, storage: null };
      }
    } else {
      const app = getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      const storage = getStorage(app);
      return { app, auth, firestore, storage };
    }
  }
  return { app: null, auth: null, firestore: null, storage: null };
}

// Export the initialized services
export { initializeFirebase };

// Export hooks
export const useFirestore = useFirestoreService;
export const useAuth = useAuthService;
export const useFirebaseApp = useFirebase;
