"use client";

import React from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
}

/**
  * Global Layout wrapper for the administrative dashboard (/dashboard).
  * Wraps all nested dashboard routes with ProtectedRoute to enforce layout-level authentication.
  */
export default function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
