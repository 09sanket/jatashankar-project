"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle, Sparkles, Building2 } from "lucide-react";
import { loginAdmin } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
} as const;

const elementVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect to dashboard if session is already active
  useEffect(() => {
    if (!loading && user) {
      console.log("LoginPage: Active session detected, redirecting to /dashboard...");
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate concurrent submissions
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Email address is required.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Password is required.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting authentication via auth.service...");
      await loginAdmin(trimmedEmail, password);
      console.log("Authentication successful, redirecting to /dashboard...");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login attempt failure:", error);
      let localizedMsg = "Login failed. Please check your credentials and try again.";
      if (error instanceof Error) {
        const msg = error.message;
        if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
          localizedMsg = "Invalid email or password.";
        } else if (msg.includes("auth/invalid-email")) {
          localizedMsg = "Invalid email address format.";
        } else if (msg.includes("auth/user-disabled")) {
          localizedMsg = "This administrator account has been disabled.";
        } else if (msg.includes("auth/too-many-requests")) {
          localizedMsg = "Too many failed login attempts. Access temporarily locked. Please try again later.";
        } else if (msg.includes("auth/network-request-failed")) {
          localizedMsg = "Network connection error. Please check your internet connection and try again.";
        } else {
          localizedMsg = msg;
        }
      }
      setErrorMsg(localizedMsg);
      setIsLoading(false);
    }
  };


  return (
    <main className="w-full">
      <motion.div
        className="relative min-h-screen bg-gradient-to-tr from-[#FFFDF9] via-[#FAF6EE] to-[#F3EDE0] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative Branding Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#D4A017]/5 blur-[8rem] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#9B111E]/5 blur-[8rem] pointer-events-none" />

        {/* Grid Pattern backdrop overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#9B111E_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

        <motion.div
          className="w-full max-w-[27rem] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/5 border border-brand-cream-350 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden"
          variants={cardVariants}
        >
          {/* Decorative Golden Corner Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4A017]/10 to-transparent blur-md pointer-events-none" />

          <div className="flex flex-col items-center space-y-6">
            {/* Logo Brand Frame */}
            <motion.div 
              className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-md border-2 border-brand-cream-350 dark:border-slate-800 bg-[#FFF8F2] flex items-center justify-center p-1 group hover:border-[#D4A017]/40 transition-colors duration-300"
              variants={elementVariants}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/assets/branding/logo.jpeg"
                  alt="Jatashankar Group of Institute Logo"
                  fill
                  priority
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Heading Info */}
            <motion.div className="space-y-1.5 text-center" variants={elementVariants}>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#9B111E]/5 border border-[#9B111E]/10 text-[#9B111E] dark:text-[#E25C65] font-bold text-[9px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Admin Portal Access</span>
              </div>
              <h1 className="text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight pt-1.5">
                Admin Login
              </h1>
              <p className="text-xs text-slate-550 dark:text-slate-400 font-serif font-bold uppercase tracking-wider">
                Jatashankar Group of Institute
              </p>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleLogin} 
              className="w-full space-y-4 pt-2"
              variants={elementVariants}
            >
              {/* Input field Email */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@jatashankar.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                    className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Input field Password */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest pl-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#9B111E] to-[#7a0c16] hover:from-[#7a0c16] hover:to-[#9B111E] disabled:from-slate-400 disabled:to-slate-400 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                      <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:scale-110 text-[#D4A017]" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            {/* Feedback error notice board */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  variants={elementVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -4 }}
                  className="w-full rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 p-4 flex items-start gap-3 text-red-800 dark:text-red-300 text-xs font-semibold leading-relaxed text-left"
                >
                  <AlertCircle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Institutional footer indicator */}
        <motion.p 
          className="mt-8 text-[10px] font-bold text-slate-450 dark:text-slate-600 uppercase tracking-widest flex items-center gap-1.5"
          variants={elementVariants}
        >
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Secured Connection · Institutional Grid</span>
        </motion.p>
      </motion.div>
    </main>
  );
}
