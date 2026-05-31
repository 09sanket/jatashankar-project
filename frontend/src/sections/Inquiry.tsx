"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Phone, Mail, CheckCircle2, User, Send, GraduationCap, Clock, Loader2, AlertCircle } from "lucide-react";
import { slideUp } from "../animations/transitions";
import { createEnquiry } from "../services/enquiry.service";

interface InquiryFormInputs {
  name: string;
  phone: string;
  email: string;
  course: string;
}

export default function Inquiry() {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryFormInputs>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: "BPT (Bachelor of Physiotherapy)"
    }
  });

  const onSubmit = async (data: InquiryFormInputs) => {
    // 1. Prevent duplicate rapid submissions (60 seconds cooldown)
    const lastSubmitTime = localStorage.getItem("inquiry_section_cooldown");
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
      // 2. Trim all string inputs
      const trimmedName = data.name.trim();
      const trimmedPhone = data.phone.trim();
      const trimmedEmail = data.email.trim();

      if (!trimmedName || !trimmedPhone || !trimmedEmail) {
        throw new Error("All required fields must be non-empty.");
      }

      await createEnquiry({
        fullName: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        course: data.course,
        city: "N/A",
        message: "Website Inquiry Section Submission",
      });

      // 3. Set submit cooldown timestamp on success
      localStorage.setItem("inquiry_section_cooldown", Date.now().toString());

      setInquirySubmitted(true);
      showToast("Inquiry submitted successfully!", "success");
      reset();
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred.";
      setSubmitError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Madhya Pradesh Paramedical Council se recognized classes",
    "Modern diagnostic labs aur high-fidelity practical research tools",
    "100% placement guidance aur clinical training programs",
    "Experienced medical mentors aur regular workshops"
  ];

  return (
    <section 
      id="enquiry" 
      className="relative py-20 lg:py-28 overflow-hidden bg-brand-cream-50 dark:bg-slate-950 border-b border-brand-cream-350 dark:border-slate-800/60"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#D4A017]/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10" />

      {/* Decorative dot pattern */}
      <div className="absolute left-6 top-10 opacity-[0.015] bg-[radial-gradient(#9B111E_1px,transparent_1px)] [background-size:20px_20px] w-48 h-48 pointer-events-none -z-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-start">
          
          {/* ===================================================
              LEFT SIDE: INFO AREA & HELPLINES
              =================================================== */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-3">
              {/* Section Tag */}
              <div className="inline-block relative">
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
                  ADMISSIONS 2026-2027
                </span>
                <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-[#9B111E] rounded-full" />
              </div>

              {/* Heading */}
              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight pt-2">
                Start Your <span className="text-[#9B111E]">Medical</span> Career
              </h2>

              {/* Hindi Subheading */}
              <h3 className="font-serif font-semibold text-base sm:text-lg text-[#9B111E] tracking-wide">
                अपने सपनों को दें चिकित्सा क्षेत्र में नई उड़ान
              </h3>
            </div>

            {/* Description */}
            <p className="font-sans text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Jatashankar Group of Institutions, Balaghat dynamic learning environment provide karta hai. Fill the inquiry form today to discuss fee structures, curriculum details, and scholarship opportunities with our counselors.
            </p>

            {/* Value checklist */}
            <div className="space-y-4">
              {benefits.map((text, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-[#9B111E] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Helpline Contact block */}
            <div className="p-6 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm max-w-xl flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F2] dark:bg-slate-950 border border-[#D4A017]/25 flex items-center justify-center text-[#9B111E] shrink-0">
                  <Phone className="w-5 h-5 text-[#9B111E]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Helpline Number</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">Talk with Admissions Dean</p>
                </div>
              </div>
              <div className="sm:border-l border-brand-cream-350 dark:border-slate-800 sm:pl-6 flex items-center">
                <a 
                  href="tel:+917636255893" 
                  className="font-mono text-base sm:text-lg font-bold text-[#9B111E] hover:underline"
                >
                  +91 7636-255893
                </a>
              </div>
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDE: DYNAMIC FORM CARD
              =================================================== */}
          <div className="lg:col-span-6 w-full">
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 sm:p-10 rounded-[2.5rem] border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg relative overflow-hidden text-left"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D4A017]" />

              <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2">
                Inquiry Form (पूछताछ फॉर्म)
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-semibold">
                Submit details below to schedule a counseling session and receive brochures.
              </p>

              <AnimatePresence mode="wait">
                {!inquirySubmitted ? (
                  <motion.form
                    key="inquiry-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Full Name (पूरा नाम)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          {...register("name", {
                            required: "Full name is required",
                            validate: val => val.trim().length >= 2 || "Full name must be at least 2 characters"
                          })}
                          className={`w-full px-4 py-3.5 pl-11 rounded-2xl border bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                            errors.name ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                          }`}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Phone Number (मोबाइल)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            {...register("phone", {
                              required: "Mobile number is required",
                              validate: val => /^[0-9]{10}$/.test(val.trim()) || "Please enter a valid 10-digit mobile number"
                            })}
                            className={`w-full px-4 py-3.5 pl-11 rounded-2xl border bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                              errors.phone ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                            }`}
                          />
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        </div>
                        {errors.phone && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Email Address (ईमेल)
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="e.g. rahul@example.com"
                            {...register("email", {
                              required: "Email address is required",
                              validate: val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()) || "Please enter a valid email address"
                            })}
                            className={`w-full px-4 py-3.5 pl-11 rounded-2xl border bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold ${
                              errors.email ? "border-red-400 focus:ring-red-100" : "border-brand-cream-350 dark:border-slate-800"
                            }`}
                          />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        </div>
                        {errors.email && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Course Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Program of Interest (कोर्स चुनें)
                      </label>
                      <div className="relative">
                        <select
                          {...register("course", { required: "Please select a course" })}
                          className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold appearance-none cursor-pointer"
                        >
                          <option>BPT (Bachelor of Physiotherapy)</option>
                          <option>BMLT (Bachelor of Medical Lab Technology)</option>
                          <option>DMLT (Diploma in Medical Lab Technology)</option>
                          <option>BXRT (Bachelor in X-Ray Technology)</option>
                          <option>OT TECHNICIAN (Operation Theatre Technician)</option>
                        </select>
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Error display */}
                    {submitError && (
                      <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-[11px] font-bold text-red-600 dark:text-red-400">{submitError}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center space-x-2.5 px-6 py-4 bg-[#9B111E] hover:bg-[#7a0c16] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-sans font-bold uppercase tracking-wider text-xs rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 mt-2 group cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiry / पूछताछ भेजें</span>
                          <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif font-extrabold text-2xl text-slate-900 dark:text-slate-100">
                        Inquiry Submitted!
                      </h4>
                      <p className="text-sm font-semibold text-[#9B111E] dark:text-[#D4A017]">
                        Aapki details successfully register ho chuki hain.
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-semibold">
                      Admissions Desk team dynamic counseling aur course pamphlets share karne ke liye aapse bohot jald phone/email par contact karegi.
                    </p>
                    <button
                      onClick={() => {
                        setInquirySubmitted(false);
                        setSubmitError(null);
                        reset();
                      }}
                      className="inline-flex items-center space-x-2 px-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Back to Form</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toast Notification */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-bold ${
                      toast.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {toast.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{toast.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
