"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, ChevronRight, Phone } from "lucide-react";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

export default function Header() {
  const { settings, loading } = useWebsiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px -60% 0px" }
    );
    const sections = ["hero", "about", "courses", "facilities", "gallery", "placement", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: "Home",       href: "#hero",      id: "hero"      },
    { name: "About",      href: "#about",     id: "about"     },
    { name: "Courses",    href: "#courses",   id: "courses"   },
    { name: "Facilities", href: "#facilities",id: "facilities"},
    { name: "Gallery",    href: "#gallery",   id: "gallery"   },
    { name: "Placement",  href: "#placement", id: "placement" },
    { name: "Contact",    href: "#contact",   id: "contact"   },
  ];

  const cleanPhone     = (s: string) => s.replace(/[^0-9+]/g, "");
  const cleanWhatsapp  = (s: string) => s.replace(/[^0-9]/g, "");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "py-2 bg-white/97 backdrop-blur-md border-slate-100 shadow-md"
          : "py-3 bg-white border-slate-100 shadow-sm"
      }`}
    >
      {/* ─── Desktop bar: 3-column grid 20 / 60 / 20 ─── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full hidden lg:grid lg:grid-cols-[20%_60%_20%] items-center">

        {/* COL 1 — Logo (left 20%) */}
        <a href="#" className="flex items-center gap-3 group shrink-0 w-max">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-slate-150 rounded animate-pulse" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                className="flex items-center gap-3">
                {/* Logo image — bigger */}
                <div className="relative overflow-hidden rounded-xl border border-slate-150 bg-white p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-[1.04] shrink-0"
                  style={{ width: 58, height: 58 }}>
                  <Image
                    src={settings.logoUrl || "/branding/logo.jpeg"}
                    alt="Logo"
                    width={58}
                    height={58}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
                {/* Institute name — bigger */}
                <div className="flex flex-col justify-center leading-none gap-1.5">
                  <span className="font-serif font-extrabold text-[19px] tracking-tight text-[#C91D1D] uppercase leading-none">
                    जटाशंकर
                  </span>
                  <span className="text-[11px] font-sans font-bold tracking-wide text-[#C91D1D]/80 leading-none">
                    ग्रुप ऑफ इंस्टीट्यूट · बालाघाट
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </a>

        {/* COL 2 — Nav Links (center 60%, truly centered) */}
        <nav className="flex items-center justify-center gap-5 xl:gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative group py-1.5 text-[11px] xl:text-[12px] font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-200 ${
                  isActive ? "text-[#C91D1D]" : "text-slate-600 hover:text-[#C91D1D]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-[#C91D1D] rounded-full transition-all duration-300 ${
                    isActive ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* COL 3 — Action Buttons (right 20%) */}
        <div className="flex items-center justify-end gap-3 pr-2">
          {/* Call — icon only */}
          <a
            href={`tel:${cleanPhone(settings.phone || "+917636255893")}`}
            title="Call Us"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#C91D1D]/50 rounded-full text-[#C91D1D] hover:bg-[#C91D1D]/8 transition-all duration-200"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* WhatsApp — icon only */}
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp(settings.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="inline-flex items-center justify-center w-9 h-9 border border-[#25D366]/50 rounded-full text-[#25D366] hover:bg-[#25D366]/8 transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.024-5.124-2.887-6.99C16.576 1.832 14.09 3.088 11.45 3.088h-.008C6.005 3.088 1.58 7.502 1.577 12.953c-.002 1.705.447 3.37 1.299 4.843l-.986 3.6 3.69-.968zm13.18-8.156c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </a>
          )}

          {/* Admission — text pill */}
          <a
            href="#enquiry"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#C91D1D] hover:bg-[#b01717] text-white rounded-full text-[11px] font-bold uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap"
          >
            Admission Open
          </a>
        </div>
      </div>

      {/* ─── Mobile bar ─── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between lg:hidden">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-slate-150 bg-white p-0.5 shadow-sm shrink-0">
            <Image
              src={settings.logoUrl || "/branding/logo.jpeg"}
              alt="Logo"
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col justify-center leading-none gap-0.5">
            <span className="font-serif font-extrabold text-sm tracking-tight text-[#C91D1D] uppercase leading-none">
              जटाशंकर
            </span>
            <span className="text-[8px] font-sans font-bold text-[#C91D1D]/70 leading-none">
              ग्रुप ऑफ इंस्टीट्यूट · बालाघाट
            </span>
          </div>
        </a>

        {/* Mobile right controls */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${cleanPhone(settings.phone || "+917636255893")}`}
            className="inline-flex items-center justify-center w-9 h-9 border border-slate-200 rounded-full text-slate-700 bg-white shadow-sm"
            aria-label="Call Us"
          >
            <Phone className="w-4 h-4" />
          </a>
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp(settings.whatsapp)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 border border-[#25D366]/40 rounded-full text-[#25D366] bg-white shadow-sm"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.024-5.124-2.887-6.99C16.576 1.832 14.09 3.088 11.45 3.088h-.008C6.005 3.088 1.58 7.502 1.577 12.953c-.002 1.705.447 3.37 1.299 4.843l-.986 3.6 3.69-.968zm13.18-8.156c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </a>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-800 bg-white shadow-sm"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-slate-200 bg-white overflow-hidden shadow-lg"
          >
            <div className="px-6 py-4 flex flex-col">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider py-3 border-b border-slate-100 last:border-0 ${
                      isActive ? "text-[#C91D1D]" : "text-slate-600 hover:text-[#C91D1D]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                );
              })}
              <a
                href="#enquiry"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full text-center px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-white bg-[#C91D1D] hover:bg-[#b01717] shadow-md flex items-center justify-center gap-2"
              >
                <span>Admission Open</span>
                <GraduationCap className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
