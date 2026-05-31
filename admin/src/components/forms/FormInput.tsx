"use client";

import React, { forwardRef, useId } from "react";
import FormError from "./FormError";

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Optional unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Field display label */
  label?: string;
  /** Whether to use a modern floating label design */
  floating?: boolean;
  /** Validation error message string */
  error?: string;
  /** Optional icon displayed at the start of the input */
  icon?: React.ReactNode;
  /** Optional icon displayed at the end of the input */
  trailingIcon?: React.ReactNode;
  /** Container CSS class overrides */
  containerClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id: customId,
      label,
      floating = false,
      error,
      icon,
      trailingIcon,
      containerClassName = "",
      className = "",
      disabled,
      required,
      placeholder = " ",
      type = "text",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const hasError = !!error;

    // Base input classes matching White, Cream, and Deep Red dashboard accents
    const baseInputClasses =
      "w-full px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border rounded-2xl transition-all duration-200 shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-950/40";

    const stateClasses = hasError
      ? "border-red-500/80 focus:border-red-650 focus:ring-2 focus:ring-red-500/10 placeholder:text-red-300"
      : "border-slate-200/80 dark:border-slate-800/80 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 placeholder:text-slate-400";

    const paddingClasses = `${icon ? "pl-10" : ""} ${trailingIcon ? "pr-10" : ""}`;

    return (
      <div className={`flex flex-col w-full relative ${containerClassName}`}>
        {/* Standard Label (Non-floating) */}
        {!floating && label && (
          <label
            htmlFor={inputId}
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
          {/* Leading Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}

          {/* Core Input Field */}
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            placeholder={floating ? " " : placeholder}
            className={`${baseInputClasses} ${stateClasses} ${paddingClasses} ${className} peer`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            {...props}
          />

          {/* Floating Label overlay */}
          {floating && label && (
            <label
              htmlFor={inputId}
              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-semibold transition-all duration-200 origin-[0_0] select-none ${
                icon ? "pl-6 peer-placeholder-shown:pl-6" : ""
              } ${
                hasError
                  ? "text-red-400 peer-focus:text-red-500"
                  : "text-slate-400 dark:text-slate-500 peer-focus:text-[#D4A017]"
              } peer-focus:-translate-y-7.5 peer-focus:scale-85 peer-focus:left-2 peer-focus:px-1.5 peer-focus:bg-white dark:peer-focus:bg-slate-900 peer-[:not(:placeholder-shown)]:-translate-y-7.5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-slate-900`}
            >
              {label}
              {required && <span className="text-[#9B111E] ml-1 font-bold">*</span>}
            </label>
          )}

          {/* Trailing Icon */}
          {trailingIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {trailingIcon}
            </div>
          )}
        </div>

        {/* Animated Validation Error Message */}
        <FormError id={`${inputId}-error`} message={error} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
