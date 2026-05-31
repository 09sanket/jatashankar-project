import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { env } from "../lib/env";

export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function getFirebasePublicConfig(): FirebasePublicConfig {
  return {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

declare global {
  var __firebaseApp: FirebaseApp | undefined;
}

/**
 * Returns a singleton Firebase app instance.
 * Safe for Next.js + Turbopack HMR (prevents duplicate initialization).
 */
export function getFirebaseApp(): FirebaseApp {
  if (globalThis.__firebaseApp) return globalThis.__firebaseApp;

  const app =
    getApps().length > 0 ? getApp() : initializeApp(getFirebasePublicConfig());

  globalThis.__firebaseApp = app;
  return app;
}

