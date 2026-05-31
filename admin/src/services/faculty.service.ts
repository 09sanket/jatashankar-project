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

export interface FacultyInput {
  name: string;
  designation: string;
  department: string;
  description: string;
  imageUrl: string;
  publicId: string;
  experience: string;
  specialization: string;
}

export interface FacultyMember extends FacultyInput {
  id: string;
  createdAt: any; // Firestore Timestamp
}

/**
 * Maps a Firestore document snapshot to a typed FacultyMember object.
 */
function mapSnapshotToFacultyMember(doc: QueryDocumentSnapshot<DocumentData>): FacultyMember {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || "",
    designation: data.designation || "",
    department: data.department || "",
    description: data.description || "",
    imageUrl: data.imageUrl || "",
    publicId: data.publicId || "",
    experience: data.experience || "",
    specialization: data.specialization || "",
    createdAt: data.createdAt,
  };
}

/**
 * Saves a new faculty member document to the Firestore 'faculty' collection.
 *
 * @param data The input profile data for the faculty member
 * @returns A promise resolving to the created document's auto-generated ID
 */
export async function createFaculty(data: FacultyInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "faculty"), {
      name: data.name,
      designation: data.designation,
      department: data.department,
      description: data.description,
      imageUrl: data.imageUrl,
      publicId: data.publicId,
      experience: data.experience,
      specialization: data.specialization,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createFaculty failure:", error);
    throw error;
  }
}

/**
 * Fetches all faculty members from Firestore, ordered by newest first.
 *
 * @returns A promise resolving to an array of FacultyMembers
 */
export async function getFaculty(): Promise<FacultyMember[]> {
  try {
    const facultyQuery = query(
      collection(db, "faculty"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(facultyQuery);
    return querySnapshot.docs.map(mapSnapshotToFacultyMember);
  } catch (error) {
    console.error("Firestore getFaculty failure:", error);
    throw error;
  }
}

/**
 * Deletes a faculty member document from the Firestore 'faculty' collection.
 *
 * @param id The ID of the faculty member to delete
 * @returns A promise resolving when deletion is completed
 */
export async function deleteFacultyMember(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "faculty", id));
  } catch (error) {
    console.error("Firestore deleteFacultyMember failure:", error);
    throw error;
  }
}

/**
 * Updates an existing faculty member document in the Firestore 'faculty' collection.
 * 
 * @param id The ID of the faculty member document to update
 * @param data The partial data object containing the updated fields
 * @returns A promise resolving when the update operation is completed
 */
export async function updateFaculty(id: string, data: Partial<FacultyInput>): Promise<void> {
  try {
    if (!id) {
      throw new Error("Missing faculty document ID for update operation.");
    }
    const docRef = doc(db, "faculty", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Firestore updateFaculty failure:", error);
    throw error;
  }
}
