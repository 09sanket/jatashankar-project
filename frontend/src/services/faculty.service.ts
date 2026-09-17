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
  department?: string;
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
      department: data.department || "",
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
 * Sorts the faculty list according to requested role hierarchy.
 */
function sortFacultyList(facultyList: FacultyMember[]): FacultyMember[] {
  return facultyList.sort((a, b) => {
    const textA = ((a.name || "") + " " + (a.designation || "")).toLowerCase();
    const textB = ((b.name || "") + " " + (b.designation || "")).toLowerCase();

    const getIndex = (text: string) => {
      if (text.includes("chairman")) return 1;
      if (text.includes("director") && !text.includes("assistant")) return 2;
      if (text.includes("secretary") || text.includes("secretory")) return 3;
      if (text.includes("assistant director")) return 4;
      if (text.includes("naveen")) return 5;
      if (text.includes("manisha") || text.includes("principal")) return 6;
      if (text.includes("vinit")) return 7;
      if (text.includes("chandrashekhar")) return 8;
      return 999;
    };

    const idxA = getIndex(textA);
    const idxB = getIndex(textB);

    if (idxA !== idxB) {
      return idxA - idxB;
    }
    return 0; // Maintain original createdAt ascending order for others
  });
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
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(facultyQuery);
    const facultyList = querySnapshot.docs.map(mapSnapshotToFacultyMember);
    return sortFacultyList(facultyList);
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
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(facultyQuery);
    const facultyList = querySnapshot.docs.map(mapSnapshotToFacultyMember);
    return sortFacultyList(facultyList);
  } catch (error) {
    console.error(`Firestore getFacultyByDepartment (Department: ${department}) failure:`, error);
    throw error;
  }
}
