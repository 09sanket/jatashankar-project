"use client";

import React, { forwardRef, useId } from "react";
import FormError from "./FormError";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  /** Optional unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Field display label */
  label?: string;
  /** Dropdown menu options array */
  options: readonly SelectOption[] | SelectOption[];
  /** Optional placeholder text shown as the first unselected option */
  placeholder?: string;
  /** Validation error message string */
  error?: string;
  /** Container CSS class overrides */
  containerClassName?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      id: customId,
      label,
      options,
      placeholder,
      error,
      containerClassName = "",
      className = "",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = customId || generatedId;
    const hasError = !!error;

    // Base select classes matching White, Cream, and Deep Red dashboard accents
    const baseSelectClasses =
      "w-full px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border rounded-2xl transition-all duration-200 shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-950/40 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] pr-10 cursor-pointer";

    const stateClasses = hasError
      ? "border-red-500/80 focus:border-red-650 focus:ring-2 focus:ring-red-500/10"
      : "border-slate-200/80 dark:border-slate-800/80 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10";

    return (
      <div className={`flex flex-col w-full relative ${containerClassName}`}>
        {/* Select Dropdown Label */}
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={`${baseSelectClasses} ${stateClasses} ${className}`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${selectId}-error` : undefined}
            defaultValue=""
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt, index) => (
              <option key={`${opt.value}-${index}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Animated Validation Error Message */}
        <FormError id={`${selectId}-error`} message={error} />
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
