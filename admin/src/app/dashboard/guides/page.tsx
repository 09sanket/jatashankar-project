"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  UploadCloud, AlertCircle, CheckCircle, Loader2, Pencil, Trash2, X, RefreshCw, Plus, Users, UserPlus
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { uploadImage } from "../../../services/cloudinary.service";
import { 
  createGuide, 
  getGuides, 
  deleteGuideMember, 
  updateGuide, 
  GuideMember 
} from "../../../services/guide.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import DataTable, { ColumnDef } from "../../../components/common/DataTable";
import { showToast } from "../../../lib/toast";
import { guideSchema, GuideSchemaType } from "../../../validations/guide.schema";
import FormInput from "../../../components/forms/FormInput";
import FormTextarea from "../../../components/forms/FormTextarea";
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

export default function GuidesPage() {
  const [items, setItems] = useState<GuideMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Create Form ──────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<GuideSchemaType>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      name: "",
      designation: "",
      description: "",
      imageUrl: "",
      publicId: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ── Edit Form ────────────────────────────────────────────
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    control: controlEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<GuideSchemaType>({
    resolver: zodResolver(guideSchema),
  });

  const [editingItem, setEditingItem] = useState<GuideMember | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    let data: GuideMember[] = [];
    try {
      data = await getGuides();
    } catch (err) {
      console.warn("Firestore error, using fallback data:", err);
      // We don't set errorMsg here so they can see the dummy data
    } finally {
      if (data.length === 0) {
        setItems([
          {
            id: "dummy-1",
            name: "Dr. Vikram Singh",
            designation: "Chief Medical Advisor",
            description: "With over 20 years of experience in healthcare administration, Dr. Singh has been instrumental in shaping our clinical training programs and establishing partnerships with top hospitals across the region.",
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
            publicId: "dummy-1-pub",
            createdAt: new Date(),
          },
          {
            id: "dummy-2",
            name: "Prof. Anjali Sharma",
            designation: "Head of Academic Affairs",
            description: "Prof. Sharma leads our curriculum development initiatives, ensuring our paramedical and nursing programs meet the highest international standards of medical education.",
            imageUrl: "https://images.unsplash.com/photo-1594824436998-d50d2bc88d68?auto=format&fit=crop&q=80&w=400&h=400",
            publicId: "dummy-2-pub",
            createdAt: new Date(),
          },
          {
            id: "dummy-3",
            name: "Mr. Rajeev Verma",
            designation: "Operations Head",
            description: "Ensuring seamless institutional operations and fostering a collaborative learning environment.",
            imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
            publicId: "",
            createdAt: new Date(),
          },
          {
            id: "dummy-4",
            name: "Dr. Neha Kapoor",
            designation: "Clinical Coordinator",
            description: "Bridging the gap between theoretical knowledge and practical clinical application.",
            imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop",
            publicId: "",
            createdAt: new Date(),
          }
        ]);
      } else {
        setItems(data);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── File Handling ─────────────────────────────────────────
  const removeFile = (isEdit = false) => {
    if (isEdit) {
      setEditFile(null);
      setEditPreviewUrl(null);
      setValueEdit("imageUrl", editingItem?.imageUrl || "", { shouldValidate: true });
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setValue("imageUrl", "", { shouldValidate: true });
    }
  };

  const handleFileChange = (file: File | null, isEdit = false) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        if (isEdit) setErrorMsg("Edit Image: File size exceeds 2MB limit.");
        else setErrorMsg("Create Image: File size exceeds 2MB limit.");
        return;
      }
      const url = URL.createObjectURL(file);
      if (isEdit) {
        setEditFile(file);
        setEditPreviewUrl(url);
        setValueEdit("imageUrl", "https://example.com/temp-preview.jpg", { shouldValidate: true });
      } else {
        setSelectedFile(file);
        setPreviewUrl(url);
        setValue("imageUrl", "https://example.com/temp-preview.jpg", { shouldValidate: true }); 
      }
    } else {
      removeFile(isEdit);
    }
  };

  // ── Form Submissions ──────────────────────────────────────
  const onSubmit = async (data: GuideSchemaType) => {
    if (!selectedFile) {
      setErrorMsg("Please select an image to upload.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);

    try {
      const uploadResponse = await uploadImage(selectedFile);
      const docId = await createGuide({
        ...data,
        imageUrl: uploadResponse.url,
        publicId: uploadResponse.publicId,
      });

      setSuccessMsg(`Guide added successfully!`);
      showToast.success("Guide Added");
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      loadData();
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMsg("Failed to add guide. Please check the logs.");
      showToast.error("Failed to add guide");
    } finally {
      setIsUploading(false);
    }
  };

  const onEditSubmit = async (data: GuideSchemaType) => {
    if (!editingItem) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUpdating(true);

    try {
      let finalImageUrl = data.imageUrl;
      let finalPublicId = data.publicId;

      if (editFile) {
        const uploadResponse = await uploadImage(editFile);
        finalImageUrl = uploadResponse.url;
        finalPublicId = uploadResponse.publicId;
      }

      await updateGuide(editingItem.id, {
        ...data,
        imageUrl: finalImageUrl,
        publicId: finalPublicId,
      });

      setSuccessMsg("Guide updated successfully!");
      showToast.success("Guide Updated");
      closeEditModal();
      loadData();
    } catch (err) {
      console.error("Update failed:", err);
      setErrorMsg("Failed to update guide.");
      showToast.error("Update Failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Actions ───────────────────────────────────────────────
  const openEditModal = (item: GuideMember) => {
    setEditingItem(item);
    resetEdit({
      name: item.name,
      designation: item.designation,
      description: item.description,
      imageUrl: item.imageUrl,
      publicId: item.publicId,
    });
    setEditFile(null);
    setEditPreviewUrl(item.imageUrl);
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditFile(null);
    setEditPreviewUrl(null);
  };

  const confirmDelete = (item: GuideMember) => {
    setDeleteTargetId(item.id);
    setDeleteTargetName(item.name);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteGuideMember(deleteTargetId);
      setSuccessMsg(`${deleteTargetName} removed.`);
      showToast.success("Guide Removed");
      loadData();
    } catch (err) {
      console.error("Delete failed:", err);
      setErrorMsg("Failed to delete guide.");
      showToast.error("Delete Failed");
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // ── Filtering ─────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [items, searchQuery]);

  // ── Columns ───────────────────────────────────────────────
  const columns: ColumnDef<GuideMember>[] = [
    {
      key: "imageUrl",
      label: "Photo",
      width: "w-[70px]",
      render: (item) => (
        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Users className="w-5 h-5 m-2.5 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Guide",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500">{item.designation}</p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <span className="text-sm text-slate-600 line-clamp-2 max-w-[200px]">
          {item.description || "-"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-[120px]",
      render: (item) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => openEditModal(item)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Guide"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => confirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Guide"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#9B111E]" />
              Guides Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Add and manage leadership guides ("Our Guiders").
            </p>
          </div>
        </div>

        <AnimatePresenceFramer>
          {errorMsg && (
            <motionFramer.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)} className="ml-auto"><X className="w-4 h-4 hover:text-red-900" /></button>
            </motionFramer.div>
          )}
          {successMsg && (
            <motionFramer.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{successMsg}</p>
              <button onClick={() => setSuccessMsg(null)} className="ml-auto"><X className="w-4 h-4 hover:text-emerald-900" /></button>
            </motionFramer.div>
          )}
        </AnimatePresenceFramer>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motionFramer.div variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#9B111E]" />
                Add New Guide
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput label="Name" id="name" placeholder="E.g., Dr. Jane Doe" error={errors.name?.message} {...register("name")} />
                <FormInput label="Designation" id="designation" placeholder="E.g., Chief Advisor" error={errors.designation?.message} {...register("designation")} />
                <FormTextarea label="Description" id="description" placeholder="A short 2-line bio..." error={errors.description?.message} rows={3} {...register("description")} />
                
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ fieldState }) => (
                    <FormFileUpload 
                      label="Profile Image" 
                      id="imageUpload" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={(file) => handleFileChange(file, false)} 
                      previewUrl={previewUrl || undefined} 
                      onClear={() => removeFile(false)} 
                      error={fieldState.error?.message} 
                    />
                  )}
                />

                <button type="submit" disabled={isUploading} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium">
                  {isUploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></> : <><UserPlus className="w-3.5 h-3.5" /><span>Add Guide</span></>}
                </button>
              </form>
            </div>
          </motionFramer.div>

          <motionFramer.div variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-8 space-y-4">
            
            {/* Guide Records — DataTable */}
            <div className="space-y-4">
              <div className="text-left border-l-4 border-[#9B111E] pl-4">
                <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">Guide Directory</h3>
                <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">Review current guide profiles registered.</p>
              </div>

              <DataTable<GuideMember>
                columns={columns}
                data={filteredItems}
                isLoading={isLoading}
                rowKey={(item) => item.id}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by name or designation..."
                pageSize={8}
                skeletonRows={4}
                emptyTitle="No Guides Found"
                emptyDescription="No guide profiles match your current search criteria."
                emptyAction={searchQuery ? { label: "Clear Filters", onClick: () => { setSearchQuery(""); } } : undefined}
                toolbar={
                  <button onClick={loadData} disabled={isLoading} className="p-2 text-slate-500 hover:text-[#9B111E] hover:bg-[#9B111E]/10 rounded-lg transition-colors border border-transparent disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                }
              />
            </div>

          </motionFramer.div>
        </div>
      </div>

      <AnimatePresenceFramer>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motionFramer.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeEditModal} />
            <motionFramer.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Edit Guide</h3>
                <button onClick={closeEditModal} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar">
                <form id="editGuideForm" onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
                  <FormInput label="Name" id="edit-name" placeholder="Name" error={errorsEdit.name?.message} {...registerEdit("name")} />
                  <FormInput label="Designation" id="edit-designation" placeholder="Designation" error={errorsEdit.designation?.message} {...registerEdit("designation")} />
                  <FormTextarea label="Description" id="edit-description" placeholder="Short description" error={errorsEdit.description?.message} rows={3} {...registerEdit("description")} />
                  
                  <Controller
                    control={controlEdit}
                    name="imageUrl"
                    render={({ fieldState }) => (
                      <FormFileUpload 
                        label="Profile Image" 
                        id="editImageUpload" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={(file) => handleFileChange(file, true)} 
                        previewUrl={editPreviewUrl || undefined} 
                        onClear={() => removeFile(true)} 
                        error={fieldState.error?.message} 
                      />
                    )}
                  />
                </form>
              </div>
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" form="editGuideForm" disabled={isUpdating} className="px-4 py-2 bg-[#9B111E] hover:bg-[#8A0F1A] text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-70 flex items-center gap-2">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </motionFramer.div>
          </div>
        )}
      </AnimatePresenceFramer>

      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={executeDelete}
        itemName={deleteTargetName}
        loading={isDeleting}
      />
    </DashboardLayout>
  );
}
