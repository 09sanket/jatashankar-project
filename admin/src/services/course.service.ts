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

export interface CourseInput {
  courseName: string;
  shortName: string;
  duration: string;
  eligibility: string;
  description: string;
  careerScope: string;
  imageUrl: string;
  publicId: string;
  featured: boolean;
}

export interface Course extends CourseInput {
  id: string;
  createdAt: any; // Firestore Timestamp
}

/**
 * Maps a Firestore document snapshot to a typed Course object.
 */
function mapSnapshotToCourse(doc: QueryDocumentSnapshot<DocumentData>): Course {
  const data = doc.data();
  return {
    id: doc.id,
    courseName: data.courseName || "",
    shortName: data.shortName || "",
    duration: data.duration || "",
    eligibility: data.eligibility || "",
    description: data.description || "",
    careerScope: data.careerScope || "",
    imageUrl: data.imageUrl || "",
    publicId: data.publicId || "",
    featured: typeof data.featured === "boolean" ? data.featured : false,
    createdAt: data.createdAt,
  };
}

/**
 * Saves a new course document to the Firestore 'courses' collection.
 *
 * @param data The input metadata and image URLs of the course
 * @returns A promise resolving to the created document's auto-generated ID
 */
export async function createCourse(data: CourseInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "courses"), {
      courseName: data.courseName,
      shortName: data.shortName,
      duration: data.duration,
      eligibility: data.eligibility,
      description: data.description,
      careerScope: data.careerScope,
      imageUrl: data.imageUrl,
      publicId: data.publicId,
      featured: data.featured,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createCourse failure:", error);
    throw error;
  }
}

/**
 * Fetches all courses from Firestore, ordered by newest first.
 *
 * @returns A promise resolving to an array of Course items
 */
export async function getCourses(): Promise<Course[]> {
  try {
    const coursesQuery = query(
      collection(db, "courses"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(coursesQuery);
    return querySnapshot.docs.map(mapSnapshotToCourse);
  } catch (error) {
    console.error("Firestore getCourses failure:", error);
    throw error;
  }
}

/**
 * Deletes a course document from the Firestore 'courses' collection.
 *
 * @param id The ID of the course to delete
 * @returns A promise resolving when the deletion is completed
 */
export async function deleteCourse(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "courses", id));
  } catch (error) {
    console.error("Firestore deleteCourse failure:", error);
    throw error;
  }
}

/**
 * Updates an existing course document in the Firestore 'courses' collection.
 *
 * @param id   The ID of the course document to update
 * @param data A partial object containing only the fields to be modified
 * @returns    A promise resolving when the update operation is completed
 */
export async function updateCourse(id: string, data: Partial<CourseInput>): Promise<void> {
  try {
    if (!id) {
      throw new Error("Missing course document ID for update operation.");
    }
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Firestore updateCourse failure:", error);
    throw error;
  }
}
