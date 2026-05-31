"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, FileText, Calendar, BellRing, Settings, Loader2, CheckCircle2, AlertCircle, PlusCircle
} from "lucide-react";
import { createAnnouncement } from "../services/announcement.service";

type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

const typeOptions = [
  "Admission",
  "Event",
  "Exam",
  "Workshop",
  "Holiday",
  "Placement",
];

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

export default function AnnouncementUploadTest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Admission");
  const [important, setImportant] = useState(false);
  const [date, setDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("Admission");
    setImportant(false);
    setDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim())       { setStatus({ type: "error", message: "Announcement Title is required." }); return; }
    if (!description.trim()) { setStatus({ type: "error", message: "Description is required." }); return; }
    if (!type)               { setStatus({ type: "error", message: "Please select an Announcement Type." }); return; }
    if (!date.trim())        { setStatus({ type: "error", message: "Announcement Date is required." }); return; }

    setStatus(null);
    setIsLoading(true);

    try {
      console.log("Saving announcement to Firestore...");
      await createAnnouncement({
        title: title.trim(),
        description: description.trim(),
        type,
        important,
        date: date.trim(),
      });

      setStatus({ type: "success", message: "Announcement Added Successfully ✅" });
      resetForm();
    } catch (error) {
      console.error("Announcement write failure:", error);
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setStatus({ type: "error", message: `Firestore Write Failed: ${msg}` });
    } finally {
      setIsLoading(false);
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
        {/* Accents */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#D4A017]/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-[#9B111E]/5 blur-xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight">
              Publish Announcement
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Post real-time news, exam schedules, events, or placement alerts to the Firestore database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <Field label="Announcement Title (शीर्षक)" icon={<Megaphone className="w-4 h-4" />}>
              <input
                type="text"
                placeholder="e.g. Admission Open for BPT 2026 Batch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className={inputClass}
              />
            </Field>

            {/* Row 2: Type Dropdown + Date Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Announcement Type (प्रकार)" icon={<Settings className="w-4 h-4" />}>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isLoading}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>

              <Field label="Publish Date" icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="text"
                  placeholder="e.g. 15th May, 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
                Description (विवरण)
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea
                  placeholder="Complete details of the circular notice..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Important Toggle Banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/40 text-left">
              <div className="w-8 h-8 rounded-full bg-[#9B111E]/10 flex items-center justify-center text-[#9B111E] shrink-0">
                <BellRing className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">High Priority Notice</h4>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Pin this announcement with a critical badge status</p>
              </div>
              <button
                type="button"
                onClick={() => setImportant(!important)}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  important ? "bg-[#9B111E]" : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    important ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

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
                    <span>Publishing Notice...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Announcement</span>
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
