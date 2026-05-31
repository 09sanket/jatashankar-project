"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, PlusCircle, FolderKanban, Type, FileText 
} from "lucide-react";
import { uploadImage } from "../services/cloudinary.service";
import { createGalleryItem } from "../services/gallery.service";

type UploadStep = "idle" | "cloudinary" | "firestore" | "success";

type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

const categories = [
  "Campus",
  "Laboratories",
  "Clinical Training",
  "Student Activities",
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
} as const;

export default function GalleryUploadTest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Campus");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState<UploadStep>("idle");
  const [status, setStatus] = useState<StatusState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(null);

    // Validation (matching allowed specifications)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setStatus({
        type: "error",
        message: "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.",
      });
      setSelectedFile(null);
      setLocalPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: "error",
        message: "File is too large. Maximum allowed size is 5MB.",
      });
      setSelectedFile(null);
      setLocalPreview(null);
      return;
    }

    setSelectedFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  // 2. Submit pipeline handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field checks
    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required." });
      return;
    }
    if (!description.trim()) {
      setStatus({ type: "error", message: "Description is required." });
      return;
    }
    if (!category) {
      setStatus({ type: "error", message: "Please select a category." });
      return;
    }
    if (!selectedFile) {
      setStatus({ type: "error", message: "Please select an image file to upload." });
      return;
    }

    setStatus(null);
    setCurrentStep("cloudinary");

    try {
      // STEP 1: Upload image to Cloudinary
      console.log("Gallery Upload Step 1: Dispatching to Cloudinary unsigned upload CDN...");
      const cloudinaryResult = await uploadImage(selectedFile);

      // STEP 2: Save metadata and CDN details to Firestore
      setCurrentStep("firestore");
      console.log("Gallery Upload Step 2: Saving metadata to Firestore 'gallery' collection...");
      await createGalleryItem({
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
      });

      // STEP 3: Confirm success and reset form
      setCurrentStep("success");
      setStatus({
        type: "success",
        message: "Gallery Item Uploaded Successfully ✅",
      });

      // Clear input fields
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setLocalPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Gallery upload pipeline failure:", error);
      setCurrentStep("idle");
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setStatus({
        type: "error",
        message: `Upload Pipeline Failed: ${errorMessage}`,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isLoading = currentStep === "cloudinary" || currentStep === "firestore";

  return (
    <div className="w-full flex justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 min-h-[500px]">
      <motion.div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-900/5 border border-brand-cream-350 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative subtle background accents */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#D4A017]/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-[#9B111E]/5 blur-xl pointer-events-none" />

        <div className="space-y-6 relative z-10 text-left">
          {/* Header */}
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Gallery Item
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Upload images to Cloudinary and register metadata in the Firestore gallery collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                Title (शीर्षक)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Modern Biology Laboratory"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 dark:border-slate-805 bg-slate-50/20 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold"
                />
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                Description (विवरण)
              </label>
              <div className="relative">
                <textarea
                  placeholder="e.g. Equipped with state of the art equipment and teaching kits."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 dark:border-slate-805 bg-slate-50/20 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold resize-none"
                />
                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Category Dropdown & Custom Image Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Category (श्रेणी)
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 dark:border-slate-805 bg-slate-50/20 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/15 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <FolderKanban className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Image Input Box */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Image File (छवि चुनें)
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
                  onClick={triggerFileInput}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span className="truncate">
                    {selectedFile ? selectedFile.name : "Select Image File"}
                  </span>
                </button>
              </div>
            </div>

            {/* Local Selection Thumbnail Preview */}
            <AnimatePresence>
              {localPreview && (
                <motion.div
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 p-3.5 flex items-center gap-4"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={localPreview}
                      alt="Selection preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-655 dark:text-slate-300 truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                      Ready to Upload (Size: {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB)
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Action Block */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-[#9B111E] to-[#7a0c16] hover:from-[#7a0c16] hover:to-[#9B111E] disabled:from-slate-400 disabled:to-slate-400 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {currentStep === "cloudinary"
                        ? "Uploading Image to CDN..."
                        : "Saving Metadata in Database..."}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span>Create & Publish Gallery Item</span>
                    <PlusCircle className="w-4 h-4 transition-transform group-hover:scale-105" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Success / Error Notification Messages */}
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
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250 dark:border-emerald-900/40 p-4 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold leading-relaxed">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-250 dark:border-red-900/40 p-4 flex items-start gap-3 text-red-800 dark:text-red-300 text-xs font-semibold leading-relaxed">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
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
