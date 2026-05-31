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
  createdAt: unknown; // Firestore Timestamp
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
 * Fetches faculty members filtered by department and ordered by newest first.
 * Note: Requires a composite Firestore index on (department ASC, createdAt DESC).
 * Firestore will log a direct link to create the index if it is missing.
 *
 * @param department The department name to filter by
 * @returns A promise resolving to an array of filtered FacultyMembers
 */
export async function getFacultyByDepartment(department: string): Promise<FacultyMember[]> {
  try {
    const facultyQuery = query(
      collection(db, "faculty"),
      where("department", "==", department),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(facultyQuery);
    return querySnapshot.docs.map(mapSnapshotToFacultyMember);
  } catch (error) {
    console.error(`Firestore getFacultyByDepartment (Department: ${department}) failure:`, error);
    throw error;
  }
}
