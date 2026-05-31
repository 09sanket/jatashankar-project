"use client";

import React, { forwardRef, useId, useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FormError from "./FormError";

export interface FormFileUploadProps {
  /** Optional unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Input display label */
  label?: string;
  /** Current active image URL (e.g. from existing database record) */
  value?: string;
  /** Selected file preview URL state (e.g. URL.createObjectURL(file)) */
  previewUrl?: string;
  /** Drag-and-drop accept mime types */
  accept?: string;
  /** Maximum file size in bytes. Defaults to 5MB. */
  maxSizeBytes?: number;
  /** Validation error message string */
  error?: string;
  /** Triggered when a new file is chosen */
  onChange?: (file: File | null) => void;
  /** Triggered when the current image/file is cleared */
  onClear?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Required validation indicator */
  required?: boolean;
  /** Container CSS class overrides */
  containerClassName?: string;
  /** Drop area custom CSS overrides */
  className?: string;
}

const FormFileUpload = forwardRef<HTMLInputElement, FormFileUploadProps>(
  (
    {
      id: customId,
      label,
      value,
      previewUrl,
      accept = "image/*",
      maxSizeBytes = 5 * 1024 * 1024,
      error: externalError,
      onChange,
      onClear,
      disabled = false,
      required = false,
      containerClassName = "",
      className = "",
    },
    ref
  ) => {
    const generatedId = useId();
    const fileId = customId || generatedId;
    const internalFileInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const activeError = externalError || localError;
    const hasError = !!activeError;

    // Resolve which image to show
    const displayImage = previewUrl || value;

    const handleFile = (file: File) => {
      setLocalError(null);

      // Simple size validation
      if (file.size > maxSizeBytes) {
        const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
        setLocalError(`File size must be less than ${sizeMb}MB.`);
        if (onChange) onChange(null);
        return;
      }

      if (onChange) {
        onChange(file);
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        // Validate MIME type roughly
        const file = files[0];
        const acceptedTypes = accept.split(",").map((t) => t.trim());
        const matchesMime = acceptedTypes.some((mime) => {
          if (mime.endsWith("/*")) {
            const baseMime = mime.replace("/*", "");
            return file.type.startsWith(baseMime);
          }
          return file.type === mime;
        });

        if (accept !== "* && image/*" && accept !== "*" && !matchesMime) {
          setLocalError(`Invalid file format. Please upload files matching: ${accept}`);
          return;
        }

        handleFile(file);
      }
    };

    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (disabled) return;

      setLocalError(null);
      if (internalFileInputRef.current) {
        internalFileInputRef.current.value = "";
      }

      if (onClear) {
        onClear();
      }
      if (onChange) {
        onChange(null);
      }
    };

    const triggerFilePicker = () => {
      if (disabled) return;
      if (internalFileInputRef.current) {
        internalFileInputRef.current.click();
      }
    };

    return (
      <div className={`flex flex-col w-full relative ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 pl-1 transition-colors select-none ${
              hasError
                ? "text-red-500"
                : "text-slate-450 dark:text-slate-400"
            } ${disabled ? "opacity-50" : ""}`}
          >
            {label}
            {required && <span className="text-[#9B111E] ml-1 font-bold">*</span>}
          </label>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFilePicker}
          className={`relative flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 border border-dashed rounded-2xl min-h-[160px] bg-slate-50/50 dark:bg-slate-950/20 group select-none ${
            isDragging
              ? "border-[#D4A017] bg-[#D4A017]/5 scale-[0.99] shadow-sm"
              : hasError
              ? "border-red-500/80 bg-red-50/10 hover:border-red-550"
              : "border-slate-200/80 dark:border-slate-800/80 hover:border-[#D4A017] dark:hover:border-[#D4A017]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        >
          {/* Hidden File Input */}
          <input
            id={fileId}
            ref={(node) => {
              // Share ref between React Hook Form and our local picker
              (internalFileInputRef as any).current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as any).current = node;
              }
            }}
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${fileId}-error` : undefined}
          />

          <AnimatePresence mode="wait">
            {displayImage ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full flex flex-col items-center justify-center p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImage}
                  alt="Preview"
                  className="max-h-[140px] object-contain rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={disabled}
                  className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-[#9B111E] transition-colors shadow-md cursor-pointer disabled:opacity-50"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-all duration-200 rounded-xl pointer-events-none">
                  Change Image
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2.5 pointer-events-none"
              >
                {/* Animated Upload Icon Box */}
                <div className="mx-auto w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                  <motion.div
                    animate={isDragging ? { y: [-3, 3, -3] } : { y: 0 }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    <UploadCloud className="w-5.5 h-5.5 text-slate-400 group-hover:text-[#9B111E] transition-colors" />
                  </motion.div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-350">
                    Drag and drop file here, or <span className="text-[#9B111E] font-extrabold group-hover:underline">browse</span>
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                    PNG, JPG, JPEG up to {(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Validation Error Message */}
        <FormError id={`${fileId}-error`} message={activeError || undefined} />
      </div>
    );
  }
);

FormFileUpload.displayName = "FormFileUpload";

export default FormFileUpload;
