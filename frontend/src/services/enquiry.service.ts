import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";

export interface EnquiryData {
  fullName: string;
  phone: string;
  email: string;
  course: string;
  city: string;
  message: string;
}

/**
 * Creates a new enquiry lead document in Firestore.
 * 
 * @param data The enquiry data collected from the form
 * @returns A promise resolving to the created document reference
 */
export async function createEnquiry(data: EnquiryData) {
  return await addDoc(collection(db, "enquiries"), {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    course: data.course,
    city: data.city,
    message: data.message,
    createdAt: serverTimestamp(),
  });
}
