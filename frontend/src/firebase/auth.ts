import { Auth, getAuth } from "firebase/auth";
import { getFirebaseApp } from "./config";

declare global {
  var __auth: Auth | undefined;
}

export function getAuthClient(): Auth {
  if (globalThis.__auth) return globalThis.__auth;
  const auth = getAuth(getFirebaseApp());
  globalThis.__auth = auth;
  return auth;
}

export const auth = getAuthClient();

