import { createGuide } from "./src/services/guide.service";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./src/firebase/auth";

const dummyData = [
  {
    name: "Dr. Vikram Singh",
    designation: "Chief Medical Advisor",
    description: "Leading visionary with over 20 years of experience in shaping modern healthcare practices.",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    publicId: "",
  },
  {
    name: "Dr. Anjali Sharma",
    designation: "Academic Director",
    description: "Pioneering academic excellence and curriculum development for future medical professionals.",
    imageUrl: "https://images.unsplash.com/photo-1594824432258-f5713437142d?q=80&w=2070&auto=format&fit=crop",
    publicId: "",
  },
  {
    name: "Mr. Rajeev Verma",
    designation: "Operations Head",
    description: "Ensuring seamless institutional operations and fostering a collaborative learning environment.",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    publicId: "",
  },
  {
    name: "Dr. Neha Kapoor",
    designation: "Clinical Coordinator",
    description: "Bridging the gap between theoretical knowledge and practical clinical application.",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop",
    publicId: "",
  }
];

async function seed() {
  console.log("Logging in natively to Firebase Auth...");
  try {
    await signInWithEmailAndPassword(auth, "admin@jatashankar.in", "admin123");
    console.log("Logged in natively! Seeding dummy guides...");
  } catch (err) {
    console.error("Native login failed, trying admin@jatashankar.com...", err);
    try {
      await signInWithEmailAndPassword(auth, "admin@jatashankar.com", "admin123");
      console.log("Logged in natively with .com! Seeding dummy guides...");
    } catch(err2) {
      console.error("All native logins failed.");
      process.exit(1);
    }
  }

  for (const guide of dummyData) {
    const id = await createGuide(guide);
    console.log("Created guide:", id);
  }
  console.log("Done.");
  process.exit(0);
}

seed().catch(console.error);
