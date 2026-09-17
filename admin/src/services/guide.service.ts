import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface GuideInput {
  name: string;
  designation: string;
  description?: string;
  imageUrl: string;
  publicId?: string;
}

export interface GuideMember extends GuideInput {
  id: string;
  createdAt: unknown; // Firestore Timestamp
}

/**
 * Maps a Firestore document snapshot to a typed GuideMember object.
 */
function mapSnapshotToGuideMember(doc: QueryDocumentSnapshot<DocumentData>): GuideMember {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || "",
    designation: data.designation || "",
    description: data.description || "",
    imageUrl: data.imageUrl || "",
    publicId: data.publicId || "",
    createdAt: data.createdAt,
  };
}

/**
 * Saves a new guide member document to the Firestore 'guides' collection.
 */
export async function createGuide(data: GuideInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "guides"), {
      name: data.name,
      designation: data.designation,
      description: data.description || "",
      imageUrl: data.imageUrl,
      publicId: data.publicId || "",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createGuide failure:", error);
    throw error;
  }
}

/**
 * Fetches all guide members from Firestore, ordered by newest first.
 */
export async function getGuides(): Promise<GuideMember[]> {
  try {
    const guidesQuery = query(
      collection(db, "guides"),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(guidesQuery);
    return querySnapshot.docs.map(mapSnapshotToGuideMember);
  } catch (error) {
    console.error("Firestore getGuides failure:", error);
    throw error;
  }
}

/**
 * Deletes a guide member document from the Firestore 'guides' collection.
 */
export async function deleteGuideMember(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "guides", id));
  } catch (error) {
    console.error("Firestore deleteGuideMember failure:", error);
    throw error;
  }
}

/**
 * Updates an existing guide member document in the Firestore 'guides' collection.
 */
export async function updateGuide(id: string, data: Partial<GuideInput>): Promise<void> {
  try {
    if (!id) {
      throw new Error("Missing guide document ID for update operation.");
    }
    const docRef = doc(db, "guides", id);
    const updatePayload = { ...data, updatedAt: serverTimestamp() };
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.error("Firestore updateGuide failure:", error);
    throw error;
  }
}
