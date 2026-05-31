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

export interface TestimonialInput {
  studentName: string;
  course: string;
  review: string;
  rating: number;
  imageUrl: string;
  publicId: string;
  designation: string;
  featured: boolean;
}

export interface Testimonial extends TestimonialInput {
  id: string;
  createdAt: unknown; // Firestore Timestamp
}

/**
 * Maps a Firestore document snapshot to a typed Testimonial object.
 */
function mapSnapshotToTestimonial(doc: QueryDocumentSnapshot<DocumentData>): Testimonial {
  const data = doc.data();
  return {
    id: doc.id,
    studentName: data.studentName || "",
    course: data.course || "",
    review: data.review || "",
    rating: typeof data.rating === "number" ? data.rating : 5,
    imageUrl: data.imageUrl || "",
    publicId: data.publicId || "",
    designation: data.designation || "",
    featured: typeof data.featured === "boolean" ? data.featured : true,
    createdAt: data.createdAt,
  };
}

/**
 * Saves a new testimonial document to the Firestore 'testimonials' collection.
 *
 * @param data The input testimonial attributes
 * @returns A promise resolving to the created document's auto-generated ID
 */
export async function createTestimonial(data: TestimonialInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "testimonials"), {
      studentName: data.studentName,
      course: data.course,
      review: data.review,
      rating: data.rating,
      imageUrl: data.imageUrl,
      publicId: data.publicId,
      designation: data.designation,
      featured: data.featured,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createTestimonial failure:", error);
    throw error;
  }
}

/**
 * Fetches all testimonials from Firestore, ordered by newest first.
 *
 * @returns A promise resolving to an array of Testimonial items
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsQuery = query(
      collection(db, "testimonials"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(testimonialsQuery);
    return querySnapshot.docs.map(mapSnapshotToTestimonial);
  } catch (error) {
    console.error("Firestore getTestimonials failure:", error);
    throw error;
  }
}

/**
 * Fetches only featured testimonials from Firestore, ordered by newest first.
 * Note: Requires a composite Firestore index on (featured ASC, createdAt DESC).
 *
 * @returns A promise resolving to an array of featured Testimonial items
 */
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsQuery = query(
      collection(db, "testimonials"),
      where("featured", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(testimonialsQuery);
    return querySnapshot.docs.map(mapSnapshotToTestimonial);
  } catch (error) {
    console.error("Firestore getFeaturedTestimonials failure:", error);
    throw error;
  }
}
