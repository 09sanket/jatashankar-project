"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AuthErrorFallback from "./AuthErrorFallback";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, error, retry } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";
  const isRootRoute = pathname === "/";

  useEffect(() => {
    // Wait until the authentication state is fully loaded
    if (loading || error) return;

    if (!user && (isDashboardRoute || isRootRoute)) {
      console.log("ProtectedRoute: Unauthorized access attempt, redirecting to /login...");
      router.replace("/login");
    } else if (user && (isLoginRoute || isRootRoute)) {
      console.log("ProtectedRoute: Active session detected on guest path, redirecting to /dashboard...");
      router.replace("/dashboard");
    }
  }, [user, loading, error, router, pathname, isDashboardRoute, isLoginRoute, isRootRoute]);

  // Render an enterprise-grade error fallback UI if the auth state fails to load or resolves to an error state
  if (error) {
    return <AuthErrorFallback error={error} onRetry={retry} />;
  }

  // Render a premium loading state while authentication state is resolving
  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative min-h-screen bg-gradient-to-tr from-[#FFFDF9] via-[#FAF6EE] to-[#F3EDE0] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4"
        >
          {/* Subtle brand color background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center space-y-4 relative z-10">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-[#9B111E] animate-spin" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4.5 h-4.5 text-[#D4A017] animate-pulse" />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <h4 className="font-serif font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                Securing Connection
              </h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                Please wait...
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Prevent flicker/flash of protected dashboard contents for unauthorized users during redirect transition
  if (!user && (isDashboardRoute || isRootRoute)) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#9B111E] animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Redirecting to login portal...
          </p>
        </div>
      </div>
    );
  }

  // Prevent flicker/flash of guest login page for authenticated users during redirect transition
  if (user && (isLoginRoute || isRootRoute)) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#9B111E] animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Session-safe route rendering
  return <>{children}</>;
}
