"use client";

import React, { forwardRef, useId } from "react";
import { motion } from "framer-motion";
import FormError from "./FormError";

export interface FormToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "onChange"> {
  /** Optional unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Primary label text */
  label: string;
  /** Optional descriptive helper text shown below the label */
  description?: string;
  /** Current check state */
  checked?: boolean;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** Validation error message string */
  error?: string;
  /** Container CSS class overrides */
  containerClassName?: string;
}

const FormToggle = forwardRef<HTMLInputElement, FormToggleProps>(
  (
    {
      id: customId,
      label,
      description,
      checked = false,
      onChange,
      error,
      containerClassName = "",
      className = "",
      disabled,
      name,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const toggleId = customId || generatedId;
    const hasError = !!error;

    const handleToggle = () => {
      if (disabled) return;
      if (onChange) {
        onChange(!checked);
      }
    };

    return (
      <div className={`flex flex-col w-full relative ${containerClassName}`}>
        <div className="flex items-start justify-between gap-4">
          {/* Labels */}
          <div className="flex-1 select-none cursor-pointer" onClick={handleToggle}>
            <span
              className={`block text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors ${
                disabled ? "opacity-50" : ""
              }`}
            >
              {label}
            </span>
            {description && (
              <span
                className={`block text-[10px] text-slate-500 font-semibold leading-normal mt-0.5 ${
                  disabled ? "opacity-50" : ""
                }`}
              >
                {description}
              </span>
            )}
          </div>

          {/* Switch element */}
          <button
            type="button"
            id={`${toggleId}-button`}
            role="switch"
            aria-checked={checked}
            aria-readonly={disabled}
            disabled={disabled}
            onClick={handleToggle}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${
              checked ? "bg-[#9B111E]" : "bg-slate-200 dark:bg-slate-800"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
          >
            {/* Sliding knob with framer motion transition */}
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md"
              animate={{ x: checked ? 18 : 2 }}
            />
          </button>

          {/* Hidden standard checkbox input for React Hook Form integration */}
          <input
            ref={ref}
            id={toggleId}
            name={name}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.checked)}
            className="sr-only"
            {...props}
          />
        </div>

        {/* Animated Validation Error Message */}
        <FormError id={`${toggleId}-error`} message={error} />
      </div>
    );
  }
);

FormToggle.displayName = "FormToggle";

export default FormToggle;
