/**
 * toast.ts — Centralised toast notification utility for the admin panel.
 *
 * Usage:
 *   import { showToast } from "@/lib/toast";
 *
 *   showToast.success("Course saved successfully!");
 *   showToast.error("Failed to delete record.");
 *   showToast.warning("Unsaved changes detected.");
 *   showToast.info("Refreshing data…");
 *   showToast.loading("Uploading image…");
 *   showToast.promise(myPromise, { loading: "…", success: "Done!", error: "Failed." });
 */

import { toast } from "sonner";

// ── Shared base options ────────────────────────────────────────────────────────
const base = {
  duration: 4000,
  position: "top-right" as const,
};

// ── Typed helper object ────────────────────────────────────────────────────────
export const showToast = {
  /** Green success notification */
  success: (message: string, description?: string) =>
    toast.success(message, { ...base, description }),

  /** Red error notification */
  error: (message: string, description?: string) =>
    toast.error(message, { ...base, description }),

  /** Amber warning notification */
  warning: (message: string, description?: string) =>
    toast.warning(message, { ...base, description }),

  /** Blue info notification */
  info: (message: string, description?: string) =>
    toast.info(message, { ...base, description }),

  /** Spinner loading notification — returns toast ID for dismissal */
  loading: (message: string) =>
    toast.loading(message, { ...base, duration: Infinity }),

  /** Promise-driven notification — auto-resolves to success or error */
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) =>
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }),

  /** Dismiss a specific toast by ID */
  dismiss: (id?: string | number) => toast.dismiss(id),
};
