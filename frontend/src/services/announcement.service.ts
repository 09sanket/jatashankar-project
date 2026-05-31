import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface AnnouncementInput {
  title: string;
  description: string;
  type: string;
  important: boolean;
  date: string;
}

export interface Announcement extends AnnouncementInput {
  id: string;
  createdAt: unknown; // Firestore Timestamp
}

/**
 * Maps a Firestore document snapshot to a typed Announcement object.
 */
function mapSnapshotToAnnouncement(doc: QueryDocumentSnapshot<DocumentData>): Announcement {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || "",
    description: data.description || "",
    type: data.type || "",
    important: typeof data.important === "boolean" ? data.important : false,
    date: data.date || "",
    createdAt: data.createdAt,
  };
}

/**
 * Saves a new announcement document to the Firestore 'announcements' collection.
 *
 * @param data The input announcement metadata
 * @returns A promise resolving to the created document's auto-generated ID
 */
export async function createAnnouncement(data: AnnouncementInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "announcements"), {
      title: data.title,
      description: data.description,
      type: data.type,
      important: data.important,
      date: data.date,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createAnnouncement failure:", error);
    throw error;
  }
}

/**
 * Fetches all announcements from Firestore, ordered by newest first.
 *
 * @returns A promise resolving to an array of Announcement items
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const announcementsQuery = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(announcementsQuery);
    return querySnapshot.docs.map(mapSnapshotToAnnouncement);
  } catch (error) {
    console.error("Firestore getAnnouncements failure:", error);
    throw error;
  }
}

/**
 * Fetches only important announcements from Firestore, ordered by newest first.
 * Note: Requires a composite Firestore index on (important ASC, createdAt DESC).
 *
 * @returns A promise resolving to an array of important Announcement items
 */
export async function getImportantAnnouncements(): Promise<Announcement[]> {
  try {
    const announcementsQuery = query(
      collection(db, "announcements"),
      where("important", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(announcementsQuery);
    return querySnapshot.docs.map(mapSnapshotToAnnouncement);
  } catch (error) {
    console.error("Firestore getImportantAnnouncements failure:", error);
    throw error;
  }
}
