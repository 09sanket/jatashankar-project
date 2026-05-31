import { Firestore, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./config";

declare global {
  var __firestore: Firestore | undefined;
}

export function getDb(): Firestore {
  if (globalThis.__firestore) return globalThis.__firestore;
  const db = getFirestore(getFirebaseApp());
  globalThis.__firestore = db;
  return db;
}

export const db = getDb();

