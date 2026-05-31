import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface DashboardStats {
  enquiries: number;
  gallery: number;
  faculty: number;
  courses: number;
  announcements: number;
  testimonials: number;
}

export interface RecentEnquiry {
  id: string;
  studentName: string;
  course: string;
  phone: string;
  email: string;
  createdAt: any;
}

export interface RecentAnnouncement {
  id: string;
  title: string;
  type: string;
  important: boolean;
  date: string;
  createdAt: any;
}

/**
 * Utility helper to fetch document size counts across collections.
 * Fallbacks to 0 in case of missing index or read failure.
 */
async function getCollectionCount(collectionName: string): Promise<number> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.warn(`Could not count collection "${collectionName}":`, error);
    return 0;
  }
}

/**
 * Fetches total count metrics across all six collections.
 * 
 * @returns A promise resolving to counts of all six database models
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      enquiriesCount,
      galleryCount,
      facultyCount,
      coursesCount,
      announcementsCount,
      testimonialsCount
    ] = await Promise.all([
      getCollectionCount("enquiries"),
      getCollectionCount("gallery"),
      getCollectionCount("faculty"),
      getCollectionCount("courses"),
      getCollectionCount("announcements"),
      getCollectionCount("testimonials")
    ]);

    return {
      enquiries: enquiriesCount,
      gallery: galleryCount,
      faculty: facultyCount,
      courses: coursesCount,
      announcements: announcementsCount,
      testimonials: testimonialsCount
    };
  } catch (error) {
    console.error("Firestore getDashboardStats failure:", error);
    throw error;
  }
}

/**
 * Fetches recently submitted enquiries, ordered by newest first.
 * 
 * @param maxLimit Maximum amount of recent enquiries to retrieve
 * @returns A promise resolving to an array of RecentEnquiries
 */
export async function getRecentEnquiries(maxLimit: number = 5): Promise<RecentEnquiry[]> {
  try {
    const enquiriesQuery = query(
      collection(db, "enquiries"),
      orderBy("createdAt", "desc"),
      limit(maxLimit)
    );
    const querySnapshot = await getDocs(enquiriesQuery);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        studentName: data.studentName || data.name || "",
        course: data.course || "",
        phone: data.phone || "",
        email: data.email || "",
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.error("Firestore getRecentEnquiries failure:", error);
    throw error;
  }
}

/**
 * Fetches recently posted announcements, ordered by newest first.
 * 
 * @param maxLimit Maximum amount of recent announcements to retrieve
 * @returns A promise resolving to an array of RecentAnnouncements
 */
export async function getRecentAnnouncements(maxLimit: number = 5): Promise<RecentAnnouncement[]> {
  try {
    const announcementsQuery = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(maxLimit)
    );
    const querySnapshot = await getDocs(announcementsQuery);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        type: data.type || "",
        important: typeof data.important === "boolean" ? data.important : false,
        date: data.date || "",
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.error("Firestore getRecentAnnouncements failure:", error);
    throw error;
  }
}
