"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, CheckCircle, Loader2, Pencil, Trash2, X, Megaphone, ImageIcon
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
import { uploadImage } from "../../../services/cloudinary.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import { showToast } from "../../../lib/toast";
import { announcementSchema, AnnouncementSchemaType } from "../../../validations/announcement.schema";
import FormInput from "../../../components/forms/FormInput";
import FormTextarea from "../../../components/forms/FormTextarea";
import FormFileUpload from "../../../components/forms/FormFileUpload";

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

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Form (React Hook Form)
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
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit Form (React Hook Form)
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
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Notifications
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
      let imageUrl = "";
      let publicId = "";

      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        imageUrl = uploadResult.url;
        publicId = uploadResult.publicId;
      }

      await createAnnouncement({
        title: data.title.trim(),
        description: data.description.trim(),
        imageUrl,
        publicId,
      });

      setSuccessMsg("Announcement published successfully!");
      showToast.success("Announcement published successfully! ✅");
      
      reset();
      setImageFile(null);
      setImagePreview(null);
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

  // Edit Handlers
  const handleEditClick = (item: Announcement) => {
    setEditingItem(item);
    resetEdit({
      title: item.title,
      description: item.description,
    });
    setEditImagePreview(item.imageUrl || null);
    setEditImageFile(null);
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
      let imageUrl = editingItem.imageUrl || "";
      let publicId = editingItem.publicId || "";

      if (editImageFile) {
        const uploadResult = await uploadImage(editImageFile);
        imageUrl = uploadResult.url;
        publicId = uploadResult.publicId;
      } else if (!editImagePreview) {
        // Image was cleared
        imageUrl = "";
        publicId = "";
      }

      await updateAnnouncement(editingItem.id, {
        title: data.title.trim(),
        description: data.description.trim(),
        imageUrl,
        publicId,
      });

      setSuccessMsg("Announcement Updated Successfully ✅");
      showToast.success("Announcement Updated Successfully ✅");

      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: data.title.trim(),
                description: data.description.trim(),
                imageUrl,
                publicId,
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
        <div className="text-left border-l-4 border-[#9B111E] pl-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Announcements Management
          </h2>
          <p className="text-xs text-slate-555 font-semibold">
            Publish and manage announcements with heading, description, and images.
          </p>
        </div>

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
              
              <div className="space-y-4">
                <FormInput
                  label="Heading / Title"
                  required
                  placeholder="Enter visual headline"
                  error={errors.title?.message}
                  {...register("title")}
                />

                <FormTextarea
                  label="Description"
                  required
                  rows={6}
                  placeholder="Provide full description..."
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              <div className="flex flex-col space-y-4">
                <FormFileUpload
                  label="Announcement Image (Optional)"
                  accept="image/png, image/jpeg, image/webp"
                  previewUrl={imagePreview || undefined}
                  onChange={(file) => {
                    setImageFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImagePreview(url);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  onClear={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                />

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full mt-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing Notice...</span>
                    </>
                  ) : (
                    <>
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Publish Announcement</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </motion.div>

        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Announcements Registry
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
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
                    className="p-5 rounded-3xl border bg-white dark:bg-slate-900 shadow-premium flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-left border-brand-cream-350 dark:border-slate-800"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex gap-4 flex-1">
                      {item.imageUrl && (
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="text-sm font-serif font-extrabold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 rounded-lg bg-amber-50 text-[#D4A017] hover:bg-amber-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 rounded-lg bg-red-50 text-[#9B111E] hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editingItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleEditClose}
            />

            <motion.div
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-cream-350 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-955/30 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-[#D4A017]" />
                  </div>
                  <h3 className="text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase">
                    Edit Announcement
                  </h3>
                </div>
                <button
                  onClick={handleEditClose}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit(onEditSubmit)} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormInput
                      label="Heading / Title"
                      required
                      error={errorsEdit.title?.message}
                      {...registerEdit("title")}
                    />

                    <FormTextarea
                      label="Description"
                      required
                      rows={6}
                      error={errorsEdit.description?.message}
                      {...registerEdit("description")}
                    />
                  </div>
                  <div>
                    <FormFileUpload
                      label="Announcement Image"
                      accept="image/png, image/jpeg, image/webp"
                      previewUrl={editImagePreview || undefined}
                      onChange={(file) => {
                        setEditImageFile(file);
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setEditImagePreview(url);
                        } else {
                          setEditImagePreview(null);
                        }
                      }}
                      onClear={() => {
                        setEditImageFile(null);
                        setEditImagePreview(null);
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleEditClose}
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#9B111E] text-white font-bold uppercase rounded-xl"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
