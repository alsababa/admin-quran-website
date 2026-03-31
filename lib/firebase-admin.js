import admin from 'firebase-admin';
import serviceAccount from './firebase-config.js';

/**
 * Initializes the Firebase Admin SDK using a direct configuration object.
 * This bypasses all environment variable parsing and formatting issues.
 */
export function getAdminApp() {
  if (!admin.apps.length) {
    try {
      // Initialize with the imported config object
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log("Firebase Admin Initialized Successfully (Config Mode)");
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error.message);
      throw error;
    }
  }
  return admin;
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
