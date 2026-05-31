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

export interface GalleryItemInput {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  publicId: string;
}

export interface GalleryItem extends GalleryItemInput {
  id: string;
  createdAt: unknown; // Firestore Timestamp / Date
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
 * Fetches gallery items filtered by category and ordered by newest first.
 * 
 * @param category The category name to filter by
 * @returns A promise resolving to an array of filtered GalleryItems
 */
export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  try {
    const galleryQuery = query(
      collection(db, "gallery"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(galleryQuery);
    return querySnapshot.docs.map(mapSnapshotToGalleryItem);
  } catch (error) {
    // If a composite index is missing in a new Firebase project, Firestore throws an error with a link.
    console.error(`Firestore getGalleryItemsByCategory (Category: ${category}) failure:`, error);
    throw error;
  }
}
