"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, AlertCircle, CheckCircle, Loader2, Pencil, Trash2, X, Megaphone, BellRing
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { 
  createAnnouncement, 
  getAnnouncements, 
  deleteAnnouncement,
  updateAnnouncement,
  Announcement 
} from "../../../services/announcement.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import { showToast } from "../../../lib/toast";
import { announcementSchema, AnnouncementSchemaType, announcementTypesList } from "../../../validations/announcement.schema";
import FormInput from "../../../components/forms/FormInput";
import FormTextarea from "../../../components/forms/FormTextarea";
import FormSelect from "../../../components/forms/FormSelect";
import FormToggle from "../../../components/forms/FormToggle";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
} as const;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2 } },
} as const;

const announcementCategories = announcementTypesList.map((t) => ({ label: t, value: t }));

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Create Form (React Hook Form) ──────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AnnouncementSchemaType>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Admission",
      important: false,
      date: "",
    },
  });

  // ── Edit Form (React Hook Form) ────────────────────────────────────────────
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<AnnouncementSchemaType>({
    resolver: zodResolver(announcementSchema),
  });

  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ── Notifications ───────────────────────────────────────────────────────────
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const data = await getAnnouncements();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setErrorMsg("Failed to load announcements board.");
    } finally {
      setIsLoading(false);
    }
  }

  const onUploadSubmit = async (data: AnnouncementSchemaType) => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Save to Firestore
      await createAnnouncement({
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        important: data.important,
        date: data.date,
      });

      setSuccessMsg("Announcement published successfully!");
      showToast.success("Announcement published successfully! ✅");
      
      // Reset form
      reset();

      // Refresh data
      await fetchItems();
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMsg(err.message || "An error occurred during publication.");
      showToast.error("Notice publication failed", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (item: Announcement) => {
    setDeleteTargetId(item.id);
    setDeleteTargetName(item.title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement(deleteTargetId);
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      showToast.success("Announcement Deleted Successfully ✅");
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err: any) {
      console.error("Failed to delete announcement:", err);
      showToast.error("Failed to delete announcement.", err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setDeleteTargetId(null);
      setDeleteTargetName("");
    }
  };

  // ── Edit Handlers ───────────────────────────────────────────────────────────

  const handleEditClick = (item: Announcement) => {
    setEditingItem(item);
    resetEdit({
      title: item.title,
      description: item.description,
      type: item.type as any,
      important: item.important,
      date: item.date,
    });
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleEditClose = () => {
    setEditingItem(null);
  };

  const onEditSubmit = async (data: AnnouncementSchemaType) => {
    if (!editingItem) return;

    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateAnnouncement(editingItem.id, {
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        important: data.important,
        date: data.date,
      });

      setSuccessMsg("Announcement Updated Successfully ✅");
      showToast.success("Announcement Updated Successfully ✅");

      // Optimistic real-time UI refresh
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: data.title.trim(),
                description: data.description.trim(),
                type: data.type,
                important: data.important,
                date: data.date,
              }
            : item
        )
      );

      handleEditClose();
    } catch (err: any) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Failed to update announcement. Please try again.");
      showToast.error("Failed to update announcement", err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Top: Page Heading & Description */}
        <div className="text-left border-l-4 border-[#9B111E] pl-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Announcements Management
          </h2>
          <p className="text-xs text-slate-555 font-semibold">
            Publish and manage board circulars, events, holidays, workshops, and admission notifications.
          </p>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-50 dark:bg-red-955/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2 text-left"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-green-50 dark:bg-green-955/20 border border-green-200/50 dark:border-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex items-center gap-2 text-left"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Middle: Announcement Form Card */}
        <motion.div
          className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium text-left"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-sm sm:text-base font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#D4A017]" />
              <span>Publish New Notice / Announcement</span>
            </h3>
          </div>

          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Form Input Fields */}
              <div className="space-y-4">
                {/* Title */}
                <FormInput
                  label="Notice Title"
                  required
                  placeholder="Enter visual headline or subject"
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Description */}
                <FormTextarea
                  label="Notice Description"
                  required
                  rows={4}
                  placeholder="Provide full description context, instructions, or links..."
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              {/* Selection Area & Publish Button */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Type Selection */}
                    <FormSelect
                      label="Notice Type"
                      required
                      placeholder="Select Notice Type"
                      options={announcementCategories}
                      error={errors.type?.message}
                      {...register("type")}
                    />

                    {/* Date */}
                    <FormInput
                      type="date"
                      label="Publish Date"
                      required
                      error={errors.date?.message}
                      {...register("date")}
                    />
                  </div>

                  {/* Important Notice Toggle */}
                  <Controller
                    control={control}
                    name="important"
                    render={({ field }) => (
                      <FormToggle
                        label="Mark as Urgent / Important"
                        description="Highlights notice banner on landing page and alerts."
                        checked={field.value}
                        onChange={field.onChange}
                        error={errors.important?.message}
                        containerClassName="pt-2"
                      />
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing Notice...</span>
                    </>
                  ) : (
                    <>
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Publish Notice Circular</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </motion.div>

        {/* Bottom: Announcements Grid/Table */}
        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Board Circular Notices Registry
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">
              Review current announcement records populated in the institutional portal dashboard.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Loader Skeletons */
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col space-y-3 animate-pulse">
                    <div className="w-1/4 h-3.5 bg-slate-150 dark:bg-slate-800 rounded" />
                    <div className="w-3/4 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
                No Announcements Available
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`p-5 rounded-3xl border bg-white dark:bg-slate-900 shadow-premium flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-left hover:border-[#D4A017]/30 transition-colors ${
                      item.important
                        ? "border-[#9B111E] dark:border-[#9B111E]/50 ring-1 ring-[#9B111E]/10"
                        : "border-brand-cream-350 dark:border-slate-800"
                    }`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="space-y-2.5 flex-1 min-w-0">
                      {/* Badge and Title */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          item.important
                            ? "bg-red-50 text-[#9B111E] dark:bg-red-955/20 dark:text-red-400 border-red-200/50 dark:border-red-900/30"
                            : "bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-slate-200/50"
                        }`}>
                          {item.type}
                        </span>

                        {item.important && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-[#9B111E] bg-[#9B111E]/5 border border-[#9B111E]/10 px-2 py-0.5 rounded">
                            <BellRing className="w-3 h-3 text-[#9B111E] animate-bounce" />
                            <span>Urgent</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta info & Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 sm:pt-1">
                      <div className="flex items-center text-[9px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2.5 py-1.5 rounded-xl">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                        <span>
                          {item.date 
                            ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Recent"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-955/20 dark:hover:bg-amber-900/30 text-[#D4A017] hover:text-amber-700 transition-colors border border-amber-100 dark:border-amber-900/10 cursor-pointer flex items-center justify-center"
                          title="Edit Announcement"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/30 text-[#9B111E] hover:text-[#800F19] transition-colors border border-red-100 dark:border-red-900/10 cursor-pointer flex items-center justify-center"
                          title="Delete Announcement notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleEditClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Panel */}
            <motion.div
              className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-cream-350 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-955/30 border border-amber-100 dark:border-amber-900/20 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-[#D4A017]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                      Edit Announcement
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Modify existing notice record
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleEditClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitEdit(onEditSubmit)} className="p-6 space-y-5">

                {/* Edit Title */}
                <FormInput
                  label="Notice Title"
                  required
                  placeholder="Enter visual headline or subject"
                  error={errorsEdit.title?.message}
                  {...registerEdit("title")}
                />

                {/* Edit Description */}
                <FormTextarea
                  label="Notice Description"
                  required
                  rows={4}
                  placeholder="Provide full description, instructions, or links..."
                  error={errorsEdit.description?.message}
                  {...registerEdit("description")}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Edit Type */}
                  <FormSelect
                    label="Notice Type"
                    required
                    placeholder="Select Notice Type"
                    options={announcementCategories}
                    error={errorsEdit.type?.message}
                    {...registerEdit("type")}
                  />

                  {/* Edit Date */}
                  <FormInput
                    type="date"
                    label="Publish Date"
                    required
                    error={errorsEdit.date?.message}
                    {...registerEdit("date")}
                  />
                </div>

                {/* Edit Important Toggle */}
                <Controller
                  control={controlEdit}
                  name="important"
                  render={({ field }) => (
                    <FormToggle
                      label="Mark as Urgent / Important"
                      description="Highlights notice banner on landing page and alerts."
                      checked={field.value}
                      onChange={field.onChange}
                      error={errorsEdit.important?.message}
                      containerClassName="pt-2"
                    />
                  )}
                />

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleEditClose}
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemName={deleteTargetName || "Announcement"}
      />

    </DashboardLayout>
  );
}
