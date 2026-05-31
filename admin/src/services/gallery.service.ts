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

export interface GalleryItemInput {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  publicId: string;
}

export interface GalleryItem extends GalleryItemInput {
  id: string;
  createdAt: any; // Firestore Timestamp / Date
}

/**
 * Maps a Firestore document snapshot to a typed GalleryItem object.
 */
function mapSnapshotToGalleryItem(doc: QueryDocumentSnapshot<DocumentData>): GalleryItem {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || "",
    description: data.description || "",
    category: data.category || "",
    imageUrl: data.imageUrl || "",
    publicId: data.publicId || "",
    createdAt: data.createdAt,
  };
}

/**
 * Saves a new gallery item document to the Firestore 'gallery' collection.
 * 
 * @param data The input metadata and image URLs of the gallery item
 * @returns A promise resolving to the created document's auto-generated ID
 */
export async function createGalleryItem(data: GalleryItemInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "gallery"), {
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      publicId: data.publicId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createGalleryItem failure:", error);
    throw error;
  }
}

/**
 * Fetches all gallery items from Firestore, ordered by newest first.
 * 
 * @returns A promise resolving to an array of GalleryItems
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const galleryQuery = query(
      collection(db, "gallery"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(galleryQuery);
    return querySnapshot.docs.map(mapSnapshotToGalleryItem);
  } catch (error) {
    console.error("Firestore getGalleryItems failure:", error);
    throw error;
  }
}

/**
 * Deletes a gallery item document from the Firestore 'gallery' collection.
 * 
 * @param id The ID of the gallery document to delete
 * @returns A promise resolving when the deletion is completed
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "gallery", id));
  } catch (error) {
    console.error("Firestore deleteGalleryItem failure:", error);
    throw error;
  }
}

/**
 * Updates an existing gallery item document in the Firestore 'gallery' collection.
 * 
 * @param id The ID of the gallery document to update
 * @param data The partial data object to apply to the gallery document
 * @returns A promise resolving when the update operation is completed
 */
export async function updateGalleryItem(id: string, data: Partial<GalleryItemInput>): Promise<void> {
  try {
    if (!id) {
      throw new Error("Missing gallery document ID for update operation.");
    }
    const docRef = doc(db, "gallery", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Firestore updateGalleryItem failure:", error);
    throw error;
  }
}
