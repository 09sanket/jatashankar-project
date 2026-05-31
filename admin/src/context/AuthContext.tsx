"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthState } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  retry: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Synchronously initialize loading state based on presence of a session hint in localStorage.
  // This prevents unnecessary flashing of loading screens when no session is expected.
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("admin_session_active") === "true";
      } catch (e) {
        console.warn("AuthProvider: LocalStorage is inaccessible, defaulting loading to true:", e);
      }
    }
    return true;
  });

  const retry = () => {
    console.log("AuthProvider: Manual connection retry requested.");
    setError(null);
    setLoading(true);
    setRetryCount((prev) => prev + 1);
  };

  useEffect(() => {
    console.log(`AuthProvider: Initializing authorization state observer (Attempt #${retryCount})...`);
    
    const unsubscribe = subscribeToAuthState(
      (firebaseUser) => {
        setUser(firebaseUser);
        setError(null);
        setLoading(false);
        
        try {
          if (firebaseUser) {
            localStorage.setItem("admin_session_active", "true");
          } else {
            localStorage.removeItem("admin_session_active");
          }
        } catch (e) {
          console.warn("AuthProvider: Failed to write session state to localStorage:", e);
        }

        console.log(
          "AuthProvider: Authentication state resolved. Logged In:",
          !!firebaseUser
        );
      },
      (err) => {
        console.error("AuthProvider: Authentication state observer encountered an error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [retryCount]);

  // Performance-optimized context value to prevent wasteful consumer re-renders
  const contextValue = useMemo(() => ({ user, loading, error, retry }), [user, loading, error, retryCount]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
