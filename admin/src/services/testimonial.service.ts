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
  createdAt: any; // Firestore Timestamp
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
 * Deletes a testimonial document from the Firestore 'testimonials' collection.
 *
 * @param id The ID of the testimonial to delete
 * @returns A promise resolving when the deletion is completed
 */
export async function deleteTestimonial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "testimonials", id));
  } catch (error) {
    console.error("Firestore deleteTestimonial failure:", error);
    throw error;
  }
}

/**
 * Updates an existing testimonial document in the Firestore 'testimonials' collection.
 *
 * @param id   The ID of the testimonial document to update
 * @param data A partial object containing only the fields to be modified
 * @returns    A promise resolving when the update operation is completed
 */
export async function updateTestimonial(id: string, data: Partial<TestimonialInput>): Promise<void> {
  try {
    if (!id) {
      throw new Error("Missing testimonial document ID for update operation.");
    }
    const docRef = doc(db, "testimonials", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Firestore updateTestimonial failure:", error);
    throw error;
  }
}
