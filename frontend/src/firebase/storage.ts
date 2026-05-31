import { FirebaseStorage, getStorage } from "firebase/storage";
import { getFirebaseApp } from "./config";

declare global {
  var __storage: FirebaseStorage | undefined;
}

export function getStorageClient(): FirebaseStorage {
  if (globalThis.__storage) return globalThis.__storage;
  const storage = getStorage(getFirebaseApp());
  globalThis.__storage = storage;
  return storage;
}

export const storage = getStorageClient();

