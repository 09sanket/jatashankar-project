"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWebsiteSettings } from "./WebsiteSettingsContext";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useWebsiteSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    // Lock scroll on body
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Restore scroll on body
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Resolve clicked element to the nearest anchor or button wrapper
      const clickTarget = target.closest("a, button") as HTMLElement | null;
      if (!clickTarget) return;

      const text = clickTarget.textContent?.trim().toLowerCase() || "";
      const href = clickTarget.getAttribute("href") || "";

      // 1. Check for Call Now triggers
      const callLabels = ["call now", "contact now", "phone", "call us"];
      const isCallButton = callLabels.some(label => text.includes(label)) || href.startsWith("tel:");

      if (isCallButton) {
        e.preventDefault();
        e.stopPropagation();
        const rawPhone = settings?.phone || "9926561016";
        const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");
        window.location.href = `tel:${cleanPhone}`;
        return;
      }

      // 2. Check for Admission / Enquiry triggers
      const admissionLabels = ["admission open", "apply now", "enquiry now", "enquire now", "admission", "register now"];
      const isAdmissionButton = admissionLabels.some(label => text.includes(label)) || href === "#enquiry";

      if (isAdmissionButton) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      }
    };

    // Attach listener with capturing phase to intercept before target elements execute scroll or default actions
    document.addEventListener("click", handleGlobalClick, true);
    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [settings?.phone, openModal]);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
