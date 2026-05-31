import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface Enquiry {
  id: string;
  studentName: string;
  phone: string;
  email: string;
  course: string;
  city: string;
  message: string;
  createdAt: any; // Firestore Timestamp
}

/**
 * Maps a Firestore document snapshot to a typed Enquiry object.
 */
function mapSnapshotToEnquiry(doc: QueryDocumentSnapshot<DocumentData>): Enquiry {
  const data = doc.data();
  return {
    id: doc.id,
    studentName: data.studentName || data.fullName || data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    course: data.course || "",
    city: data.city || "",
    message: data.message || "",
    createdAt: data.createdAt,
  };
}

/**
 * Fetches all student admission enquiries from Firestore, ordered by newest first.
 *
 * @returns A promise resolving to an array of Enquiry items
 */
export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const enquiriesQuery = query(
      collection(db, "enquiries"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(enquiriesQuery);
    return querySnapshot.docs.map(mapSnapshotToEnquiry);
  } catch (error) {
    console.error("Firestore getEnquiries failure:", error);
    throw error;
  }
}

/**
 * Deletes an enquiry document from the Firestore 'enquiries' collection.
 *
 * @param id The ID of the enquiry to delete
 * @returns A promise resolving when the deletion is completed
 */
export async function deleteEnquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "enquiries", id));
  } catch (error) {
    console.error("Firestore deleteEnquiry failure:", error);
    throw error;
  }
}
