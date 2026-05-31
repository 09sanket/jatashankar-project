"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, CheckCircle2, AlertCircle, Copy, Check, Loader2, Trash2 
} from "lucide-react";
import { uploadImage } from "../services/cloudinary.service";

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

export default function CloudinaryTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(null);
    setUploadedUrl(null);
    setPublicId(null);

    // Frontend validations (matching our service's constraints)
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

  // 2. Upload handler using our existing Cloudinary service
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const result = await uploadImage(selectedFile);

      setUploadedUrl(result.url);
      setPublicId(result.publicId);
      setStatus({
        type: "success",
        message: "Image Uploaded Successfully ✅",
      });
    } catch (error) {
      console.error("Cloudinary test component upload failure:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setStatus({
        type: "error",
        message: `Upload Failed: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Clear file handler
  const handleClear = () => {
    setSelectedFile(null);
    setLocalPreview(null);
    setUploadedUrl(null);
    setPublicId(null);
    setStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 4. Copy URL handler
  const handleCopy = async () => {
    if (!uploadedUrl) return;
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 min-h-[400px]">
      <motion.div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-900/5 border border-brand-cream-350 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative subtle background accents */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#D4A017]/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-[#9B111E]/5 blur-xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cloudinary Image Upload
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Select and upload high-resolution images to the Cloudinary CDN network.
            </p>
          </div>

          {/* Upload Area / Dropzone */}
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {!localPreview ? (
              // Initial State Dropzone
              <div
                onClick={triggerFileInput}
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#D4A017]/50 dark:hover:border-[#D4A017]/50 bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#9B111E] group-hover:scale-105 transition-all duration-300">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="mt-4 text-center space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                    Click to choose image file
                  </p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">
                    JPG, PNG, or WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              // Local Preview State
              <div className="w-full border border-slate-150 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-5 relative group">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-white shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={localPreview}
                    alt="Local preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 w-full text-center sm:text-left min-w-0 space-y-1.5">
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-6">
                    {selectedFile?.name}
                  </p>
                  <p className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold">
                    Size: {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                  </p>
                  
                  {/* Upload Actions inside Preview Box */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isLoading || !!uploadedUrl}
                      className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-[#9B111E] to-[#7a0c16] text-white text-xs font-bold uppercase tracking-wide rounded-xl shadow-sm hover:shadow hover:from-[#7a0c16] hover:to-[#9B111E] disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>Upload File</span>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-950 bg-white dark:bg-slate-900 rounded-xl transition-all duration-200 cursor-pointer"
                      title="Clear Selection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

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

          {/* Uploaded Output Container */}
          <AnimatePresence>
            {uploadedUrl && (
              <motion.div
                className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Result Heading */}
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Uploaded File Details
                </p>

                {/* Preview & publicId Grid */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedUrl}
                      alt="Cloudinary preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 p-4.5 flex flex-col justify-center text-left">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Cloudinary public_id
                    </p>
                    <p className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-350 truncate mt-1">
                      {publicId}
                    </p>
                  </div>
                </div>

                {/* Uploaded CDN Link Block */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    CDN secure URL
                  </label>
                  <div className="relative flex items-stretch">
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-600 dark:text-slate-350 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all duration-200 cursor-pointer"
                      title="Copy URL"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600 animate-pulse" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
