"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firestore";

type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

const messageVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
} as const;

export default function FirebaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      await addDoc(collection(db, "testConnection"), {
        message: "Firebase Connected Successfully",
        createdAt: new Date(),
      });

      setStatus({
        type: "success",
        message: "Firebase Connected Successfully ✅",
      });
    } catch (error) {
      console.error("Firebase connection test failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred.";

      setStatus({
        type: "error",
        message: `Firebase connection failed: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-xl bg-white rounded-2xl shadow-lg shadow-slate-900/5 border border-brand-cream-350 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 tracking-tight">
              Firebase Connection Test
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Click the button below to test Firestore database connection.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-red-500 to-brand-red-700 shadow-md shadow-red-900/15 hover:shadow-lg hover:shadow-red-900/20 hover:from-brand-red-600 hover:to-brand-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="inline-flex items-center gap-2">
                {isLoading && (
                  <span className="h-4 w-4 rounded-full border-[2px] border-white/40 border-t-white animate-spin" />
                )}
                <span>{isLoading ? "Testing..." : "Test Firebase"}</span>
              </span>
            </button>
          </div>

          {status && (
            <motion.div
              className="mt-4"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              {status.type === "success" ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
                  {status.message}
                </div>
              ) : (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                  {status.message}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

