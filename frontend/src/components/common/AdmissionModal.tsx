"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { 
  X, User, Phone, Mail, GraduationCap, MapPin, MessageSquare, CheckCircle2, Loader2, Sparkles
} from "lucide-react";
import { useModal } from "../../context/ModalContext";
import CallButton from "./CallButton";
import { createEnquiry } from "../../services/enquiry.service";

interface FormInputs {
  name: string;
  phone: string;
  email: string;
  course: string;
  city: string;
  message: string;
  agree: boolean;
}

export default function AdmissionModal() {
  const { isModalOpen, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: "BPT",
      city: "",
      message: "",
      agree: false
    }
  });

  const onSubmit = async (data: FormInputs) => {
    // 1. Prevent duplicate rapid submissions (60 seconds cooldown)
    const lastSubmitTime = localStorage.getItem("enquiry_cooldown");
    if (lastSubmitTime) {
      const secondsPassed = Math.floor((Date.now() - Number(lastSubmitTime)) / 1000);
      if (secondsPassed < 60) {
        const remainingSeconds = 60 - secondsPassed;
        const cooldownMsg = `Please wait ${remainingSeconds} seconds before another submission.`;
        setSubmitError(cooldownMsg);
        showToast(cooldownMsg, "error");
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // 2. Trim string input values to eliminate empty spaces and clean payloads
      const trimmedName = data.name.trim();
      const trimmedPhone = data.phone.trim();
      const trimmedEmail = data.email.trim();
      const trimmedCity = data.city.trim();
      const trimmedMessage = data.message.trim();

      if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedCity) {
        throw new Error("All required fields must be non-empty.");
      }

      await createEnquiry({
        fullName: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        course: data.course,
        city: trimmedCity,
        message: trimmedMessage || "Website Admission Modal Inquiry",
      });
      
      // 3. Set submit cooldown timestamp on success
      localStorage.setItem("enquiry_cooldown", Date.now().toString());

      setSubmitSuccess(true);
      showToast("Enquiry logged successfully!", "success");
      reset();
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred.";
      setSubmitError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    // Delay resetting states until animation ends
    setTimeout(() => {
      setSubmitSuccess(false);
      setSubmitError(null);
      reset();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-brand-cream-350 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT SIDE: Branding Panel (Desktop Only) */}
            <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-[#FFF8F2] to-[#FFF8F2]/40 dark:from-slate-950 dark:to-slate-900 p-8 flex-col justify-between border-r border-brand-cream-350 dark:border-slate-850 relative text-left">
              {/* Subtle background glow */}
              <div className="absolute top-1/4 right-0 w-32 h-32 rounded-full bg-[#D4A017]/5 blur-2xl pointer-events-none" />

              <div className="space-y-6 relative z-10 pt-4">
                {/* Branding Brand logo */}
                <div className="flex items-center space-x-3">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#D4A017]/30 shadow-md">
                    <Image
                      src="/branding/logo.jpeg"
                      alt="Jatashankar Logo"
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      Jatashankar
                    </h4>
                    <p className="text-[8px] font-bold tracking-widest text-[#9B111E] uppercase leading-none mt-0.5">
                      Group of Institute
                    </p>
                  </div>
                </div>

                {/* Promotional copy */}
                <div className="space-y-3.5">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#9B111E]/10 text-[9px] font-bold text-[#9B111E] dark:text-[#D4A017] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>Admissions Open 2026</span>
                  </span>
                  <h3 className="font-serif font-extrabold text-2xl text-slate-900 dark:text-white leading-snug">
                    Admission Enquiry Form
                  </h3>
                  <p className="font-serif font-semibold text-xs text-[#9B111E] tracking-wide leading-relaxed">
                    अपने उज्जवल मेडिकल करियर की शुरुआत आज ही करें
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    हमारी टीम आपसे जल्द संपर्क करेगी और एडमिशन प्रक्रिया में सहायता करेगी।
                  </p>
                </div>
              </div>

              {/* Bottom Decorative graphic */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3 text-left">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#9B111E] shrink-0" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-350 font-semibold">Recognized Paramedical Curricula</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#D4A017] shrink-0" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-350 font-semibold">100% Practical Exposure Placement Support</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Form Panel */}
            <div className="col-span-1 md:col-span-7 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto max-h-[80vh] md:max-h-full">
              
              {/* Responsive Header for Mobile Only */}
              <div className="md:hidden text-center space-y-2 mb-6">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#D4A017]/30 mx-auto shadow-md">
                  <Image
                    src="/branding/logo.jpeg"
                    alt="Jatashankar Logo"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif font-extrabold text-xl text-slate-900 dark:text-white">
                  Admission Enquiry Form
                </h3>
                <p className="font-serif font-semibold text-[11px] text-[#9B111E] tracking-wide">
                  अपने उज्जवल मेडिकल करियर की शुरुआत आज ही करें
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="modal-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 text-left"
                  >
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Full Name (पूरा नाम)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          {...register("name", { 
                              required: "Full name is required",
                              validate: val => val.trim().length >= 2 || "Full name must be at least 2 characters and not empty"
                            })}
                          className={`w-full px-4 py-3 pl-11 rounded-2xl border text-xs sm:text-sm bg-brand-cream-50/10 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                            errors.name ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                          }`}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email + Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Mobile Number (मोबाइल)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="Enter your mobile number"
                            {...register("phone", { 
                              required: "Mobile number is required",
                              validate: val => /^[0-9]{10}$/.test(val.trim()) || "Please enter a valid 10-digit mobile number"
                            })}
                            className={`w-full px-4 py-3 pl-11 rounded-2xl border text-xs sm:text-sm bg-brand-cream-50/10 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                              errors.phone ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                            }`}
                          />
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        {errors.phone && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Email Address (ईमेल)
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", { 
                              required: "Email address is required",
                              validate: val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()) || "Please enter a valid email address"
                            })}
                            className={`w-full px-4 py-3 pl-11 rounded-2xl border text-xs sm:text-sm bg-brand-cream-50/10 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                              errors.email ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                            }`}
                          />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        {errors.email && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Course Selection + City Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Course */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Select Course (कोर्स)
                        </label>
                        <div className="relative">
                          <select
                            {...register("course", { required: "Please select a course" })}
                            className="w-full px-4 py-3 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/10 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold appearance-none cursor-pointer"
                          >
                            <option value="BPT">BPT (Physiotherapy)</option>
                            <option value="BMLT">BMLT (Lab Technology)</option>
                            <option value="DMLT">DMLT (Lab Diploma)</option>
                            <option value="BXRT">BXRT (X-Ray Technology)</option>
                            <option value="OT Technician">OT Technician</option>
                          </select>
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* City / District */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          City / District (शहर / जिला)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter your city"
                            {...register("city", { 
                              required: "City is required",
                              validate: val => val.trim().length >= 2 || "City must be at least 2 characters and not empty"
                            })}
                            className={`w-full px-4 py-3 pl-11 rounded-2xl border text-xs sm:text-sm bg-brand-cream-50/10 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                              errors.city ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                            }`}
                          />
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        {errors.city && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.city.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Query Message */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Message / Query (प्रश्न / संदेश)
                      </label>
                      <div className="relative">
                        <textarea
                          placeholder="Write your query here..."
                          rows={2.5}
                          {...register("message")}
                          className="w-full px-4 py-2.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/10 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold resize-none"
                        />
                        <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="space-y-1">
                      <div className="flex items-start space-x-2.5">
                        <input
                          type="checkbox"
                          id="agree-checkbox"
                          {...register("agree", { required: "You must agree to the terms to proceed" })}
                          className="w-4 h-4 rounded text-[#9B111E] border-slate-300 focus:ring-[#9B111E]/20 mt-0.5 accent-[#9B111E] cursor-pointer"
                        />
                        <label htmlFor="agree-checkbox" className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-450 font-semibold cursor-pointer select-none leading-tight">
                          I agree to be contacted regarding admission and course information.
                        </label>
                      </div>
                      {errors.agree && (
                        <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.agree.message}</p>
                      )}
                    </div>

                    {submitError && (
                      <p className="text-[11px] font-bold text-red-500 text-center bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 p-2.5 rounded-xl">
                        {submitError}
                      </p>
                    )}

                    {/* Action buttons (Submit + Call Now) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5">
                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-[#9B111E] to-[#7a0c16] hover:from-[#7a0c16] hover:to-[#9B111E] disabled:from-slate-400 disabled:to-slate-400 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Enquiry</span>
                        )}
                      </button>

                      {/* Call Now */}
                      <CallButton phoneNumber="9926561016" className="w-full py-3.5" />
                    </div>

                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-10 text-center space-y-5"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                        Enquiry Submitted Successfully ✅
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold text-[#9B111E] dark:text-[#D4A017]">
                        हमारी टीम जल्द ही आपसे संपर्क करेगी।
                      </p>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-semibold">
                      Your query has been logged. Our student advisor will call or email you soon with the requested course guidelines and fee schedules.
                    </p>
                    <button
                      onClick={handleClose}
                      className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Close Window</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Custom Toast Notification System */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2.5 px-4.5 py-3 rounded-2xl shadow-xl border text-xs font-bold uppercase tracking-wider ${
                    toast.type === "success" 
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-250 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-450" />
                  <span>{toast.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
