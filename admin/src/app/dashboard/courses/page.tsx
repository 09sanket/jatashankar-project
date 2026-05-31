"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Plus, Trash2, Calendar, UploadCloud, AlertCircle, CheckCircle, Loader2, Star, Clock, GraduationCap, Pencil, X, RefreshCw
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { uploadImage } from "../../../services/cloudinary.service";
import { 
  createCourse, 
  getCourses, 
  deleteCourse,
  updateCourse,
  Course 
} from "../../../services/course.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import { showToast } from "../../../lib/toast";
import { courseSchema, CourseSchemaType } from "../../../validations/course.schema";
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

const durationOptions = [
  { label: "4.5 Years", value: "4.5 Years" },
  { label: "4 Years", value: "4 Years" },
  { label: "3.5 Years", value: "3.5 Years" },
  { label: "3 Years", value: "3 Years" },
  { label: "2 Years", value: "2 Years" },
  { label: "1 Year", value: "1 Year" },
  { label: "6 Months", value: "6 Months" },
] as const;

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([]);
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
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      shortName: "",
      duration: "",
      eligibility: "",
      description: "",
      careerScope: "",
      imageUrl: "",
      publicId: "",
      featured: false,
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
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
  });

  const [editingItem, setEditingItem] = useState<Course | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ── Notification Alerts ───────────────────────────────────────────────────
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const data = await getCourses();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setErrorMsg("Failed to load courses catalog.");
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

  const onUploadSubmit = async (data: CourseSchemaType) => {
    if (!selectedFile) {
      setErrorMsg("Please select an image for this course.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Step 1: Upload to Cloudinary
      const uploadResult = await uploadImage(selectedFile);
      
      // Step 2: Save to Firestore
      await createCourse({
        courseName: data.courseName.trim(),
        shortName: data.shortName.trim().toUpperCase(),
        duration: data.duration.trim(),
        eligibility: data.eligibility.trim(),
        description: data.description.trim(),
        careerScope: data.careerScope.trim(),
        featured: data.featured,
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
      });

      setSuccessMsg("Course catalog added successfully!");
      showToast.success("Course catalog added successfully! ✅");
      
      // Reset form
      handleResetForm();

      // Refresh data
      await fetchItems();
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "An error occurred during course registration.");
      showToast.error("Course registration failed", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (item: Course) => {
    setDeleteTargetId(item.id);
    setDeleteTargetName(item.courseName);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteCourse(deleteTargetId);
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      showToast.success("Course Deleted Successfully ✅");
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err: any) {
      console.error("Failed to delete course:", err);
      showToast.error("Failed to delete course record.", err?.message);
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

  // ── Edit Handlers ──────────────────────────────────────────────────────────

  const handleEditClick = (item: Course) => {
    setEditingItem(item);
    resetEdit({
      courseName: item.courseName,
      shortName: item.shortName,
      duration: item.duration,
      eligibility: item.eligibility,
      description: item.description,
      careerScope: item.careerScope,
      imageUrl: item.imageUrl,
      publicId: item.publicId,
      featured: item.featured,
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

  const onEditSubmit = async (data: CourseSchemaType) => {
    if (!editingItem) return;

    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let imageUrl = editingItem.imageUrl;
      let publicId = editingItem.publicId;

      // If a new file selected — upload to Cloudinary first
      if (editFile) {
        const uploadResult = await uploadImage(editFile);
        imageUrl = uploadResult.url;
        publicId = uploadResult.publicId;
      }

      await updateCourse(editingItem.id, {
        courseName: data.courseName.trim(),
        shortName: data.shortName.trim().toUpperCase(),
        duration: data.duration.trim(),
        eligibility: data.eligibility.trim(),
        description: data.description.trim(),
        careerScope: data.careerScope.trim(),
        featured: data.featured,
        imageUrl,
        publicId,
      });

      setSuccessMsg("Course Updated Successfully ✅");
      showToast.success("Course Updated Successfully ✅");

      // Optimistic real-time UI refresh
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                courseName: data.courseName.trim(),
                shortName: data.shortName.trim().toUpperCase(),
                duration: data.duration.trim(),
                eligibility: data.eligibility.trim(),
                description: data.description.trim(),
                careerScope: data.careerScope.trim(),
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
      setErrorMsg(err.message || "Failed to update course. Please try again.");
      showToast.error("Failed to update course", err.message);
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
            Courses Management
          </h2>
          <p className="text-xs text-slate-550 font-semibold">
            Register and manage course catalogs, syllabi, durations, eligibility criteria, and featured status.
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

        {/* Middle: Course Upload Form Card */}
        <motion.div
          className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium text-left"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-sm sm:text-base font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4A017]" />
              <span>Register New Course Catalog</span>
            </h3>
          </div>

          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Form Input Fields */}
              <div className="space-y-4">
                
                {/* Course Name */}
                <FormInput
                  label="Course Name"
                  required
                  placeholder="Enter full course name (e.g. Bachelor of Physiotherapy)"
                  error={errors.courseName?.message}
                  {...register("courseName")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Short Name */}
                  <FormInput
                    label="Abbreviation / Short Name"
                    required
                    placeholder="e.g. BPT, DMLT"
                    error={errors.shortName?.message}
                    {...register("shortName")}
                  />

                  {/* Duration */}
                  <FormSelect
                    label="Course Duration"
                    required
                    placeholder="Select Duration"
                    options={durationOptions}
                    error={errors.duration?.message}
                    {...register("duration")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Eligibility */}
                  <FormInput
                    label="Eligibility Criteria"
                    required
                    placeholder="e.g. 10+2 with PCB (Min 50%)"
                    error={errors.eligibility?.message}
                    {...register("eligibility")}
                  />

                  {/* Featured Toggle */}
                  <Controller
                    control={control}
                    name="featured"
                    render={({ field }) => (
                      <FormToggle
                        label="Highlight / Feature Course"
                        description="Highlights course catalog on public site."
                        checked={field.value}
                        onChange={field.onChange}
                        error={errors.featured?.message}
                        containerClassName="pt-2"
                      />
                    )}
                  />
                </div>

                {/* Description */}
                <FormTextarea
                  label="Brief Description"
                  required
                  rows={2}
                  placeholder="Provide a short overview of the curriculum..."
                  error={errors.description?.message}
                  {...register("description")}
                />

                {/* Career Scope */}
                <FormTextarea
                  label="Career Scope & Opportunities"
                  required
                  rows={2}
                  placeholder="Describe job aspects, industries, or average packages..."
                  error={errors.careerScope?.message}
                  {...register("careerScope")}
                />
              </div>

              {/* Image Upload & Submit Area */}
              <div className="flex flex-col justify-between space-y-4">
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ fieldState }) => (
                    <FormFileUpload
                      label="Banner / Thumbnail Image"
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
                      <span>Creating Course...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Course Listing</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </motion.div>

        {/* Bottom: Courses Catalog Grid */}
        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Course Catalog Directory
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">
              Review current academic listings registered in the institutional web portal.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Loader Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col space-y-4 animate-pulse">
                    <div className="w-full aspect-[16/10] bg-slate-150 dark:bg-slate-800 rounded-2xl" />
                    <div className="space-y-2 text-left">
                      <div className="w-1/4 h-3.5 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-2/3 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-1/2 h-3.5 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
                No Courses Available
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`group rounded-3xl border bg-white dark:bg-slate-900 shadow-premium overflow-hidden flex flex-col hover:border-[#D4A017]/30 transition-colors ${
                      item.featured
                        ? "border-[#D4A017] dark:border-[#D4A017]/50 ring-1 ring-[#D4A017]/20"
                        : "border-brand-cream-350 dark:border-slate-800"
                    }`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center border-b border-slate-100 dark:border-slate-850">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.imageUrl} 
                        alt={item.courseName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Abbreviation tag */}
                      <span className="absolute top-3 left-3 text-[8px] font-sans font-bold uppercase tracking-wider text-[#9B111E] bg-[#9B111E]/5 backdrop-blur-md px-2 py-0.5 rounded border border-[#9B111E]/10">
                        {item.shortName}
                      </span>

                      {/* Featured star banner */}
                      {item.featured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-[8px] font-bold text-[#D4A017] bg-[#D4A017]/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#D4A017]/20">
                          <Star className="w-2.5 h-2.5 fill-[#D4A017] text-[#D4A017]" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Course details card footer */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1">
                            {item.courseName}
                          </h4>
                          {item.description && (
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Metas */}
                        <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-50 dark:border-slate-850">
                          {item.duration && (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{item.duration}</span>
                            </div>
                          )}
                          {item.eligibility && (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate" title={item.eligibility}>{item.eligibility}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-50 dark:border-slate-850">
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
                            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 text-[#D4A017] hover:text-amber-700 transition-colors border border-amber-100 dark:border-amber-900/10 cursor-pointer flex items-center justify-center"
                            title="Edit Course"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/30 text-[#9B111E] hover:text-[#800F19] transition-colors border border-red-100 dark:border-red-900/10 cursor-pointer flex items-center justify-center"
                            title="Delete Course listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-cream-350 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
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
                      Edit Course
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Modify existing course record
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
              <form onSubmit={handleSubmitEdit(onEditSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Left: Text Fields */}
                  <div className="space-y-4">

                    {/* Course Name */}
                    <FormInput
                      label="Course Name"
                      required
                      placeholder="Full course name"
                      error={errorsEdit.courseName?.message}
                      {...registerEdit("courseName")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Short Name */}
                      <FormInput
                        label="Short Name"
                        required
                        placeholder="e.g. BPT"
                        error={errorsEdit.shortName?.message}
                        {...registerEdit("shortName")}
                      />

                      {/* Duration */}
                      <FormSelect
                        label="Duration"
                        required
                        placeholder="Select Duration"
                        options={durationOptions}
                        error={errorsEdit.duration?.message}
                        {...registerEdit("duration")}
                      />
                    </div>

                    {/* Eligibility */}
                    <FormInput
                      label="Eligibility Criteria"
                      required
                      placeholder="e.g. 10+2 with PCB (Min 50%)"
                      error={errorsEdit.eligibility?.message}
                      {...registerEdit("eligibility")}
                    />

                    {/* Description */}
                    <FormTextarea
                      label="Brief Description"
                      required
                      rows={2}
                      placeholder="Short overview of the curriculum..."
                      error={errorsEdit.description?.message}
                      {...registerEdit("description")}
                    />

                    {/* Career Scope */}
                    <FormTextarea
                      label="Career Scope"
                      required
                      rows={2}
                      placeholder="Describe job aspects, industries..."
                      error={errorsEdit.careerScope?.message}
                      {...registerEdit("careerScope")}
                    />

                    {/* Featured Toggle */}
                    <Controller
                      control={controlEdit}
                      name="featured"
                      render={({ field }) => (
                        <FormToggle
                          label="Mark as Featured Course"
                          description="Highlights course listing on the main site page."
                          checked={field.value}
                          onChange={field.onChange}
                          error={errorsEdit.featured?.message}
                          containerClassName="pt-2"
                        />
                      )}
                    />
                  </div>

                  {/* Right: Image Upload */}
                  <div className="flex flex-col justify-start">
                    <Controller
                      control={controlEdit}
                      name="imageUrl"
                      render={({ fieldState }) => (
                        <FormFileUpload
                          label="Course Image"
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
        itemName={deleteTargetName || "Course"}
      />

    </DashboardLayout>
  );
}
