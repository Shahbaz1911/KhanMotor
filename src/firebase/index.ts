
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import firebaseConfig from "./config";

// Frameworks like Next.js reference this to avoid loading the SDK on the server.
const IS_CLIENT = typeof window !== "undefined";

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

function initializeFirebase() {
  if (IS_CLIENT && !getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
    } catch (e) {
      console.error("Firebase initialization error", e);
      throw e;
    }
  } else if (IS_CLIENT && getApps().length) {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  }

  return { app, auth, firestore, storage };
}

// Export the initialized services
export { initializeFirebase };

// You can also export the individual services if you prefer
export { app, auth, firestore, storage };

    