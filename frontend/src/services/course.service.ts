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
  createdAt: unknown; // Firestore Timestamp
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
 * Fetches only featured courses from Firestore, ordered by newest first.
 * Note: Requires a composite Firestore index on (featured ASC, createdAt DESC).
 *
 * @returns A promise resolving to an array of featured Course items
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  try {
    const coursesQuery = query(
      collection(db, "courses"),
      where("featured", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(coursesQuery);
    return querySnapshot.docs.map(mapSnapshotToCourse);
  } catch (error) {
    console.error("Firestore getFeaturedCourses failure:", error);
    throw error;
  }
}
