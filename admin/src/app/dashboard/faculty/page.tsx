"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Calendar, UploadCloud, AlertCircle, CheckCircle, Loader2, Pencil, Trash2, X, RefreshCw, Plus, Users, Briefcase, GraduationCap, UserPlus
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { uploadImage } from "../../../services/cloudinary.service";
import { 
  createFaculty, 
  getFaculty, 
  deleteFacultyMember, 
  updateFaculty, 
  FacultyMember 
} from "../../../services/faculty.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import DataTable from "../../../components/common/DataTable";
import TableFilters from "../../../components/common/TableFilters";
import { ColumnDef } from "../../../components/common/DataTable";
import { showToast } from "../../../lib/toast";
import { facultySchema, FacultySchemaType, departmentsList } from "../../../validations/faculty.schema";
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

const facultyDepartments = departmentsList.map((d) => ({ label: d, value: d }));

export default function FacultyPage() {
  const [items, setItems] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

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
  } = useForm<FacultySchemaType>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      designation: "",
      department: "Physiotherapy",
      experience: "",
      specialization: "",
      description: "",
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
  } = useForm<FacultySchemaType>({
    resolver: zodResolver(facultySchema),
  });

  const [editingItem, setEditingItem] = useState<FacultyMember | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Notifications
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const data = await getFaculty();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch faculty members:", err);
      setErrorMsg("Failed to load faculty members.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Filtered Data ─────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    let result = items;
    if (deptFilter) result = result.filter((i) => i.department === deptFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.designation.toLowerCase().includes(q) ||
          i.department.toLowerCase().includes(q) ||
          i.specialization.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, searchQuery, deptFilter]);

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
  const onUploadSubmit = async (data: FacultySchemaType) => {
    if (!selectedFile) {
      setErrorMsg("Please select a profile image to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const uploadResult = await uploadImage(selectedFile);
      await createFaculty({
        name: data.name.trim(),
        designation: data.designation.trim(),
        department: data.department,
        experience: data.experience.trim(),
        specialization: data.specialization.trim(),
        description: data.description.trim(),
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
      });
      setSuccessMsg("Faculty profile created successfully!");
      showToast.success("Faculty Profile Created Successfully ✅");
      
      // Reset Form
      handleResetForm();

      await fetchItems();
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "An error occurred during profile creation.");
      showToast.error("Faculty Creation Failed", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ── Delete Handlers ───────────────────────────────────────────────────────
  const handleDeleteClick = (item: FacultyMember) => {
    setDeleteTargetId(item.id); setDeleteTargetName(item.name);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteFacultyMember(deleteTargetId);
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      showToast.success("Faculty Profile Deleted Successfully ✅");
      setDeleteTargetId(null); setDeleteTargetName("");
    } catch (err: any) {
      console.error("Failed to delete faculty member:", err);
      showToast.error("Failed to delete faculty member.", err?.message);
    } finally { setIsDeleting(false); }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) { setDeleteTargetId(null); setDeleteTargetName(""); }
  };

  // ── Edit Handlers ─────────────────────────────────────────────────────────
  const handleEditClick = (item: FacultyMember) => {
    setEditingItem(item);
    resetEdit({
      name: item.name,
      designation: item.designation,
      department: item.department as any,
      experience: item.experience,
      specialization: item.specialization,
      description: item.description,
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

  const onEditSubmit = async (data: FacultySchemaType) => {
    if (!editingItem) return;

    setIsUpdating(true); setErrorMsg(null); setSuccessMsg(null);
    try {
      let imageUrl = editingItem.imageUrl;
      let publicId = editingItem.publicId;

      if (editFile) {
        const uploadResult = await uploadImage(editFile);
        imageUrl = uploadResult.url; publicId = uploadResult.publicId;
      }

      await updateFaculty(editingItem.id, {
        name: data.name.trim(),
        designation: data.designation.trim(),
        department: data.department,
        experience: data.experience.trim(),
        specialization: data.specialization.trim(),
        description: data.description.trim(),
        imageUrl,
        publicId,
      });

      setSuccessMsg("Faculty Member Updated Successfully ✅");
      showToast.success("Faculty Member Updated Successfully ✅");
      
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: data.name.trim(),
                designation: data.designation.trim(),
                department: data.department,
                experience: data.experience.trim(),
                specialization: data.specialization.trim(),
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
      setErrorMsg(err.message || "An error occurred during faculty update.");
      showToast.error("Failed to update faculty member", err.message);
    } finally { setIsUpdating(false); }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (item: FacultyMember) => {
    if (item.createdAt?.toDate) {
      return item.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return "Recent";
  };

  // ── Column Definitions ────────────────────────────────────────────────────
  const columns: ColumnDef<FacultyMember>[] = useMemo(() => [
    {
      key: "imageUrl",
      label: "Photo",
      width: "w-[70px]",
      render: (item) => (
        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5 min-w-[130px]">
          <span className="font-bold text-slate-900 dark:text-white block leading-tight">{item.name}</span>
          <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wide block">{item.designation}</span>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      hideOnMobile: true,
      render: (item) => (
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#9B111E] bg-[#9B111E]/5 px-2 py-0.5 rounded border border-[#9B111E]/10 whitespace-nowrap">
          {item.department}
        </span>
      ),
    },
    {
      key: "experience",
      label: "Exp.",
      hideOnMobile: true,
      render: (item) =>
        item.experience ? (
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="whitespace-nowrap">{item.experience}</span>
          </div>
        ) : <span className="text-slate-400">—</span>,
    },
    {
      key: "specialization",
      label: "Specialization",
      hideOnMobile: true,
      render: (item) =>
        item.specialization ? (
          <div className="flex items-center gap-1 text-[10px] text-slate-500 max-w-[140px]">
            <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{item.specialization}</span>
          </div>
        ) : <span className="text-slate-400">—</span>,
    },
    {
      key: "createdAt",
      label: "Date",
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
          <button
            onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-955/20 dark:hover:bg-amber-900/30 text-[#D4A017] hover:text-amber-700 transition-colors border border-amber-100 dark:border-amber-900/10 cursor-pointer flex items-center justify-center"
            title="Edit Faculty Profile"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/30 text-[#9B111E] hover:text-[#800F19] transition-colors border border-red-100 dark:border-red-900/10 cursor-pointer flex items-center justify-center"
            title="Delete Faculty Profile"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ], [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter Toolbar ────────────────────────────────────────────────────────
  const filterToolbar = (
    <div className="flex flex-wrap items-end gap-4">
      <TableFilters
        filters={[{
          key: "department", label: "Department", value: deptFilter, onChange: setDeptFilter,
          options: [{ label: "All Departments", value: "" }, ...departmentsList.map((d) => ({ label: d, value: d }))],
        }]}
        onReset={() => setDeptFilter("")}
      />
      <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3">
        <div className="text-left">
          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Faculty</span>
          <span className="text-lg font-serif font-extrabold text-slate-900 dark:text-white">{isLoading ? "…" : items.length}</span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[#9B111E]/5 border border-[#9B111E]/10 flex items-center justify-center">
          <Users className="w-4 h-4 text-[#9B111E]" />
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
            Faculty Management
          </h2>
          <p className="text-xs text-slate-550 font-semibold">
            Manage institutional faculty profiles, specialties, departments, and credentials.
          </p>
        </div>

        {/* Notifications */}
        <AnimatePresenceFramer>
          {errorMsg && (
            <motionFramer.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-50 dark:bg-red-955/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMsg}</span>
            </motionFramer.div>
          )}
          {successMsg && (
            <motionFramer.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-green-50 dark:bg-green-955/20 border border-green-200/50 dark:border-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex items-center gap-2 text-left">
              <CheckCircle className="w-4 h-4 shrink-0" /><span>{successMsg}</span>
            </motionFramer.div>
          )}
        </AnimatePresenceFramer>

        {/* Upload Form Card */}
        <motionFramer.div className="p-6 sm:p-8 rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium text-left"
          variants={cardVariants} initial="hidden" animate="visible">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-sm sm:text-base font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#D4A017]" /><span>Register New Faculty Member</span>
            </h3>
          </div>
          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  required
                  placeholder="Enter full legal name (e.g. Dr. Ramesh Kumar)"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Designation"
                    required
                    placeholder="e.g. Assistant Professor"
                    error={errors.designation?.message}
                    {...register("designation")}
                  />

                  <FormSelect
                    label="Department"
                    required
                    placeholder="Select Department"
                    options={facultyDepartments}
                    error={errors.department?.message}
                    {...register("department")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Experience"
                    required
                    placeholder="e.g. 5+ Years"
                    error={errors.experience?.message}
                    {...register("experience")}
                  />

                  <FormInput
                    label="Specialization"
                    required
                    placeholder="e.g. Orthopedics, Bio-chemistry"
                    error={errors.specialization?.message}
                    {...register("specialization")}
                  />
                </div>

                <FormTextarea
                  label="Bio / Profile Summary"
                  required
                  rows={3}
                  placeholder="Provide professional details, publications, or research summaries..."
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ fieldState }) => (
                    <FormFileUpload
                      label="Profile Image Upload"
                      required
                      previewUrl={previewUrl || undefined}
                      error={fieldState.error?.message}
                      onChange={handleFileChange}
                      onClear={() => handleFileChange(null)}
                      containerClassName="flex-1 flex flex-col"
                    />
                  )}
                />

                <button type="submit" disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium">
                  {isUploading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Creating Profile...</span></>) : (<><UserPlus className="w-3.5 h-3.5" /><span>Save Faculty Record</span></>)}
                </button>
              </div>
            </div>
          </form>
        </motionFramer.div>

        {/* Faculty Records — DataTable */}
        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">Faculty Records Directory</h3>
            <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">Review current faculty profiles registered in the institutional system database.</p>
          </div>

          <DataTable<FacultyMember>
            columns={columns}
            data={filteredItems}
            isLoading={isLoading}
            rowKey={(item) => item.id}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by name, designation, or department..."
            pageSize={8}
            skeletonRows={4}
            emptyTitle="No Faculty Members Found"
            emptyDescription="No faculty profiles match your current search or filter criteria."
            emptyAction={searchQuery || deptFilter ? { label: "Clear Filters", onClick: () => { setSearchQuery(""); setDeptFilter(""); } } : undefined}
            toolbar={filterToolbar}
          />
        </div>
      </div>

      {/* Edit Faculty Modal */}
      <AnimatePresenceFramer>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motionFramer.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleEditClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motionFramer.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 p-6 sm:p-8 text-left">
              <button onClick={handleEditClose} className="absolute right-6 top-6 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 text-left">
                <h3 className="text-sm sm:text-base font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-[#D4A017]" /><span>Edit Faculty Profile</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Modifying profile details for: <span className="font-bold text-[#9B111E]">{editingItem.name}</span>
                </p>
              </div>
              <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormInput
                      label="Full Name"
                      required
                      placeholder="Full Name"
                      error={errorsEdit.name?.message}
                      {...registerEdit("name")}
                    />

                    <FormInput
                      label="Designation"
                      required
                      placeholder="Designation"
                      error={errorsEdit.designation?.message}
                      {...registerEdit("designation")}
                    />

                    <FormSelect
                      label="Department"
                      required
                      placeholder="Select Department"
                      options={facultyDepartments}
                      error={errorsEdit.department?.message}
                      {...registerEdit("department")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Experience"
                        required
                        placeholder="Experience"
                        error={errorsEdit.experience?.message}
                        {...registerEdit("experience")}
                      />

                      <FormInput
                        label="Specialization"
                        required
                        placeholder="Specialization"
                        error={errorsEdit.specialization?.message}
                        {...registerEdit("specialization")}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 flex flex-col justify-between">
                    <FormTextarea
                      label="Bio / Summary"
                      required
                      rows={4}
                      placeholder="Bio / Summary"
                      error={errorsEdit.description?.message}
                      {...registerEdit("description")}
                      containerClassName="flex-1 flex flex-col"
                      className="flex-1"
                    />

                    <div className="space-y-1.5">
                      <Controller
                        control={controlEdit}
                        name="imageUrl"
                        render={({ fieldState }) => (
                          <FormFileUpload
                            label="Profile Photo (Optional Replace)"
                            required
                            previewUrl={editPreviewUrl || undefined}
                            error={fieldState.error?.message}
                            onChange={handleEditFileChange}
                            onClear={() => handleEditFileChange(null)}
                            containerClassName="w-full"
                          />
                        )}
                      />
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">
                        {editFile ? "New image selected — will replace existing" : "Leave empty to keep current image"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={handleEditClose}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUpdating}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-premium">
                    {isUpdating ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Updating...</span></>) : (<span>Save Changes</span>)}
                  </button>
                </div>
              </form>
            </motionFramer.div>
          </div>
        )}
      </AnimatePresenceFramer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal isOpen={!!deleteTargetId} onClose={handleDeleteModalClose} onConfirm={handleConfirmDelete} loading={isDeleting} itemName={deleteTargetName || "Faculty Member"} />
    </DashboardLayout>
  );
}
