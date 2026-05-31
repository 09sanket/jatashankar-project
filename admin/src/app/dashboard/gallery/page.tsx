"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, UploadCloud, AlertCircle, CheckCircle, Loader2, Pencil, Trash2, X, RefreshCw, Plus, Image as ImageIcon
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { uploadImage } from "../../../services/cloudinary.service";
import { 
  createGalleryItem, 
  getGalleryItems, 
  deleteGalleryItem, 
  updateGalleryItem, 
  GalleryItem 
} from "../../../services/gallery.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import DataTable from "../../../components/common/DataTable";
import TableFilters from "../../../components/common/TableFilters";
import { ColumnDef } from "../../../components/common/DataTable";
import { showToast } from "../../../lib/toast";
import { gallerySchema, GallerySchemaType, categoriesList } from "../../../validations/gallery.schema";
import FormInput from "../../../components/forms/FormInput";
import FormTextarea from "../../../components/forms/FormTextarea";
import FormSelect from "../../../components/forms/FormSelect";
import FormFileUpload from "../../../components/forms/FormFileUpload";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
} as const;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2 } },
} as const;

const galleryCategories = categoriesList.map((c) => ({ label: c, value: c }));

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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
  } = useForm<GallerySchemaType>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Campus",
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
  } = useForm<GallerySchemaType>({
    resolver: zodResolver(gallerySchema),
  });

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Inline notifications (create / edit only)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const data = await getGalleryItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
      setErrorMsg("Failed to load gallery items.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Filtered Data ─────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    let result = items;

    // Category filter
    if (categoryFilter) {
      result = result.filter((i) => i.category === categoryFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, searchQuery, categoryFilter]);

  // ── File Helpers ──────────────────────────────────────────────────────────
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

  // ── Upload Handler ────────────────────────────────────────────────────────
  const onUploadSubmit = async (data: GallerySchemaType) => {
    if (!selectedFile) {
      setErrorMsg("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const uploadResult = await uploadImage(selectedFile);
      await createGalleryItem({
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
      });

      setSuccessMsg("Gallery item uploaded successfully!");
      showToast.success("Gallery Item Uploaded Successfully ✅");
      
      // Reset Create Form
      handleResetForm();

      await fetchItems();
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "An error occurred during upload.");
      showToast.error("Gallery Upload Failed", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ── Delete Handlers ───────────────────────────────────────────────────────
  const handleDeleteClick = (item: GalleryItem) => {
    setDeleteTargetId(item.id);
    setDeleteTargetName(item.title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteGalleryItem(deleteTargetId);
      setItems((prev) => prev.filter((i) => i.id !== deleteTargetId));
      showToast.success("Gallery Item Deleted Successfully ✅");
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      showToast.error("Failed to delete gallery item.", err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) { setDeleteTargetId(null); setDeleteTargetName(""); }
  };

  // ── Edit Handlers ─────────────────────────────────────────────────────────
  const handleEditClick = (item: GalleryItem) => {
    setEditingItem(item);
    resetEdit({
      title: item.title,
      description: item.description,
      category: item.category as any,
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

  const onEditSubmit = async (data: GallerySchemaType) => {
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

      await updateGalleryItem(editingItem.id, {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        imageUrl,
        publicId,
      });

      setSuccessMsg("Gallery item updated successfully!");
      showToast.success("Gallery Item Updated Successfully ✅");

      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, title: data.title.trim(), description: data.description.trim(), category: data.category, imageUrl, publicId }
            : item
        )
      );
      handleEditClose();
    } catch (err: any) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Failed to update gallery item.");
      showToast.error("Failed to update gallery item", err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (item: GalleryItem) => {
    if (item.createdAt?.toDate) {
      return item.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return "Recent";
  };

  // ── Column Definitions ────────────────────────────────────────────────────
  const columns: ColumnDef<GalleryItem>[] = useMemo(
    () => [
      {
        key: "imageUrl",
        label: "Image",
        width: "w-[80px]",
        render: (item) => (
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ),
      },
      {
        key: "title",
        label: "Title",
        sortable: true,
        render: (item) => (
          <div className="space-y-0.5 min-w-[140px]">
            <span className="font-bold text-slate-900 dark:text-white block leading-tight line-clamp-1">
              {item.title}
            </span>
            {item.description && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 block">
                {item.description}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "category",
        label: "Category",
        sortable: true,
        render: (item) => (
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#9B111E] bg-[#9B111E]/5 px-2 py-0.5 rounded border border-[#9B111E]/10 whitespace-nowrap">
            {item.category}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created Date",
        sortable: true,
        hideOnMobile: true,
        render: (item) => (
          <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500 text-[10px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="whitespace-nowrap">{formatDate(item)}</span>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        headerAlign: "right",
        cellAlign: "right",
        render: (item) => (
          <div className="flex items-center justify-end gap-1.5">
            {/* Edit */}
            <button
              onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
              className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-955/20 dark:hover:bg-amber-900/30 text-[#D4A017] hover:text-amber-700 transition-colors border border-amber-100 dark:border-amber-900/10 cursor-pointer flex items-center justify-center"
              title="Edit Gallery Item"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/30 text-[#9B111E] hover:text-[#800F19] transition-colors border border-red-100 dark:border-red-900/10 cursor-pointer flex items-center justify-center"
              title="Delete Gallery Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [items] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Filter Toolbar ────────────────────────────────────────────────────────
  const filterToolbar = (
    <div className="flex flex-wrap items-end gap-4">
      <TableFilters
        filters={[
          {
            key: "category",
            label: "Category",
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { label: "All Categories", value: "" },
              ...categoriesList.map((c) => ({ label: c, value: c })),
            ],
          },
        ]}
        onReset={() => setCategoryFilter("")}
      />

      {/* Stats Pill */}
      <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3">
        <div className="text-left">
          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Assets
          </span>
          <span className="text-lg font-serif font-extrabold text-slate-900 dark:text-white">
            {isLoading ? "…" : items.length}
          </span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[#9B111E]/5 border border-[#9B111E]/10 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-[#9B111E]" />
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Heading */}
        <div className="text-left border-l-4 border-[#9B111E] pl-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Gallery Management
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Upload, view, and manage images from the institute gallery database.
          </p>
        </div>

        {/* Inline Notifications (create/edit only) */}
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

        {/* Upload Form Card */}
        <motion.div
          className="p-6 sm:p-8 rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium text-left"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-sm sm:text-base font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4A017]" />
              <span>Upload New Gallery Item</span>
            </h3>
          </div>

          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Title */}
                <FormInput
                  label="Item Title"
                  required
                  placeholder="Enter visual item title"
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Category */}
                <FormSelect
                  label="Category Type"
                  required
                  placeholder="Select Category"
                  options={galleryCategories}
                  error={errors.category?.message}
                  {...register("category")}
                />

                {/* Description */}
                <FormTextarea
                  label="Short Description"
                  required
                  rows={3}
                  placeholder="Provide brief context of the item"
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              {/* Image Upload Area */}
              <div className="flex flex-col justify-between space-y-4">
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ fieldState }) => (
                    <FormFileUpload
                      label="Upload Asset"
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
                      <span>Uploading to cloud...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Gallery Asset</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Asset Records — DataTable */}
        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Asset Records Registry
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5">
              Review current gallery records populated in the institutional portal database.
            </p>
          </div>

          <DataTable<GalleryItem>
            columns={columns}
            data={filteredItems}
            isLoading={isLoading}
            rowKey={(item) => item.id}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by title or category..."
            pageSize={8}
            skeletonRows={4}
            emptyTitle="No Gallery Assets Found"
            emptyDescription="No gallery items match your current search or filter criteria."
            emptyAction={
              searchQuery || categoryFilter
                ? { label: "Clear Filters", onClick: () => { setSearchQuery(""); setCategoryFilter(""); } }
                : undefined
            }
            toolbar={filterToolbar}
          />
        </div>
      </div>

      {/* ── Edit Modal ── */}
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
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-955/30 border border-amber-100 dark:border-amber-900/20 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-[#D4A017]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                      Edit Gallery Item
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Modify existing record details
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
                    <FormInput
                      label="Item Title"
                      required
                      placeholder="Enter visual item title"
                      error={errorsEdit.title?.message}
                      {...registerEdit("title")}
                    />

                    <FormSelect
                      label="Category Type"
                      required
                      placeholder="Select Category"
                      options={galleryCategories}
                      error={errorsEdit.category?.message}
                      {...registerEdit("category")}
                    />

                    <FormTextarea
                      label="Short Description"
                      required
                      rows={3}
                      placeholder="Provide brief context of the item"
                      error={errorsEdit.description?.message}
                      {...registerEdit("description")}
                    />
                  </div>

                  {/* Right: Image Area */}
                  <div className="flex flex-col justify-start">
                    <Controller
                      control={controlEdit}
                      name="imageUrl"
                      render={({ fieldState }) => (
                        <FormFileUpload
                          label="Gallery Image"
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

                {/* Modal Actions */}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemName={deleteTargetName || "Gallery Item"}
      />
    </DashboardLayout>
  );
}
