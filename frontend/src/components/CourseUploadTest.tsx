"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Hash, Clock, FileCheck, FileText, Briefcase, Star, Image as ImageIcon,
  CheckCircle2, AlertCircle, Loader2, PlusCircle
} from "lucide-react";
import { uploadImage } from "../services/cloudinary.service";
import { createCourse } from "../services/course.service";

type UploadStep = "idle" | "cloudinary" | "firestore" | "success";

type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
} as const;

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, icon, children }: InputFieldProps) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function CourseUploadTest() {
  const [courseName, setCourseName] = useState("");
  const [shortName, setShortName] = useState("");
  const [duration, setDuration] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [description, setDescription] = useState("");
  const [careerScope, setCareerScope] = useState("");
  const [featured, setFeatured] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<UploadStep>("idle");
  const [status, setStatus] = useState<StatusState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = currentStep === "cloudinary" || currentStep === "firestore";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(null);

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      setStatus({ type: "error", message: "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "File is too large. Maximum allowed size is 5MB." });
      return;
    }

    setSelectedFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setCourseName("");
    setShortName("");
    setDuration("");
    setEligibility("");
    setDescription("");
    setCareerScope("");
    setFeatured(false);
    setSelectedFile(null);
    setLocalPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName.trim())   { setStatus({ type: "error", message: "Course Name is required." }); return; }
    if (!shortName.trim())    { setStatus({ type: "error", message: "Short Name is required." }); return; }
    if (!duration.trim())     { setStatus({ type: "error", message: "Duration is required." }); return; }
    if (!eligibility.trim())  { setStatus({ type: "error", message: "Eligibility is required." }); return; }
    if (!description.trim())  { setStatus({ type: "error", message: "Description is required." }); return; }
    if (!careerScope.trim())  { setStatus({ type: "error", message: "Career Scope description is required." }); return; }
    if (!selectedFile)        { setStatus({ type: "error", message: "Please upload a course cover image." }); return; }

    setStatus(null);
    setCurrentStep("cloudinary");

    try {
      // Step 1: Upload Image to Cloudinary
      console.log("Course Upload Step 1: Uploading image to Cloudinary...");
      const uploadResult = await uploadImage(selectedFile);

      // Step 2: Save Course Document in Firestore
      setCurrentStep("firestore");
      console.log("Course Upload Step 2: Saving course document to Firestore 'courses' collection...");
      await createCourse({
        courseName: courseName.trim(),
        shortName: shortName.trim(),
        duration: duration.trim(),
        eligibility: eligibility.trim(),
        description: description.trim(),
        careerScope: careerScope.trim(),
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        featured,
      });

      // Step 3: Success
      setCurrentStep("success");
      setStatus({ type: "success", message: "Course Added Successfully ✅" });
      resetForm();
    } catch (error) {
      console.error("Course upload pipeline failure:", error);
      setCurrentStep("idle");
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setStatus({ type: "error", message: `Upload Failed: ${msg}` });
    }
  };

  const inputClass =
    "w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold";

  return (
    <div className="w-full flex justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <motion.div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-900/5 border border-brand-cream-350 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#D4A017]/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-[#9B111E]/5 blur-xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight">
              Add Course Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Upload course cover to Cloudinary and register syllabus & details in the courses database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Course Name + Short Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Field label="Course Name (कोर्स का नाम)" icon={<BookOpen className="w-4 h-4" />}>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor of Physiotherapy"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Short Name" icon={<Hash className="w-4 h-4" />}>
                <input
                  type="text"
                  placeholder="e.g. BPT"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Row 2: Duration + Eligibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Duration (अवधि)" icon={<Clock className="w-4 h-4" />}>
                <input
                  type="text"
                  placeholder="e.g. 4.5 Years"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </Field>

              <Field label="Eligibility (योग्यता)" icon={<FileCheck className="w-4 h-4" />}>
                <input
                  type="text"
                  placeholder="e.g. 10+2 PCB with 50%"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Row 3: Description */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
                Course Description (विवरण)
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea
                  placeholder="Comprehensive description of the syllabus and training..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Row 4: Career Scope */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
                Career Scope (करियर स्कोप)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea
                  placeholder="Job opportunities, clinical roles, higher studies options..."
                  rows={2}
                  value={careerScope}
                  onChange={(e) => setCareerScope(e.target.value)}
                  disabled={isLoading}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Row 5: Featured Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/40 text-left">
              <div className="w-8 h-8 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017] shrink-0">
                <Star className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Featured Course</h4>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Showcase this course in Home/Hero sections</p>
              </div>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  featured ? "bg-[#9B111E]" : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    featured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Row 6: Image Upload */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
                Course Image (कोर्स कवर इमेज)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isLoading}
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">
                  {selectedFile ? selectedFile.name : "Select Cover Photo (JPG/PNG/WEBP, max 5MB)"}
                </span>
              </button>
            </div>

            {/* Local Image Preview */}
            <AnimatePresence>
              {localPreview && (
                <motion.div
                  className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={localPreview} alt="Course preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{selectedFile?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Ready · {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    <span>
                      {currentStep === "cloudinary"
                        ? "Uploading Cover image..."
                        : "Saving Course Data..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Add Course Profile</span>
                    <PlusCircle className="w-4 h-4 transition-transform group-hover:scale-105" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Status Feedback Banner */}
          <AnimatePresence mode="wait">
            {status && (
              <motion.div
                key={status.message}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -8 }}
              >
                {status.type === "success" ? (
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-4 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold leading-relaxed text-left">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-4 flex items-start gap-3 text-red-800 dark:text-red-300 text-xs font-semibold leading-relaxed text-left">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
