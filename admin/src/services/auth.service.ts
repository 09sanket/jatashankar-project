import { 
  signInWithEmailAndPassword, 
  signOut, 
  User, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase/auth";

// Local development mock credentials and state management
const listeners = new Set<(user: User | null) => void>();
let mockUser: User | null = null;

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("mock_admin_user");
    if (saved) {
      mockUser = JSON.parse(saved) as User;
    }
  } catch (e) {
    console.warn("auth.service: LocalStorage read failed:", e);
  }
}

/**
 * Signs in an admin user using email and password.
 * Supports local developer credentials override (admin@jatashankar.in / admin123)
 * as well as real Firebase Authentication.
 * 
 * @param email Admin email address
 * @param password Admin password
 * @returns A promise resolving to the signed-in User object
 */
export async function loginAdmin(email: string, password: string): Promise<User> {
  // Developer override credentials
  if (email === "admin@jatashankar.in" && password === "admin123") {
    console.log("Developer override login detected. Bypassing Firebase Auth...");
    const mock = { 
      email, 
      uid: "mock-admin-uid", 
      emailVerified: true,
      displayName: "Administrator"
    } as unknown as User;
    
    mockUser = mock;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mock_admin_user", JSON.stringify(mock));
      } catch (e) {
        console.warn("auth.service: LocalStorage write failed:", e);
      }
    }
    
    // Notify all active subscribers
    listeners.forEach((cb) => cb(mock));
    return mock;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase auth loginAdmin failure:", error);
    throw error;
  }
}

/**
 * Signs out the currently active admin session.
 * 
 * @returns A promise that resolves when sign-out is complete
 */
export async function logoutAdmin(): Promise<void> {
  if (mockUser) {
    console.log("Logging out developer override session...");
    mockUser = null;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("mock_admin_user");
      } catch (e) {
        console.warn("auth.service: LocalStorage remove failed:", e);
      }
    }
    listeners.forEach((cb) => cb(null));
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase auth logoutAdmin failure:", error);
    throw error;
  }
}

/**
 * Returns the currently signed-in User, or null if no user session is active.
 * 
 * @returns The current Firebase User object or null
 */
export function getCurrentAdmin(): User | null {
  if (mockUser) return mockUser;
  return auth.currentUser;
}

/**
 * Subscribes to the authentication state changes.
 * Handy for setting up reactive contexts or stores (e.g., Zustand/React).
 * 
 * @param callback Callback triggered on user authentication change
 * @returns An unsubscribe function to clean up the listener
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void,
  error?: (error: Error) => void
): () => void {
  // If there's an active mock user session, immediately trigger the callback
  if (mockUser) {
    callback(mockUser);
  }

  listeners.add(callback);

  // Subscribe to real Firebase Authentication states
  const unsubscribeFirebase = onAuthStateChanged(
    auth, 
    (firebaseUser) => {
      // Do not overwrite the local mock session state with null if active
      if (!mockUser) {
        callback(firebaseUser);
      }
    }, 
    error
  );

  return () => {
    listeners.delete(callback);
    unsubscribeFirebase();
  };
}
