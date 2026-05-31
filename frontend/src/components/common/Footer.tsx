"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, MapPin, Globe, Mail
} from "lucide-react";
import { 
  FaFacebook, FaInstagram, FaYoutube 
} from "react-icons/fa";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

export default function Footer() {
  const { settings, loading } = useWebsiteSettings();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Courses", href: "#courses" },
    { name: "Facilities", href: "#facilities" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" }
  ];

  const courseLinks = [
    { name: "BPT", href: "#courses" },
    { name: "BMLT", href: "#courses" },
    { name: "DMLT", href: "#courses" },
    { name: "BXRT", href: "#courses" },
    { name: "OT Technician", href: "#courses" }
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-4.5 h-4.5" />, href: settings.facebook || "#", label: "Facebook" },
    { icon: <FaInstagram className="w-4.5 h-4.5" />, href: settings.instagram || "#", label: "Instagram" },
    { icon: <FaYoutube className="w-4.5 h-4.5" />, href: settings.youtube || "#", label: "YouTube" },
    { icon: <Globe className="w-4.5 h-4.5" />, href: settings.website || "#", label: "Website" }
  ];

  const cleanPhone = (phoneStr: string) => phoneStr.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = (whatsappStr: string) => whatsappStr.replace(/[^0-9]/g, "");
  const displayWebsite = (urlStr: string) => urlStr.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <footer className="relative bg-white text-slate-600 font-sans border-t border-brand-cream-350 dark:bg-slate-950 dark:border-slate-900 overflow-hidden">
      {/* Background soft cream gradient and accents */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#FFF8F2] blur-3xl pointer-events-none -z-10 dark:bg-amber-955/5" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-955/5" />
      
      {/* Subtle decorative pattern */}
      <div className="absolute right-6 top-6 opacity-[0.012] bg-[radial-gradient(#9B111E_1px,transparent_1px)] [background-size:16px_16px] w-32 h-32 rounded-full pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-16 sm:py-20 relative z-10">
        
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-start pb-12 sm:pb-16 border-b border-slate-100 dark:border-slate-800">
          
          {/* LEFT: Branding block */}
          <div className="lg:col-span-5 text-left">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton-branding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Branding Skeleton */}
                  <div className="flex items-center space-x-3.5 animate-pulse">
                    <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-200/80 p-0.5 shadow-sm shrink-0" />
                    <div className="flex flex-col space-y-1.5 py-1">
                      <div className="h-4 w-28 bg-slate-200/80 rounded animate-pulse" />
                      <div className="h-3 w-36 bg-slate-150/70 rounded animate-pulse" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
                    Healthcare, Physiotherapy एवं Allied Health Science Education के क्षेत्र में गुणवत्तापूर्ण एवं आधुनिक शिक्षण संस्थान।
                  </p>

                  {/* Social Media Links Skeleton */}
                  <div className="flex items-center space-x-3.5 pt-2 animate-pulse">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="w-10 h-10 rounded-full bg-slate-150/70" />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content-branding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <a href="#hero" className="flex items-center space-x-3.5 group">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#D4A017]/30 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={settings.logoUrl || "/branding/logo.jpeg"}
                        alt={`${settings.instituteName || "Jatashankar Group"} Logo`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                        {settings.instituteName || "Jatashankar"}
                      </h4>
                      <p className="text-[9px] font-bold tracking-widest text-[#9B111E] dark:text-[#D4A017] uppercase leading-none">
                        {settings.footerTagline || settings.instituteNameHindi || "Group of Institute"}
                      </p>
                    </div>
                  </a>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
                    {settings.footerDescription || "Healthcare, Physiotherapy एवं Allied Health Science Education के क्षेत्र में गुणवत्तापूर्ण एवं आधुनिक शिक्षण संस्थान।"}
                  </p>

                  {/* Social Media Links */}
                  <div className="flex items-center space-x-3.5 pt-2">
                    {socialLinks.map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        aria-label={social.label}
                        target={social.href !== "#" ? "_blank" : undefined}
                        rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="w-10 h-10 rounded-full bg-[#FFF8F2] dark:bg-slate-900 border border-[#D4A017]/20 flex items-center justify-center text-[#9B111E] hover:text-white hover:bg-gradient-to-tr hover:from-[#9B111E] hover:to-[#7a0c16] shadow-sm transition-all duration-300"
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COLUMN 1: Quick Links */}
          <div className="lg:col-span-2 text-left">
            <h5 className="font-serif font-extrabold text-sm text-slate-900 dark:text-white tracking-wider uppercase mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-[#D4A017] rounded-full" />
            </h5>
            <ul className="space-y-3 font-semibold text-xs sm:text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-slate-550 dark:text-slate-400 hover:text-[#9B111E] dark:hover:text-[#D4A017] transition-colors duration-250 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]/35 mr-2 shrink-0" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: Courses */}
          <div className="lg:col-span-2 text-left">
            <h5 className="font-serif font-extrabold text-sm text-slate-900 dark:text-white tracking-wider uppercase mb-5 relative inline-block">
              Courses
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-[#D4A017] rounded-full" />
            </h5>
            <ul className="space-y-3 font-semibold text-xs sm:text-sm">
              {courseLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-slate-550 dark:text-slate-400 hover:text-[#9B111E] dark:hover:text-[#D4A017] transition-colors duration-250 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]/35 mr-2 shrink-0" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Contact Info */}
          <div className="lg:col-span-3 text-left space-y-4">
            <h5 className="font-serif font-extrabold text-sm text-slate-900 dark:text-white tracking-wider uppercase mb-5 relative inline-block">
              Contact Info
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-[#D4A017] rounded-full" />
            </h5>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton-contact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3.5 animate-pulse">
                    <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0 mt-0.5" />
                    <div className="h-4 w-48 bg-slate-150/70 rounded mt-1" />
                  </div>
                  <div className="flex items-start space-x-3.5 animate-pulse">
                    <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0 mt-0.5" />
                    <div className="flex flex-col space-y-1.5 w-full">
                      <div className="h-4 w-32 bg-slate-150/70 rounded" />
                      <div className="h-3 w-24 bg-slate-100/60 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3.5 animate-pulse">
                    <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0" />
                    <div className="h-4 w-36 bg-slate-150/70 rounded" />
                  </div>
                  <div className="flex items-center space-x-3.5 animate-pulse">
                    <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0" />
                    <div className="h-4 w-40 bg-slate-150/70 rounded" />
                  </div>
                </motion.div>
              ) : (
                <motion.ul
                  key="content-contact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-xs sm:text-sm font-semibold text-slate-550 dark:text-slate-400"
                >
                  <li className="flex items-start space-x-3.5">
                    <MapPin className="w-5 h-5 text-[#9B111E] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{settings.address || "Balaghat, Madhya Pradesh, India 481001"}</span>
                  </li>
                  <li className="flex items-start space-x-3.5">
                    <Phone className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
                    <div className="flex flex-col space-y-1">
                      <a href={`tel:${cleanPhone(settings.phone || "09926561016")}`} className="hover:text-[#9B111E] dark:hover:text-[#D4A017] font-mono leading-none">
                        {settings.phone || "099265 61016"}
                      </a>
                      {settings.whatsapp && (
                        <a href={`https://wa.me/${cleanWhatsapp(settings.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#9B111E] dark:hover:text-[#D4A017] font-mono leading-none text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <span>WhatsApp Enabled</span>
                        </a>
                      )}
                    </div>
                  </li>
                  <li className="flex items-center space-x-3.5">
                    <Mail className="w-5 h-5 text-[#9B111E] shrink-0" />
                    <a 
                      href={`mailto:${settings.email || "contact@jatashankar.org"}`} 
                      className="hover:text-[#9B111E] dark:hover:text-[#D4A017] font-mono break-all"
                    >
                      {settings.email || "contact@jatashankar.org"}
                    </a>
                  </li>
                  <li className="flex items-center space-x-3.5">
                    <Globe className="w-5 h-5 text-[#D4A017] shrink-0" />
                    <a 
                      href={settings.website || "https://www.jatashankargroup.in"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-[#9B111E] dark:hover:text-[#D4A017] font-mono break-all"
                    >
                      {settings.website ? displayWebsite(settings.website) : "jatashankargroup.in"}
                    </a>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Footer Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 space-y-4 sm:space-y-0 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton-copyright"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-4 w-64 bg-slate-200/80 rounded animate-pulse"
              />
            ) : (
              <motion.p
                key="content-copyright"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center sm:text-left leading-relaxed"
              >
                {settings.footerText || `© ${currentYear} Jatashankar Group of Institute. All Rights Reserved.`}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-center space-x-1.5 text-center leading-none">
            <span>{settings.footerCtaText || "Designed & Developed with ❤️ for Healthcare Education"}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
