
'use client';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from ".";

// Initialize Firebase and get a reference to the service
const { app } = initializeFirebase();
const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path in Firebase Storage where the file should be stored (e.g., 'images').
 * @param onProgress A callback function to track upload progress.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadFile = (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a storage reference
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);

    // Create an upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register observers to listen for state changes, errors, and completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

    