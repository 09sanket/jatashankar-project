import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface GuideMember {
  id: string;
  name: string;
  designation: string;
  description: string;
  imageUrl: string;
  publicId: string;
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
 * Fetches all guide members from Firestore, ordered by newest first.
 *
 * @returns A promise resolving to an array of GuideMembers
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
