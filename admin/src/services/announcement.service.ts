import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
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
  createdAt: any; // Firestore Timestamp
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
 * Deletes an announcement document from the Firestore 'announcements' collection.
 *
 * @param id The ID of the announcement to delete
 * @returns A promise resolving when the deletion is completed
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "announcements", id));
  } catch (error) {
    console.error("Firestore deleteAnnouncement failure:", error);
    throw error;
  }
}

/**
 * Updates an existing announcement document in the Firestore 'announcements' collection.
 *
 * @param id   The ID of the announcement document to update
 * @param data A partial object containing only the fields to be modified
 * @returns    A promise resolving when the update operation is completed
 */
export async function updateAnnouncement(id: string, data: Partial<AnnouncementInput>): Promise<void> {
  try {
    if (!id) {
      throw new Error("Missing announcement document ID for update operation.");
    }
    const docRef = doc(db, "announcements", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Firestore updateAnnouncement failure:", error);
    throw error;
  }
}
