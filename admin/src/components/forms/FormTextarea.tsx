"use client";

import React, { forwardRef, useId } from "react";
import FormError from "./FormError";

export interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  /** Optional unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Field display label */
  label?: string;
  /** Validation error message string */
  error?: string;
  /** Container CSS class overrides */
  containerClassName?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id: customId,
      label,
      error,
      containerClassName = "",
      className = "",
      disabled,
      required,
      rows = 3,
      placeholder = " ",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = customId || generatedId;
    const hasError = !!error;

    // Base textarea classes matching White, Cream, and Deep Red dashboard accents
    const baseTextareaClasses =
      "w-full px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border rounded-2xl transition-all duration-200 shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-950/40 resize-none";

    const stateClasses = hasError
      ? "border-red-500/80 focus:border-red-650 focus:ring-2 focus:ring-red-500/10 placeholder:text-red-300"
      : "border-slate-200/80 dark:border-slate-800/80 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 placeholder:text-slate-400";

    return (
      <div className={`flex flex-col w-full relative ${containerClassName}`}>
        {/* Textarea Label */}
        {label && (
          <label
            htmlFor={textareaId}
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

        <div className="relative w-full">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={`${baseTextareaClasses} ${stateClasses} ${className}`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${textareaId}-error` : undefined}
            {...props}
          />
        </div>

        {/* Animated Validation Error Message */}
        <FormError id={`${textareaId}-error`} message={error} />
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
