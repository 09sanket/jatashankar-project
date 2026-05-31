"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, UploadCloud, AlertCircle, CheckCircle, Loader2, Star, Pencil, Trash2, X, RefreshCw, Plus, Quote
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { uploadImage } from "../../../services/cloudinary.service";
import { 
  createTestimonial, 
  getTestimonials, 
  deleteTestimonial, 
  updateTestimonial, 
  Testimonial 
} from "../../../services/testimonial.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import { showToast } from "../../../lib/toast";
import { testimonialSchema, TestimonialSchemaType, coursesList } from "../../../validations/testimonial.schema";
import FormInput from "../../../components/forms/FormInput";
import FormTextarea from "../../../components/forms/FormTextarea";
import FormSelect from "../../../components/forms/FormSelect";
import FormToggle from "../../../components/forms/FormToggle";
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

const testimonialCourses = coursesList.map((c) => ({ label: c, value: c }));
const ratingOptions = [
  { label: "5 Stars", value: 5 },
  { label: "4 Stars", value: 4 },
  { label: "3 Stars", value: 3 },
  { label: "2 Stars", value: 2 },
  { label: "1 Star", value: 1 },
];

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Create Form (React Hook Form) ──────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestimonialSchemaType>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      studentName: "",
      course: "BPT",
      designation: "",
      review: "",
      rating: 5,
      featured: true,
      imageUrl: "",
      publicId: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ── Edit Form (React Hook Form) ────────────────────────────────────────────
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    setValue: setValueEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<TestimonialSchemaType>({
    resolver: zodResolver(testimonialSchema),
  });

  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
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
      const data = await getTestimonials();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      setErrorMsg("Failed to load testimonials records.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setValue("imageUrl", "https://example.com/temp-preview.jpg", { shouldValidate: true });
      setErrorMsg(null);
    } else {
      setPreviewUrl(null);
      setValue("imageUrl", "", { shouldValidate: true });
    }
  };

  const handleResetForm = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onUploadSubmit = async (data: TestimonialSchemaType) => {
    if (!selectedFile) {
      setErrorMsg("Please select a student profile image to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Step 1: Upload to Cloudinary
      const uploadResult = await uploadImage(selectedFile);
      
      // Step 2: Save to Firestore
      await createTestimonial({
        studentName: data.studentName.trim(),
        course: data.course,
        designation: data.designation.trim() || "Student",
        review: data.review.trim(),
        rating: Number(data.rating),
        featured: data.featured,
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
      });

      setSuccessMsg("Testimonial record created successfully!");
      showToast.success("Testimonial record created successfully! ✅");
      
      // Reset form
      handleResetForm();

      // Refresh data
      await fetchItems();
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "An error occurred during testimonial creation.");
      showToast.error("Testimonial creation failed", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (item: Testimonial) => {
    setDeleteTargetId(item.id);
    setDeleteTargetName(item.studentName);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(deleteTargetId);
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      showToast.success("Testimonial Deleted Successfully ✅");
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err: any) {
      console.error("Failed to delete testimonial:", err);
      showToast.error("Failed to delete testimonial.", err?.message);
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

  const handleEditClick = (item: Testimonial) => {
    setEditingItem(item);
    resetEdit({
      studentName: item.studentName,
      course: item.course as any,
      designation: item.designation,
      review: item.review,
      rating: item.rating,
      featured: item.featured,
      imageUrl: item.imageUrl,
      publicId: item.publicId,
    });
    setEditFile(null);
    setEditPreviewUrl(item.imageUrl);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleEditFileChange = (file: File | null) => {
    setEditFile(file);
    if (file) {
      setEditPreviewUrl(URL.createObjectURL(file));
      setValueEdit("imageUrl", "https://example.com/temp-preview.jpg", { shouldValidate: true });
    } else {
      if (editingItem?.imageUrl) {
        setEditPreviewUrl(editingItem.imageUrl);
        setValueEdit("imageUrl", editingItem.imageUrl, { shouldValidate: true });
      } else {
        setEditPreviewUrl(null);
        setValueEdit("imageUrl", "", { shouldValidate: true });
      }
    }
  };

  const handleEditClose = () => {
    setEditingItem(null);
    setEditFile(null);
    setEditPreviewUrl(null);
  };

  const onEditSubmit = async (data: TestimonialSchemaType) => {
    if (!editingItem) return;

    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let imageUrl = editingItem.imageUrl;
      let publicId = editingItem.publicId;

      if (editFile) {
        const uploadResult = await uploadImage(editFile);
        imageUrl = uploadResult.url;
        publicId = uploadResult.publicId;
      }

      await updateTestimonial(editingItem.id, {
        studentName: data.studentName.trim(),
        course: data.course,
        designation: data.designation.trim() || "Student",
        review: data.review.trim(),
        rating: Number(data.rating),
        featured: data.featured,
        imageUrl,
        publicId,
      });

      setSuccessMsg("Testimonial Updated Successfully ✅");
      showToast.success("Testimonial Updated Successfully ✅");

      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                studentName: data.studentName.trim(),
                course: data.course,
                designation: data.designation.trim() || "Student",
                review: data.review.trim(),
                rating: Number(data.rating),
                featured: data.featured,
                imageUrl,
                publicId,
              }
            : item
        )
      );

      handleEditClose();
    } catch (err: any) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Failed to update testimonial. Please try again.");
      showToast.error("Failed to update testimonial", err.message);
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
            Testimonials Management
          </h2>
          <p className="text-xs text-slate-555 font-semibold">
            Publish and manage student success stories, course feedback, ratings, and featured testimonials.
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

        {/* Middle: Testimonial Upload Form Card */}
        <motion.div
          className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium text-left"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-sm sm:text-base font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#D4A017]" />
              <span>Register Student Testimonial</span>
            </h3>
          </div>

          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Form Input Fields */}
              <div className="space-y-4">
                {/* Student Name */}
                <FormInput
                  label="Student Name"
                  required
                  placeholder="Enter student's full name"
                  error={errors.studentName?.message}
                  {...register("studentName")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Course Selection */}
                  <FormSelect
                    label="Course Enrolled"
                    required
                    placeholder="Select Course"
                    options={testimonialCourses}
                    error={errors.course?.message}
                    {...register("course")}
                  />

                  {/* Designation */}
                  <FormInput
                    label="Position / Designation"
                    required
                    placeholder="e.g. Alumnus, Physiotherapist"
                    error={errors.designation?.message}
                    {...register("designation")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rating Selector */}
                  <FormSelect
                    label="Review Rating Stars"
                    required
                    placeholder="Select Rating"
                    options={ratingOptions}
                    error={errors.rating?.message}
                    {...register("rating", { valueAsNumber: true })}
                  />

                  {/* Featured Toggle */}
                  <Controller
                    control={control}
                    name="featured"
                    render={({ field }) => (
                      <FormToggle
                        label="Highlight / Feature Review"
                        description="Mark as Featured Student Testimonial"
                        checked={field.value}
                        onChange={field.onChange}
                        error={errors.featured?.message}
                        containerClassName="pt-2"
                      />
                    )}
                  />
                </div>

                {/* Review Text */}
                <FormTextarea
                  label="Student Review Text"
                  required
                  rows={4}
                  placeholder="Paste the student's quotes or descriptive feedback review..."
                  error={errors.review?.message}
                  {...register("review")}
                />
              </div>

              {/* Image Upload & Submit Area */}
              <div className="flex flex-col justify-between space-y-4">
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ fieldState }) => (
                    <FormFileUpload
                      label="Student Profile Photo"
                      required
                      previewUrl={previewUrl || undefined}
                      error={fieldState.error?.message}
                      onChange={handleFileChange}
                      onClear={() => handleFileChange(null)}
                      containerClassName="flex-1 flex flex-col"
                    />
                  )}
                />

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Testimonial...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Testimonial</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </motion.div>

        {/* Bottom: Testimonials Catalog Grid */}
        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Student Testimonials Registry
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">
              Review current student testimonials registered in the institutional dashboard system.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Loader Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-150 dark:bg-slate-800" />
                      <div className="space-y-1.5 flex-1">
                        <div className="w-1/3 h-3.5 bg-slate-150 dark:bg-slate-800 rounded" />
                        <div className="w-1/4 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
                      </div>
                    </div>
                    <div className="w-full h-12 bg-slate-100 dark:bg-slate-850 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
                No Testimonials Available
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`group rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-premium flex flex-col justify-between hover:border-[#D4A017]/30 transition-colors ${
                      item.featured
                        ? "border-[#D4A017] dark:border-[#D4A017]/50 ring-1 ring-[#D4A017]/20"
                        : "border-brand-cream-350 dark:border-slate-800"
                    }`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="space-y-4 text-left">
                      {/* Header user details */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.imageUrl} 
                            alt={item.studentName} 
                            className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                              {item.studentName}
                            </h4>
                            <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold truncate">
                              {item.designation} ({item.course})
                            </p>
                          </div>
                        </div>

                        {/* Featured badge */}
                        {item.featured && (
                          <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 border border-[#D4A017]/20 px-2 py-0.5 rounded-full shrink-0">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex items-center space-x-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < item.rating 
                                ? "text-[#D4A017] fill-[#D4A017]" 
                                : "text-slate-200 dark:text-slate-855"
                            }`} 
                          />
                        ))}
                      </div>

                      {/* Review Blockquote */}
                      <p className="text-[11px] text-slate-650 dark:text-slate-400 italic leading-relaxed line-clamp-4 relative pt-1">
                        &ldquo;{item.review}&rdquo;
                      </p>
                    </div>

                    {/* Footer Date & Action Buttons */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-50 dark:border-slate-850 mt-5">
                      <div className="flex items-center text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-slate-400 mr-1" />
                        <span>
                          {item.createdAt?.toDate 
                            ? item.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Recent"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-955/20 dark:hover:bg-amber-900/30 text-[#D4A017] hover:text-amber-700 transition-colors border border-amber-100 dark:border-amber-900/10 cursor-pointer flex items-center justify-center"
                          title="Edit Testimonial"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/30 text-[#9B111E] hover:text-[#800F19] transition-colors border border-red-100 dark:border-red-900/10 cursor-pointer flex items-center justify-center"
                          title="Delete Student Testimonial"
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
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-cream-350 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
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
                      Edit Testimonial
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Modify existing student record
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Left: Text Fields */}
                  <div className="space-y-4">
                    {/* Student Name */}
                    <FormInput
                      label="Student Name"
                      required
                      placeholder="Enter student's full name"
                      error={errorsEdit.studentName?.message}
                      {...registerEdit("studentName")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Course */}
                      <FormSelect
                        label="Course"
                        required
                        placeholder="Select Course"
                        options={testimonialCourses}
                        error={errorsEdit.course?.message}
                        {...registerEdit("course")}
                      />

                      {/* Designation */}
                      <FormInput
                        label="Designation"
                        required
                        placeholder="e.g. Alumnus"
                        error={errorsEdit.designation?.message}
                        {...registerEdit("designation")}
                      />
                    </div>

                    {/* Review */}
                    <FormTextarea
                      label="Student Review"
                      required
                      rows={4}
                      placeholder="Student's review text..."
                      error={errorsEdit.review?.message}
                      {...registerEdit("review")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Rating selector */}
                      <FormSelect
                        label="Rating Stars"
                        required
                        placeholder="Select Rating"
                        options={ratingOptions}
                        error={errorsEdit.rating?.message}
                        {...registerEdit("rating", { valueAsNumber: true })}
                      />

                      {/* Featured Toggle */}
                      <Controller
                        control={controlEdit}
                        name="featured"
                        render={({ field }) => (
                          <FormToggle
                            label="Mark as Featured"
                            description="Highlights student feedback on dashboard homepage."
                            checked={field.value}
                            onChange={field.onChange}
                            error={errorsEdit.featured?.message}
                            containerClassName="pt-2"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Right: Profile Image */}
                  <div className="flex flex-col justify-start">
                    <Controller
                      control={controlEdit}
                      name="imageUrl"
                      render={({ fieldState }) => (
                        <FormFileUpload
                          label="Student Profile Photo"
                          required
                          previewUrl={editPreviewUrl || undefined}
                          error={fieldState.error?.message}
                          onChange={handleEditFileChange}
                          onClear={() => handleEditFileChange(null)}
                          containerClassName="w-full"
                        />
                      )}
                    />
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-3 pl-1">
                      {editFile ? "New image selected — will replace existing" : "Click box to replace image. Leave unchanged to keep existing."}
                    </p>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
        itemName={deleteTargetName || "Testimonial"}
      />

    </DashboardLayout>
  );
}
